"use client";

import { PublicationStatus, STATUS_CONFIG } from "../types/calendar";
import { CheckCircle2, Clock, Sparkles, Send } from "lucide-react";

interface StatusSelectorProps {
  status: PublicationStatus;
  onChange: (newStatus: PublicationStatus) => void;
  size?: "sm" | "md";
}

const STATUS_ICONS: Record<PublicationStatus, typeof Clock> = {
  todo: Clock,
  generated: Sparkles,
  scheduled: Send,
  published: CheckCircle2,
};

export function StatusSelector({ status, onChange, size = "md" }: StatusSelectorProps) {
  const options: PublicationStatus[] = ["todo", "generated", "scheduled", "published"];

  return (
    <div className="inline-flex items-center p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl gap-1">
      {options.map((opt) => {
        const isSelected = status === opt;
        const config = STATUS_CONFIG[opt];
        const IconComponent = STATUS_ICONS[opt];

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex items-center gap-1.5 transition-all duration-150 rounded-lg cursor-pointer font-medium ${
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs"
            } ${
              isSelected
                ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs border border-neutral-200/80 dark:border-neutral-700"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-white/50 dark:hover:bg-neutral-800/50"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full transition-transform"
              style={{ backgroundColor: config.color }}
            />
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
