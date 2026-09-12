'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Loader2, Calendar, ArrowRight } from 'lucide-react';
import { Tour } from '../types/travel';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedTour?: Tour | null;
}

interface ChatbotWidgetProps {
  onOpenTourDetail: (tour: Tour) => void;
  onOpenTourBooking: (tour: Tour) => void;
}

export default function ChatbotWidget({ onOpenTourDetail, onOpenTourBooking }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_init',
      sender: 'bot',
      text: 'Chào bạn! Mình là Trợ lý Du lịch AI. Bạn muốn tìm tour biển đảo Phú Quốc, săn mây Đà Lạt, lên đỉnh Fansipan hay tour giá rẻ cứ nhắn cho mình nhé!',
      timestamp: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');

    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          // Gửi kèm toàn bộ lịch sử cuộc trò chuyện
          history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestedTour: data.suggestedTour,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'bot',
          text: 'Mạng đang chập chờn, bạn thử gửi lại tin nhắn nhé!',
          timestamp: 'Vừa xong',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Nút bấm tròn mở Chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xl shadow-sky-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group relative"
        >
          <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Cửa sổ Khung Chat */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[560px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Trợ Lý Du Lịch AI</h4>
                <span className="text-[10px] text-sky-100 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Trực tuyến tư vấn
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Khung tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* THẺ TOUR MINI ĐÍNH KÈM TRỰC TIẾP TRONG CHAT */}
                  {m.suggestedTour && (
                    <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={m.suggestedTour.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {m.suggestedTour.title}
                          </div>
                          <div className="text-[11px] font-black text-sky-600">
                            {m.suggestedTour.price.toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => onOpenTourDetail(m.suggestedTour!)}
                          className="py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition"
                        >
                          <Calendar size={12} />
                          <span>Lịch trình</span>
                        </button>
                        <button
                          onClick={() => onOpenTourBooking(m.suggestedTour!)}
                          className="py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition shadow-sm"
                        >
                          <span>Đặt ngay</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-white p-3 rounded-2xl border border-slate-100 max-w-[70%]">
                <Loader2 size={14} className="animate-spin text-sky-600" />
                <span>AI đang tìm tour phù hợp...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập chat */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="VD: Phú Quốc, tour đi đâu, giá rẻ..."
              className="flex-1 px-3.5 py-2.5 bg-slate-100 text-xs rounded-xl outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl transition shadow-sm"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}