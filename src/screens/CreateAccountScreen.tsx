"use client";

import React, { useState } from "react";
import { SendoraLogo } from "@/components/SendoraLogo";
import { Eye, EyeOff, Check, AlertCircle, ArrowLeft, Lock, User, Mail, Phone, Globe, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const CreateAccountScreen: React.FC = () => {
  const { navigateTo, signup, isLoading } = useApp();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasSpecialChar;

  const [signupError, setSignupError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid email address is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!isPasswordValid) newErrors.password = "Password does not meet requirements";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const error = await signup(fullName, email, phone, password, country);
    if (error) {
      setSignupError(error);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-slate-900 text-white overflow-y-auto min-h-[780px]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={() => navigateTo("welcome")}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <SendoraLogo size="sm" variant="badge" />
        <div className="w-9"></div>
      </div>

      <div className="my-4">
        <h2 className="text-2xl font-black tracking-tight text-white">Create account</h2>
        <p className="text-xs text-slate-400 mt-1">Join SENDORA and make sending money simpler.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        {/* Country Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">Your Country</label>
          <div className="relative">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm font-bold text-white appearance-none focus:outline-none focus:border-indigo-500"
            >
              <option value="United States">🇺🇸 United States (USD)</option>
              <option value="Kenya">🇰🇪 Kenya (KES)</option>
              <option value="United Kingdom">🇬🇧 United Kingdom (GBP)</option>
              <option value="Canada">🇨🇦 Canada (CAD)</option>
            </select>
            <Globe className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">Full Name</label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full bg-slate-800/80 border ${errors.fullName ? "border-rose-500" : "border-slate-700"
                } rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500`}
            />
            <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">Phone Number</label>
          <div className="relative">
            <input
              type="tel"
              placeholder="+1 (555) 234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full bg-slate-800/80 border ${errors.phone ? "border-rose-500" : "border-slate-700"
                } rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500`}
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.phone}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">Email Address</label>
          <div className="relative">
            <input
              type="email"
              placeholder="john.doe@sendora.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-slate-800/80 border ${errors.email ? "border-rose-500" : "border-slate-700"
                } rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500`}
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-1.5 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-slate-800/80 border ${errors.password ? "border-rose-500" : "border-slate-700"
                } rounded-2xl pl-11 pr-11 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500`}
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Validation Checklist */}
          <div className="mt-2.5 space-y-1.5 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <div
              className={`text-[11px] font-semibold flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-slate-400"
                }`}
            >
              <Check className={`w-3.5 h-3.5 ${hasMinLength ? "text-emerald-400" : "text-slate-600"}`} />
              At least 8 characters
            </div>
            <div
              className={`text-[11px] font-semibold flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : "text-slate-400"
                }`}
            >
              <Check className={`w-3.5 h-3.5 ${hasNumber ? "text-emerald-400" : "text-slate-600"}`} />
              Contains at least 1 number
            </div>
            <div
              className={`text-[11px] font-semibold flex items-center gap-1.5 ${hasSpecialChar ? "text-emerald-400" : "text-slate-400"
                }`}
            >
              <Check className={`w-3.5 h-3.5 ${hasSpecialChar ? "text-emerald-400" : "text-slate-600"}`} />
              Contains at least 1 special character (!@#$)
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          By creating an account, you agree to our{" "}
          <span className="text-indigo-400 underline font-semibold">Terms of Service</span> and{" "}
          <span className="text-indigo-400 underline font-semibold">Privacy Policy</span>.
        </p>
      </form>
    </div>
  );
};
