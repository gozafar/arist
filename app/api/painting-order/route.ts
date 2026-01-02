import { NextResponse } from 'next/server';
import PaintingOrder from '@/models/PaintingOrder';
import { dbConnect } from '@/lib/db';
import {
  validatePaintingOrderWithBusinessLogic,
  PaintingOrderFormData,
} from '../../../lib/validations/paintingOrderValidation';

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

    // Check for existing email
    const existingEmail = await PaintingOrder.findOne({
      'user.email': validation.sanitizedData!.email.toLowerCase().trim(),
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists',
          field: 'email',
        },
        { status: 409 }
      );
    }

    // Check for existing phone
    const existingPhone = await PaintingOrder.findOne({
      'user.phone': validation.sanitizedData!.phone.trim(),
    });

    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone number already exists',
          field: 'phone',
        },
        { status: 409 }
      );
    }

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
