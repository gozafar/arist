import { dbConnect } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import PaintingOrder from "@/models/PaintingOrder";
import { NextRequest, NextResponse } from "next/server";

// GET - Retrieve a single order by ID (admin only)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    try {
        // Authenticate and authorize user
        const authError = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
        if (authError) return authError;

        // Extract order ID from URL parameters (not query params)
        const orderPromise = await params;
        const orderId = orderPromise.id;

        // Validate ObjectId format
        if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Invalid order ID format" 
                },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Fetch single order by ID
        const order = await PaintingOrder.findById(orderId)
            .populate('paintingId', 'title price image availability')
            .lean()
            .exec();

        if (!order) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Order not found" 
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                data: order 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching admin order:", error);
        
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to fetch order",
                message: error instanceof Error ? error.message : "Unknown error occurred"
            },
            { status: 500 }
        );
    }
}