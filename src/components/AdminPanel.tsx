'use client';

import React, { useState } from 'react';
import { Tour, Booking } from '../types/travel';
import { Plus, Trash2, Settings2, Users, DollarSign, TrendingUp, Compass, BarChart3 } from 'lucide-react';

interface AdminPanelProps {
  tours: Tour[];
  bookings: Booking[];
  onAddTour: (tour: Tour) => void;
  onDeleteTour: (id: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'cancelled') => void;
}

export default function AdminPanel({
  tours,
  bookings,
  onAddTour,
  onDeleteTour,
  onUpdateBookingStatus,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'bookings' | 'tours'>('analytics');

  // Form thêm tour
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState(2500000);
  const [duration, setDuration] = useState('3N2Đ');

  // Tính toán số liệu thống kê (Analytics KPIs)
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalGuests = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.guests, 0);

  // Thống kê số booking theo từng điểm đến
  const destinationStats: Record<string, number> = {};
  bookings.forEach((b) => {
    const dest = b.tourTitle.split('-')[0].trim();
    destinationStats[dest] = (destinationStats[dest] || 0) + 1;
  });

  const maxBookingsPerDest = Math.max(...Object.values(destinationStats), 1);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination) return;

    const newTour: Tour = {
      id: `t_${Date.now()}`,
      title,
      destination,
      price,
      duration,
      rating: 5.0,
      featured: true,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
      description: 'Tour du lịch chất lượng cao khởi hành hàng tuần.',
      itinerary: [
        { day: 1, title: 'Khởi hành & Nhận phòng', detail: 'Đón khách và bắt đầu lịch trình.' },
        { day: 2, title: 'Khám phá danh lam thắng cảnh', detail: 'Tham quan các điểm nổi bật nhất.' },
      ],
    };

    onAddTour(newTour);
    setTitle('');
    setDestination('');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-rose-600">
          <Settings2 size={24} />
          <h3 className="text-lg font-black text-slate-900">Trung Tâm Điều Hành Quản Trị (Admin)</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BarChart3 size={14} /> Thống kê Doanh thu
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users size={14} /> Quản lý Đơn ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'tours'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Compass size={14} /> Quản lý Tour ({tours.length})
          </button>
        </div>
      </div>

      {/* 1. TAB THỐNG KÊ DOANH THU & ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Hàng 4 thẻ KPI chỉ số */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center justify-between text-emerald-600 mb-1">
                <span className="text-xs font-bold uppercase">Tổng Doanh Thu</span>
                <DollarSign size={18} />
              </div>
              <div className="text-xl font-black text-emerald-700">{totalRevenue.toLocaleString('vi-VN')} đ</div>
              <span className="text-[10px] text-emerald-600">Từ các đơn đã xác nhận</span>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl">
              <div className="flex items-center justify-between text-sky-600 mb-1">
                <span className="text-xs font-bold uppercase">Tổng Số Lượt Khách</span>
                <Users size={18} />
              </div>
              <div className="text-xl font-black text-sky-700">{totalGuests} người</div>
              <span className="text-[10px] text-sky-600">Đã đăng ký chuyến đi</span>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
              <div className="flex items-center justify-between text-purple-600 mb-1">
                <span className="text-xs font-bold uppercase">Tổng Số Tour</span>
                <Compass size={18} />
              </div>
              <div className="text-xl font-black text-purple-700">{tours.length} tour</div>
              <span className="text-[10px] text-purple-600">Đang mở bán toàn quốc</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center justify-between text-amber-600 mb-1">
                <span className="text-xs font-bold uppercase">Tỷ Lệ Chốt Đơn</span>
                <TrendingUp size={18} />
              </div>
              <div className="text-xl font-black text-amber-700">
                {bookings.length > 0
                  ? Math.round((bookings.filter((b) => b.status === 'confirmed').length / bookings.length) * 100)
                  : 100}
                %
              </div>
              <span className="text-[10px] text-amber-600">Hiệu suất vận hành</span>
            </div>
          </div>

          {/* Biểu đồ phân bố độ hot của các điểm đến */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Mức Độ Yêu Thích Các Điểm Đến (Booking Share)</h4>
            <div className="space-y-3">
              {Object.keys(destinationStats).length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Chưa có đủ dữ liệu đơn đặt tour</p>
              ) : (
                Object.entries(destinationStats).map(([dest, count]) => {
                  const percent = Math.round((count / maxBookingsPerDest) * 100);
                  return (
                    <div key={dest} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span className="truncate max-w-[280px]">{dest}</span>
                        <span>{count} đơn</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB QUẢN LÝ ĐƠN ĐẶT */}
      {activeTab === 'bookings' && (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">KHÁCH HÀNG</th>
                <th className="p-3">TÊN TOUR</th>
                <th className="p-3">NGÀY ĐI</th>
                <th className="p-3">TỔNG TIỀN</th>
                <th className="p-3">TRẠNG THÁI</th>
                <th className="p-3 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">Chưa có đơn đặt tour nào</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">
                      <div>{b.customerName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{b.customerPhone} • {b.customerEmail}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{b.tourTitle}</td>
                    <td className="p-3">{b.startDate} ({b.guests} khách)</td>
                    <td className="p-3 font-black text-emerald-600">{b.totalPrice.toLocaleString('vi-VN')} đ</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {b.status === 'confirmed' ? 'Đã duyệt' : 'Đã hủy'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                        className="text-emerald-600 hover:text-emerald-800 font-bold text-xs"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => onUpdateBookingStatus(b.id, 'cancelled')}
                        className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                      >
                        Hủy
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. TAB QUẢN LÝ TOUR & CRUD */}
      {activeTab === 'tours' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Tạo Thêm Tour Tuyến Mới</h4>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Tên tour..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Địa điểm (VD: Quy Nhơn)..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="px-3 py-2 border rounded-xl"
                />
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="3N2Đ"
                  className="px-3 py-2 border rounded-xl"
                />
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-1"
              >
                <Plus size={16} /> Đăng tour mới lên hệ thống
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Danh sách {tours.length} Tour Đang Mở Bán</h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {tours.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl">
                  <div>
                    <div className="font-bold text-slate-800">{t.title}</div>
                    <div className="text-[10px] text-slate-400">{t.destination} • {t.price.toLocaleString('vi-VN')} đ</div>
                  </div>
                  <button onClick={() => onDeleteTour(t.id)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}