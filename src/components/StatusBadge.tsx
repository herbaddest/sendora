import React from "react";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { TransferStatus } from "@/types";

interface StatusBadgeProps {
  status: TransferStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  showIcon = true,
}) => {
  const isSm = size === "sm";

  switch (status) {
    case "delivered":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ${
            isSm ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          }`}
        >
          {showIcon && <CheckCircle2 className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />}
          Delivered
        </span>
      );
    case "processing":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 ${
            isSm ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          }`}
        >
          {showIcon && <Clock className={`${isSm ? "w-3 h-3" : "w-3.5 h-3.5"} animate-spin`} />}
          Processing
        </span>
      );
    case "failed":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 ${
            isSm ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          }`}
        >
          {showIcon && <AlertCircle className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />}
          Failed
        </span>
      );
    case "cancelled":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 ${
            isSm ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          }`}
        >
          {showIcon && <XCircle className={isSm ? "w-3 h-3" : "w-3.5 h-3.5"} />}
          Cancelled
        </span>
      );
    default:
      return null;
  }
};
