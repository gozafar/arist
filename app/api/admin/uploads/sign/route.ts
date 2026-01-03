import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';

export const POST = async (req: NextRequest) => {
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) {
    return authError;
  }

  return NextResponse.json({
    uploadUrl: 'https://example.com/upload',
    fileUrl: 'https://example.com/file.jpg',
  });
};
