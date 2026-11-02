import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'لم يتم إرسال أي ملف' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, cleanName);

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${cleanName}`,
      });
    }

    // JSON base64 upload
    const body = await req.json();
    if (body.imageBase64) {
      const matches = body.imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mime = matches[1];
        const base64Data = matches[2];
        const ext = mime.includes('png') ? '.png' : mime.includes('webp') ? '.webp' : '.jpg';
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filePath = path.join(uploadsDir, cleanName);

        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        return NextResponse.json({
          success: true,
          url: `/uploads/${cleanName}`,
        });
      }
    }

    return NextResponse.json({ error: 'صيغة بيانات غير صحيحة' }, { status: 400 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'فشل في رفع الصورة' }, { status: 500 });
  }
}
