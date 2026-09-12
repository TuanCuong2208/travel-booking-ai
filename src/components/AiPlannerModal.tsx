'use client';

import React, { useState } from 'react';
import { Sparkles, X, Loader2, Calendar, MapPin, DollarSign, Heart } from 'lucide-react';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiPlannerModal({ isOpen, onClose }: AiPlannerModalProps) {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(3500000);
  const [preferences, setPreferences] = useState('Khám phá thiên nhiên, chụp ảnh sống ảo, thưởng thức ẩm thực địa phương');
  const [isLoading, setIsLoading] = useState(false);
  const [planResult, setPlanResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    setIsLoading(true);
    setPlanResult(null);

    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, budget, preferences }),
      });
      const data = await res.json();
      if (data.success) {
        setPlanResult(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-200">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">AI Smart Itinerary Planner</h3>
            <p className="text-xs text-slate-500">Thiết kế lịch trình du lịch cá nhân hóa từng ngày</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          {/* Form nhập thông tin */}
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin size={14} className="text-purple-600" /> Điểm đến mong muốn
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="VD: Quy Nhơn, Hà Giang, Côn Đảo..."
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-purple-600" /> Thời gian (Số ngày)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign size={14} className="text-purple-600" /> Dự toán ngân sách (VNĐ)
              </label>
              <input
                type="number"
                step={500000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Heart size={14} className="text-purple-600" /> Sở thích trải nghiệm
              </label>
              <input
                type="text"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Nghỉ dưỡng, leo núi, ẩm thực..."
                className="w-full px-3.5 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold rounded-xl shadow-md shadow-purple-200 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>AI đang phân tích và lên lịch trình...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Tạo Lịch Trình Tự Động Ngay</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Kết quả lịch trình do AI tạo ra */}
          {planResult && (
            <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                <h4 className="font-black text-slate-900 text-sm sm:text-base">{planResult.title}</h4>
                <p className="text-xs text-purple-700 font-semibold mt-1">Dự toán: {planResult.estimatedBudget}</p>
              </div>

              <div className="space-y-4">
                {planResult.days?.map((d: any) => (
                  <div key={d.day} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                    <div className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-purple-600 text-white rounded-lg text-xs">Ngày {d.day}</span>
                      <span>{d.summary}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {d.activities?.map((act: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-white border border-slate-100 rounded-xl space-y-1">
                          <span className="font-bold text-purple-600 text-[11px] block">{act.time}</span>
                          <p className="text-slate-600 leading-relaxed">{act.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}