import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    if (password === correctPassword) {
      return NextResponse.json({ success: true, message: 'تم التحقق بنجاح' });
    }

    return NextResponse.json(
      { success: false, message: 'كلمة المرور غير صحيحة' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطأ في المصادقة' },
      { status: 500 }
    );
  }
}
