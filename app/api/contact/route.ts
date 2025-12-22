import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const payload = (await req.json()) as { name?: string; email?: string; message?: string };
  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  return NextResponse.json({ status: "ok" });
};
