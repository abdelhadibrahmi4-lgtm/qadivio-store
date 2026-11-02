import { NextResponse } from 'next/server';
import { createOrder, getOrders } from '@/lib/db';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side validation
    const { customerName, customerPhone, customerEmail, wilayaCode, wilayaName, items, total, paymentMethod } = body;

    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'يرجى تقديم اسم صالح' }, { status: 400 });
    }

    if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim().length < 8) {
      return NextResponse.json({ error: 'يرجى تقديم رقم هاتف صالح' }, { status: 400 });
    }

    if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
      return NextResponse.json({ error: 'يرجى تقديم بريد إلكتروني صالح لاستلام التفعيل' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'لا يمكن إنشاء طلب بسلة فارغة' }, { status: 400 });
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ error: 'قيمة الطلب غير صالحة' }, { status: 400 });
    }

    const newOrder = await createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      wilayaCode: wilayaCode || '16',
      wilayaName: wilayaName || 'الجزائر العاصمة',
      city: body.city?.trim() || '',
      notes: body.notes?.trim() || '',
      items,
      subtotal: body.subtotal || total,
      discount: body.discount || 0,
      couponCode: body.couponCode,
      total,
      paymentMethod: paymentMethod || 'baridimob',
      paymentReceiptNumber: body.paymentReceiptNumber?.trim() || undefined,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الطلب' }, { status: 500 });
  }
}
