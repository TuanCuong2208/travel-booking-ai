'use client';

import React from 'react';
import { Tour } from '../types/travel';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';

interface TourCardProps {
  tour: Tour;
  onBook: (tour: Tour) => void;
  onViewDetail: (tour: Tour) => void;
}

export default function TourCard({ tour, onBook, onViewDetail }: TourCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Khối Ảnh */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
          <MapPin size={13} className="text-sky-600" />
          <span>{tour.destination}</span>
        </div>
        <div className="absolute top-4 right-4 bg-amber-400 text-slate-900 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
          <Star size={13} fill="currentColor" />
          <span>{tour.rating}</span>
        </div>
      </div>

      {/* Thông tin Tour */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
            <Clock size={14} />
            <span>Thời lượng: {tour.duration}</span>
          </div>
          <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-sky-600 transition line-clamp-2">
            {tour.title}
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {tour.description}
          </p>
        </div>

        {/* Giá và Nút bấm */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Giá trọn gói</span>
            <span className="text-lg font-black text-sky-600">
              {tour.price.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetail(tour)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Lịch trình
            </button>
            <button
              onClick={() => onBook(tour)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-200 transition flex items-center gap-1"
            >
              <span>Đặt tour</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}