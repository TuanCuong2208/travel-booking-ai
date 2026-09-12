'use client';

import React from 'react';
import { Compass, CalendarCheck2, ShieldCheck, User, LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
  currentUser: { email: string; role: 'user' | 'admin' } | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenMyBookings: () => void;
}

export default function Navbar({ currentUser, onOpenLogin, onLogout, onOpenMyBookings }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-200">
            <Compass size={24} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-sky-700 to-indigo-700 bg-clip-text text-transparent leading-none">
              VietVenture AI
            </h1>
            <p className="text-xs text-slate-400 mt-1">Du lịch thông minh cùng Trợ lý AI</p>
          </div>
        </div>

        {/* Menu & User Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {currentUser.role === 'user' && (
                <button
                  onClick={onOpenMyBookings}
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold hover:bg-sky-100 transition"
                >
                  <CalendarCheck2 size={16} />
                  <span>Tour của tôi</span>
                </button>
              )}

              <div
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border ${
                  currentUser.role === 'admin'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {currentUser.role === 'admin' ? <ShieldCheck size={16} /> : <User size={16} />}
                <span className="max-w-[120px] truncate">{currentUser.email}</span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 hover:opacity-95 transition"
            >
              <LogIn size={16} />
              <span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}