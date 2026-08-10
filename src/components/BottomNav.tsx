"use client";

import React from "react";
import { Home, Users, ArrowLeftRight, User, BookOpen, Send } from "lucide-react";
import { useApp, BottomTab } from "@/context/AppContext";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, initiateSendFlow, isAuthenticated, activeScreen } = useApp();

  // Hide on onboarding / auth screens
  if (!isAuthenticated || ["welcome", "register", "login"].includes(activeScreen)) {
    return null;
  }

  const navItems: { id: BottomTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "recipients", label: "Recipients", icon: <Users className="w-5 h-5" /> },
    { id: "transfers", label: "Transfers", icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "docs", label: "Guide", icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="relative z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <div className={`relative transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Floating Send Money Shortcut Button */}
        <button
          onClick={() => initiateSendFlow()}
          aria-label="Send Money"
          className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white p-3.5 rounded-full shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group"
          title="Send Money Now"
        >
          <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </div>
  );
};
