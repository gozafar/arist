import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Contact from '@/models/Contact';
import { dbConnect } from '@/lib/db';
import { sanitizeContactData, validateContactForm } from '../../../lib/validations/contactValidation';
import { ValidationError } from 'next/dist/compiled/amphtml-validator';
import { emailService } from './nodemailer';
import { getContactUsHTML } from '../../../src/templates/emails/email-templates';
import { envs } from '../../../configs/env';
// import { error } from 'console';

// POST /api/contact - Create new contact submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, status, adminNotes } = body;

    // Validate form data
    const validationResult = validateContactForm({ name, email, phone, message, status, adminNotes });

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          // error: 'Validation failed',
          error: validationResult.errors.map((err: ValidationError) => err.message),
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Sanitize and prepare contact data
    const sanitizedData = sanitizeContactData({ name, email, phone, message, status, adminNotes });

    // Create new contact
    const contact = await Contact.create(sanitizedData);

    //! send email with TSX template
    if (contact) {
      await Promise.allSettled([
        emailService.send({
          to: envs.email.user,
          subject: 'Thank you for contacting us',
          text: 'Thank you for contacting us. We will get back to you soon.',
          html: getContactUsHTML({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            message: contact.message,
          }),
        }),

        emailService.send({
          to: contact.email,
          subject: 'Thank you for contacting us',
          text: 'Thank you for contacting us. We will get back to you soon.',
          html: getContactUsHTML({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            message: contact.message,
          }),
        }),
      ]);
    }

    return NextResponse.json(
      {
        message: 'Contact created successfully',
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: contact.message,
          status: contact.status,
          adminNotes: contact.adminNotes,
          createdAt: contact.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
