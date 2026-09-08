"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface NotificationBannerProps {
  notification: {
    message: string;
    type: "success" | "error" | "info";
  } | null;
}

export function NotificationBanner({ notification }: NotificationBannerProps) {
  if (!notification) return null;

  const { message, type } = notification;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100",
    error: "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
    info: "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-xl text-xs font-medium backdrop-blur-md ${bgStyles[type]}`}
      >
        {icons[type]}
        <span>{message}</span>
      </div>
    </div>
  );
}
