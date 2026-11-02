import { NextResponse } from 'next/server';
import { getOrderById, findOrdersByPhone, updateOrderStatus } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = decodeURIComponent(params.id);
    let order = await getOrderById(rawId);

    // If not found by exact ID, try searching by phone number
    if (!order) {
      const orders = await findOrdersByPhone(rawId);
      if (orders.length > 0) {
        order = orders[0];
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الطلب' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, activationCodeOrAccount } = body;

    const updated = await updateOrderStatus(params.id, status, activationCodeOrAccount);
    if (!updated) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في تحديث حالة الطلب' }, { status: 500 });
  }
}
