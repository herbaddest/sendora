"use client";

import React, { useState } from "react";
import { Bell, ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NotificationDrawer } from "@/components/NotificationDrawer";
import { SendoraLogo } from "@/components/SendoraLogo";

interface HeaderBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  subtitle?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  showBack = false,
  onBack,
  subtitle,
}) => {
  const { user, notifications, navigateTo } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const NotificationButton = (
    <button
      onClick={() => setShowNotifications(true)}
      className="relative p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
          {unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-20 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        {showBack ? (
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack || (() => navigateTo("home"))}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-200"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                  {title}
                </h1>
                {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
              </div>
            </div>

            {NotificationButton}
          </div>
        ) : (
          <div className="px-4 py-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <SendoraLogo size="sm" variant="badge" />
              {NotificationButton}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {user?.fullName?.charAt(0) || "J"}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-tight">
                  Hi, {user?.fullName?.split(" ")[0] || "John"} 👋
                </h1>
                <p className="text-xs text-slate-400 font-medium">Welcome back!</p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Notification Drawer */}
      {showNotifications && (
        <NotificationDrawer onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};
