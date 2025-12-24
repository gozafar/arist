import { NextResponse } from "next/server";
import PaintingOrder from "@/models/PaintingOrder";
import { dbConnect } from "@/lib/db";


// POST - Create new order
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation
        const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'postal', 'paintingId'];
        for (const field of requiredFields) {
            if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
                return NextResponse.json(
                    { success: false, error: `${field} is required` },
                    { status: 400 }
                );
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { success: false, error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Phone validation (basic)
        if (body.phone.replace(/\D/g, '').length < 10) {
            return NextResponse.json(
                { success: false, error: "Invalid phone number" },
                { status: 400 }
            );
        }

        // Connect to database after validation
        await dbConnect();

        // Check for existing email
        const existingEmail = await PaintingOrder.findOne({ 'user.email': body.email.toLowerCase().trim() });

        if (existingEmail) {
            return NextResponse.json(
                { success: false, error: "Email already exists" },
                { status: 409 }
            );
        }

        // Check for existing phone
        const existingPhone = await PaintingOrder.findOne({ 'user.phone': body.phone.trim() });

        if (existingPhone) {
            return NextResponse.json(
                { success: false, error: "Phone number already exists" },
                { status: 409 }
            );
        }

        const order = await PaintingOrder.create({
            user: {
                name: body.name.trim(),
                email: body.email.trim().toLowerCase(),
                phone: body.phone.trim(),
                address: body.address.trim(),
                city: body.city.trim(),
                state: body.state.trim(),
                postal: body.postal.trim(),
            },
            paintingId: body.paintingId.trim(),
        });

        console.log(order, "=============>52")
        return NextResponse.json(
            { success: true, payload: order },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create order" },
            { status: 500 }
        );
    }
}

