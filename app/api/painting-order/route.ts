import { NextResponse } from 'next/server';
import PaintingOrder from '@/models/PaintingOrder';
import { dbConnect } from '@/lib/db';
import { validatePaintingOrderWithBusinessLogic } from '../../../lib/validations/paintingOrderValidation';
import { emailService } from '../contact/nodemailer';
import { getPaintingOrderHTML } from '../../../src/templates/emails/email-templates';
import { envs } from '../../../configs/env';

// POST - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate using Joi schema with business logic
    const validation = validatePaintingOrderWithBusinessLogic(body);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors[0]?.message || 'Validation failed',
        },
        { status: 400 }
      );
    }

    // Connect to database after validation
    await dbConnect();

    const order = await PaintingOrder.create({
      user: {
        name: validation.sanitizedData!.name.trim(),
        email: validation.sanitizedData!.email.trim().toLowerCase(),
        phone: validation.sanitizedData!.phone.trim(),
        address: validation.sanitizedData!.address.trim(),
        city: validation.sanitizedData!.city.trim(),
        state: validation.sanitizedData!.state.trim(),
        postal: validation.sanitizedData!.postal.trim(),
        country: validation.sanitizedData!.country.trim(),
      },
      paintingId: validation.sanitizedData!.paintingId.trim(),
    });

    //! send email with TSX template
    if (order.user.email) {
      await Promise.allSettled([
        emailService.send({
          to: envs.email.user,
          subject: 'Order Confirmation',
          text: 'Your order has been received. We will get back to you soon.',
          html: getPaintingOrderHTML({
            _id: order._id,
            user: {
              name: order.user.name,
              email: order.user.email,
              phone: order.user.phone,
            },
            createdAt: order.createdAt,
            customSize: order.customSize,
            customMessage: order.customMessage,
          }),
        }),

        emailService.send({
          to: order.user.email,
          subject: 'Order Confirmation',
          text: 'Your order has been received. We will get back to you soon.',
          html: getPaintingOrderHTML({
            _id: order._id,
            user: {
              name: order.user.name,
              email: order.user.email,
              phone: order.user.phone,
            },
            createdAt: order.createdAt,
            customSize: order.customSize,
            customMessage: order.customMessage,
          }),
        }),
      ]);
    }

    return NextResponse.json(
      {
        success: true,
        payload: order,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        // error: 'Failed to create order',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
