'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import TourCard from '@/components/TourCard';
import TourDetailModal from '@/components/TourDetailModal';
import BookingModal from '@/components/BookingModal';
import ChatbotWidget from '@/components/ChatbotWidget';
import AdminPanel from '@/components/AdminPanel';
import LoginModal from '@/components/LoginModal';
import AiPlannerModal from '@/components/AiPlannerModal';
import { TOURS } from '@/data/mockTours';
import { Tour, Booking } from '@/types/travel';
import { Search, Sparkles, Filter, Ticket } from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'user' | 'admin' } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('vietventure_user');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleLoginSuccess = (user: { email: string; role: 'user' | 'admin' }) => {
    setCurrentUser(user);
    localStorage.setItem('vietventure_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vietventure_user');
  };

  const [tours, setTours] = useState<Tour[]>(TOURS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string>('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 12; // 12 tour mỗi trang giúp web mượt

  const [selectedDetailTour, setSelectedDetailTour] = useState<Tour | null>(null);
  const [selectedBookingTour, setSelectedBookingTour] = useState<Tour | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vietventure_bookings');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('vietventure_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const isAdmin = currentUser?.role === 'admin';

  // Tự động gom toàn bộ danh sách tỉnh thành có trong kho 100+ tour
  const uniqueDestinations = useMemo(() => {
    const list = Array.from(new Set(tours.map((t) => t.destination)));
    return ['Tất cả', ...list];
  }, [tours]);

  // Bộ lọc
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchDest = selectedDestination === 'Tất cả' || tour.destination === selectedDestination;
      const matchSearch =
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDest && matchSearch;
    });
  }, [tours, selectedDestination, searchQuery]);

  // Phân trang
  const totalPages = Math.ceil(filteredTours.length / toursPerPage) || 1;
  const currentTours = filteredTours.slice((currentPage - 1) * toursPerPage, currentPage * toursPerPage);

  const handleSelectDest = (dest: string) => {
    setSelectedDestination(dest);
    setCurrentPage(1);
  };

  const handleConfirmBooking = (data: any) => {
    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      tourId: data.tour.id,
      tourTitle: data.tour.title,
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      startDate: data.date,
      guests: data.guests,
      totalPrice: data.totalPrice,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleAddTour = (tour: Tour) => setTours([tour, ...tours]);
  const handleDeleteTour = (id: string) => setTours(tours.filter((t) => t.id !== id));
  const handleUpdateBookingStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 p-8 sm:p-10 text-white shadow-xl overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
              <Sparkles size={14} /> Hệ Thống 100+ Tour Khắp 3 Miền Việt Nam
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Khám Phá Việt Nam Cùng Trí Tuệ Nhân Tạo
            </h2>
            <p className="text-xs sm:text-sm text-sky-100">
              Tự động gợi ý điểm đến, lập lịch trình thông minh và đặt vé an toàn với trợ lý ảo.
            </p>
          </div>

          <div className="mt-6 relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-3xl">
            <div className="bg-white p-2.5 rounded-2xl shadow-lg flex-1 flex items-center gap-2 text-slate-700">
              <Search size={18} className="text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Tìm tour hoặc điểm đến (Huế, Quy Nhơn, Hà Giang, Phú Quốc...)"
                className="w-full text-xs sm:text-sm outline-none px-2 text-slate-700"
              />
            </div>

            <button
              onClick={() => setIsPlannerOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Lập Kế Hoạch Cùng AI</span>
            </button>
          </div>
        </div>

        {/* Khung Admin */}
        {isAdmin && (
          <AdminPanel
            tours={tours}
            bookings={bookings}
            onAddTour={handleAddTour}
            onDeleteTour={handleDeleteTour}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        )}

        {/* Bộ Lọc Địa Điểm Tự Động Nạp Tất Cả Các Tỉnh Thành */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter size={14} />
            <span>Điểm đến du lịch ({uniqueDestinations.length - 1} tỉnh thành)</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {uniqueDestinations.map((dest) => (
              <button
                key={dest}
                onClick={() => handleSelectDest(dest)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedDestination === dest
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {dest}
              </button>
            ))}
          </div>
        </div>

        {/* Danh Sách Tour Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Danh Mục Tour</h3>
              <p className="text-xs text-slate-400">Đang hiển thị {filteredTours.length} chương trình du lịch</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                onBook={(t) => setSelectedBookingTour(t)}
                onViewDetail={(t) => setSelectedDetailTour(t)}
              />
            ))}
          </div>

          {/* Phân Trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 border rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-slate-100"
              >
                Trang trước
              </button>
              <span className="text-xs font-bold text-slate-600 px-2">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-slate-100"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <TourDetailModal
  tour={selectedDetailTour}
  onClose={() => setSelectedDetailTour(null)}
  onBookNow={(t) => setSelectedBookingTour(t)}
  onAddReview={(tourId, newRev) => {
    setTours((prev) =>
      prev.map((t) =>
        t.id === tourId ? { ...t, reviews: [newRev, ...(t.reviews || [])] } : t
      )
    );
    if (selectedDetailTour && selectedDetailTour.id === tourId) {
      setSelectedDetailTour((prev) =>
        prev ? { ...prev, reviews: [newRev, ...(prev.reviews || [])] } : null
      );
    }
  }}
/>

      <BookingModal
        tour={selectedBookingTour}
        onClose={() => setSelectedBookingTour(null)}
        currentUserEmail={currentUser?.email}
        onConfirmBooking={handleConfirmBooking}
      />

      {isMyBookingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button onClick={() => setIsMyBookingsOpen(false)} className="absolute top-4 right-4 text-slate-400">
              Đóng
            </button>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Ticket size={20} className="text-sky-600" />
              <h3 className="text-base font-bold text-slate-900">Lịch Sử Đặt Tour</h3>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {bookings.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Bạn chưa đặt tour nào</p>
              ) : (
                bookings
                  .filter((b) => !currentUser || b.customerEmail === currentUser.email)
                  .map((bk) => (
                    <div key={bk.id} className="p-4 bg-slate-50 rounded-2xl border text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{bk.tourTitle}</span>
                        <span className="text-sky-600">{bk.totalPrice.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="text-slate-500">Khởi hành: {bk.startDate} • {bk.guests} khách</div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AiPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
      />

      <ChatbotWidget
        onOpenTourDetail={(tour) => setSelectedDetailTour(tour)}
        onOpenTourBooking={(tour) => setSelectedBookingTour(tour)}
      />
    </div>
  );
}