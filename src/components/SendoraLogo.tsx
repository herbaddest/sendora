import React from "react";

interface SendoraLogoProps {
  variant?: "full" | "icon" | "badge";
  size?: "sm" | "md" | "lg" | "xl";
  lightMode?: boolean;
  className?: string;
}

export const SendoraLogo: React.FC<SendoraLogoProps> = ({
  variant = "full",
  size = "md",
  lightMode = false,
  className = "",
}) => {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-xl tracking-tight",
    lg: "text-2xl tracking-tight",
    xl: "text-3xl tracking-tight",
  };

  const taglineSizes = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract Flowing 'S' Logo Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <linearGradient id="sendoraGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="sendoraGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="sendoraBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>

          {/* Rounded Shield/Icon Background */}
          <rect width="100" height="100" rx="26" fill="url(#sendoraBg)" />

          {/* Dynamic Interconnected Flowing S Ribbon */}
          {/* Top curve */}
          <path
            d="M 68 32 C 68 22, 52 20, 42 24 C 30 29, 28 42, 40 48 C 54 54, 72 56, 68 70 C 64 82, 42 82, 30 74"
            stroke="url(#sendoraGrad1)"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          {/* Accent transfer arrow movement line */}
          <path
            d="M 32 30 C 44 22, 68 30, 72 44"
            stroke="url(#sendoraGrad2)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          {/* Spark pulse dot */}
          <circle cx="70" cy="72" r="5" fill="#10B981" />
        </svg>
      </div>

      {variant !== "icon" && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span
              className={`font-extrabold ${textSizes[size]} font-sans ${
                lightMode ? "text-slate-900" : "text-white"
              }`}
            >
              SENDORA
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5 inline-block animate-pulse"></span>
          </div>

          {variant === "full" && (
            <span
              className={`font-medium ${taglineSizes[size]} mt-0.5 ${
                lightMode ? "text-slate-500" : "text-indigo-200/80"
              }`}
            >
              Money, made simple.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
