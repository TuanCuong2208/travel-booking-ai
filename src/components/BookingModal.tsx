'use client';

import React, { useState } from 'react';
import { Tour } from '../types/travel';
import { SITE_CONFIG } from '../data/siteConfig';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

interface BookingModalProps {
  tour: Tour | null;
  onClose: () => void;
  currentUserEmail?: string;
  onConfirmBooking: (bookingData: {
    tour: Tour;
    name: string;
    phone: string;
    email: string;
    date: string;
    guests: number;
    totalPrice: number;
  }) => void;
}

export default function BookingModal({ tour, onClose, currentUserEmail, onConfirmBooking }: BookingModalProps) {
  if (!tour) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUserEmail || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [guests, setGuests] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = tour.price * guests;
  const bookingCode = `VV${Date.now().toString().slice(-6)}`;

  // Link VietQR tự động sinh ảnh có logo ngân hàng, số tiền và nội dung
  const vietQrUrl = `https://img.vietqr.io/image/${SITE_CONFIG.bank.bankId}-${SITE_CONFIG.bank.accountNo}-compact2.png?amount=${totalPrice}&addInfo=${bookingCode}&accountName=${encodeURIComponent(SITE_CONFIG.bank.accountName)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    setIsProcessing(true);

    try {
      await fetch('/api/booking/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          customerName: name,
          phone,
          tourTitle: tour.title,
          startDate: date,
          guests,
          totalPrice,
          bookingId: bookingCode,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        onConfirmBooking({
          tour,
          name,
          phone,
          email,
          date,
          guests,
          totalPrice,
        });
        setIsSuccess(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        {!isProcessing && !isSuccess && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X size={20} />
          </button>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 size={56} className="text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-slate-800">Đặt Tour Thành Công!</h4>
            <p className="text-xs text-slate-500">
              Mã vé <strong>#{bookingCode}</strong> và hóa đơn đã được gửi tới <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase">Xác nhận giữ chỗ</span>
              <h3 className="text-sm font-black text-slate-900 mt-0.5 truncate">{tour.title}</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ tên người đặt</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Nguyễn Tuấn Cường"
                  className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0987654321"
                    className="w-full px-3 py-2 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gmail nhận vé</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@gmail.com"
                    className="w-full px-3 py-2 border rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày khởi hành</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số lượng khách</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Khung Mã VietQR Động */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <img
                src={vietQrUrl}
                alt="VietQR Payment"
                className="w-24 h-24 object-contain rounded-xl border border-slate-200 bg-white p-1"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-800">VietQR Quét Mã Tự Động</span>
                <div className="text-base font-black text-sky-600">{totalPrice.toLocaleString('vi-VN')} đ</div>
                <div className="text-[10px] text-slate-500">Nội dung: <strong className="text-slate-800">{bookingCode}</strong></div>
                <div className="text-[10px] text-emerald-600 font-semibold">Tự động nhận diện sau khi quét</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang xuất vé gửi về Gmail...</span>
                </>
              ) : (
                'Xác nhận thanh toán & Nhận vé'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}