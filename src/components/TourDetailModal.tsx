'use client';

import React, { useState, useEffect } from 'react';
import { Tour, Review } from '../types/travel';
import TourRouteMap from './TourRouteMap';
import { X, Star, Sparkles, MessageSquare, Send, CheckCircle2, Loader2, Map } from 'lucide-react';

interface TourDetailModalProps {
  tour: Tour | null;
  onClose: () => void;
  onBookNow: (tour: Tour) => void;
  onAddReview: (tourId: string, review: Review) => void;
}

export default function TourDetailModal({ tour, onClose, onBookNow, onAddReview }: TourDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'reviews'>('itinerary');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (activeTab === 'reviews' && tour) {
      const fetchSummary = async () => {
        setIsSummarizing(true);
        try {
          const res = await fetch('/api/reviews/summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tourTitle: tour.title, reviews: tour.reviews || [] }),
          });
          const data = await res.json();
          if (data.success) setAiSummary(data.summary);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSummarizing(false);
        }
      };
      fetchSummary();
    }
  }, [activeTab, tour]);

  if (!tour) return null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('vi-VN'),
    };

    onAddReview(tour.id, newRev);
    setComment('');
  };

  const reviewsList = tour.reviews || [
    { id: 'r1', userName: 'Trần Văn Đức', rating: 5, comment: 'Chuyến đi tuyệt vời, cảnh đẹp và hướng dẫn viên hỗ trợ nhiệt tình!', date: '08/09/2026' },
    { id: 'r2', userName: 'Lê Thảo My', rating: 5, comment: 'Đồ ăn các bữa rất ngon, lịch trình hợp lý không bị mệt.', date: '02/09/2026' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[88vh] flex flex-col">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">{tour.destination} • {tour.duration}</span>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">{tour.title}</h3>

          {/* Tab Navigation */}
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`pb-2 text-xs font-bold border-b-2 transition ${
                activeTab === 'itinerary' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Lịch trình chi tiết
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`pb-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'map' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Map size={13} />
              <span>Bản đồ hành trình</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'reviews' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <MessageSquare size={13} />
              <span>Đánh giá ({reviewsList.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Lịch Trình */}
        {activeTab === 'itinerary' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            <div className="space-y-3">
              {tour.itinerary.map((item) => (
                <div key={item.day} className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    N{item.day}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">{item.title}</h5>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h5 className="font-bold text-slate-800">Dịch vụ đi kèm:</h5>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Xe đưa đón đời mới</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Khách sạn 3-4 sao</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Các bữa ăn chính</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Bảo hiểm du lịch</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Bản Đồ Tương Tác */}
        {activeTab === 'map' && (
          <div className="flex-1 overflow-y-auto py-4 pr-1">
            <TourRouteMap tour={tour} />
          </div>
        )}

        {/* Tab 3: Đánh Giá & AI Summary */}
        {activeTab === 'reviews' && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 text-xs">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-sky-50 border border-purple-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 font-black text-purple-700">
                <Sparkles size={15} />
                <span>AI Tóm Tắt Cảm Nhận Du Khách</span>
              </div>
              {isSummarizing ? (
                <div className="flex items-center gap-2 text-slate-400 py-1">
                  <Loader2 size={13} className="animate-spin text-purple-600" />
                  <span>AI đang phân tích các nhận xét...</span>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed">{aiSummary}</p>
              )}
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-slate-700 uppercase">Nhận xét từ du khách</h5>
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-slate-100 space-y-2.5">
              <h5 className="font-bold text-slate-700">Để lại đánh giá của bạn</h5>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Tên của bạn..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="px-3 py-2 border rounded-xl outline-none"
                />
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="px-3 py-2 border rounded-xl outline-none font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
                  <option value={3}>⭐⭐⭐ (3 sao)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Chia sẻ trải nghiệm về chuyến đi..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-1"
                >
                  <Send size={13} /> Gửi
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Giá trọn gói</span>
            <div className="text-lg font-black text-sky-600">{tour.price.toLocaleString('vi-VN')} đ</div>
          </div>
          <button
            onClick={() => {
              onClose();
              onBookNow(tour);
            }}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-200 transition"
          >
            Tiến hành đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
}