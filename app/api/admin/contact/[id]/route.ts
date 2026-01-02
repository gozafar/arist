import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Contact from '@/models/Contact';
import { dbConnect } from '@/lib/db';
import { validateContactUpdate } from '../../../../../lib/validations/contactValidation';

// GET /api/admin/contact/[id] - Get a specific contact by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find contact by ID
    const contact = await Contact.findById(id).select('-__v');

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        message: contact.message,
        status: contact.status,
        adminNotes: contact.adminNotes,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      }
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/contact/[id] - Update a specific contact by ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, message, status, adminNotes } = body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID format' },
        { status: 400 }
      );
    }

    // Validate update data using Joi
    const validationResult = validateContactUpdate({ name, email, phone, message, status, adminNotes });
    
    if (!validationResult.isValid) {
      return NextResponse.json(
        { 
          // error: 'Validation failed', 
          error: validationResult.errors.map((err) => err.message)
        },
        { status: 400 }
      );
    }

    await dbConnect();
    // Find contact by ID
    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Check if email is being updated and if it conflicts with existing contact
    if (email && email !== contact.email) {
      const existingContact = await Contact.findOne({ 
        email: email.trim().toLowerCase(),
        _id: { $ne: id } // Exclude current contact from check
      });
      
      if (existingContact) {
        return NextResponse.json(
          { error: 'A contact with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Update contact fields with validated data
    if (name !== undefined) contact.name = name.trim();
    if (email !== undefined) contact.email = email.trim().toLowerCase();
    if (phone !== undefined) contact.phone = phone?.trim() || undefined;
    if (message !== undefined) contact.message = message.trim();
    if (status !== undefined) contact.status = status;
    if (adminNotes !== undefined) contact.adminNotes = adminNotes?.trim() || undefined;

    await contact.save();

    return NextResponse.json(
      { 
        message: 'Contact updated successfully',
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          message: contact.message,
          status: contact.status,
          adminNotes: contact.adminNotes,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        }
      }
    );

  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/contact/[id] - Delete a specific contact by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid contact ID format' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find and delete contact by ID
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Contact deleted successfully',
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
        }
      }
    );

  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}