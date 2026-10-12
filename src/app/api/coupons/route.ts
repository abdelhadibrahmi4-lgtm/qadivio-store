import { NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'يرجى إدخال كود صحيح' }, { status: 400 });
    }

    const result = await validateCoupon(code, subtotal || 0);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ valid: false, message: 'خطأ في التحقق من الكود' }, { status: 500 });
  }
}
