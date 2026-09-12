import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SITE_CONFIG } from '@/data/siteConfig';

export async function POST(req: Request) {
  try {
    const { email, customerName, phone, tourTitle, startDate, guests, totalPrice, bookingId } = await req.json();

    if (!email || !tourTitle) {
      return NextResponse.json({ success: false, message: 'Dữ liệu không đầy đủ' }, { status: 400 });
    }

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${SITE_CONFIG.name}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `[${SITE_CONFIG.name}] Xác nhận đặt tour thành công - Mã #${bookingId.slice(-6).toUpperCase()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #0284c7; margin-bottom: 4px;">✈️ XÁC NHẬN ĐẶT TOUR THÀNH CÔNG!</h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 0;">Cảm ơn bạn đã tin tưởng dịch vụ của ${SITE_CONFIG.name}</p>
            </div>

            <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
              <p style="margin: 4px 0;"><strong>Mã đặt tour:</strong> #${bookingId.slice(-6).toUpperCase()}</p>
              <p style="margin: 4px 0;"><strong>Khách hàng:</strong> ${customerName}</p>
              <p style="margin: 4px 0;"><strong>Số điện thoại:</strong> ${phone}</p>
              <p style="margin: 4px 0;"><strong>Tour đã chọn:</strong> ${tourTitle}</p>
              <p style="margin: 4px 0;"><strong>Ngày khởi hành:</strong> ${startDate}</p>
              <p style="margin: 4px 0;"><strong>Số lượng khách:</strong> ${guests} người</p>
            </div>

            <div style="text-align: right; margin-bottom: 24px;">
              <span style="font-size: 14px; color: #64748b;">Tổng tiền thanh toán: </span>
              <span style="font-size: 22px; font-weight: bold; color: #0284c7;">${Number(totalPrice).toLocaleString('vi-VN')} đ</span>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>Hướng dẫn viên sẽ liên hệ với bạn trước ngày khởi hành 24 giờ.</p>
              <p>Hotline hỗ trợ 24/7: ${SITE_CONFIG.hotline}</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, message: 'Đã gửi vé về Gmail' });
  } catch (error: any) {
    console.error('Invoice error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}