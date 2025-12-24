import { dbConnect } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import PaintingOrder from "@/models/PaintingOrder";
import { NextResponse, NextRequest } from "next/server";

// GET - Retrieve all orders
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const authError = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
        if (authError) return authError;
        // Connect to database
        await dbConnect();

        const orders = await PaintingOrder.find({})
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return NextResponse.json(
            { success: true, payload: orders ,count: orders.length},
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
