import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SITE_CONFIG } from '@/data/siteConfig';

const registeredUsers = new Map<string, { password: string; role: 'user' | 'admin' }>();

// Tạo sẵn tài khoản Admin mặc định
registeredUsers.set(SITE_CONFIG.adminEmail.toLowerCase(), {
  password: 'admin123',
  role: 'admin',
});

const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(req: Request) {
  try {
    const { action, email, password, otp } = await req.json();
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    if (action === 'login-password') {
      const user = registeredUsers.get(normalizedEmail);
      if (!user) {
        return NextResponse.json({ success: false, message: 'Tài khoản chưa tồn tại. Vui lòng bấm Đăng ký!' }, { status: 400 });
      }
      if (user.password !== password) {
        return NextResponse.json({ success: false, message: 'Mật khẩu không chính xác' }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        user: { email: normalizedEmail, role: user.role },
      });
    }

    if (action === 'send-otp') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore.set(normalizedEmail, { otp: generatedOtp, expiresAt: Date.now() + 5 * 60 * 1000 });

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
          from: `"VietVenture AI" <${process.env.EMAIL_USER}>`,
          to: normalizedEmail,
          subject: `[VietVenture] Mã OTP đăng ký tài khoản: ${generatedOtp}`,
          html: `<p>Mã OTP kích hoạt tài khoản của bạn là: <b>${generatedOtp}</b> (hiệu lực 5 phút).</p>`,
        });
      }

      return NextResponse.json({ success: true, message: 'Mã OTP đã được gửi về Gmail' });
    }

    if (action === 'register-verify') {
      const record = otpStore.get(normalizedEmail);
      if (!record || Date.now() > record.expiresAt || record.otp !== otp) {
        return NextResponse.json({ success: false, message: 'Mã OTP không đúng hoặc đã hết hạn' }, { status: 400 });
      }

      otpStore.delete(normalizedEmail);
      const role = normalizedEmail === SITE_CONFIG.adminEmail.toLowerCase() ? 'admin' : 'user';
      registeredUsers.set(normalizedEmail, { password, role });

      return NextResponse.json({
        success: true,
        user: { email: normalizedEmail, role },
      });
    }

    return NextResponse.json({ success: false, message: 'Action không hợp lệ' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}