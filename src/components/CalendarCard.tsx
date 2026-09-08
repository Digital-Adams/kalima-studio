"use client";

import { PublicationItem, STATUS_CONFIG } from "../types/calendar";
import { CopyButton } from "./CopyButton";
import { Sparkles, Sun, Moon, ArrowUpRight } from "lucide-react";

interface CalendarCardProps {
  day: number;
  matinItem?: PublicationItem;
  soirItem?: PublicationItem;
  onSelectDay: (day: number) => void;
}

export function CalendarCard({ day, matinItem, soirItem, onSelectDay }: CalendarCardProps) {
  const isBothPublished = matinItem?.status === "published" && soirItem?.status === "published";
  const isPartial = matinItem?.status === "published" || soirItem?.status === "published";

  return (
    <div
      onClick={() => onSelectDay(day)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden p-4 flex flex-col justify-between ${
        isBothPublished
          ? "bg-emerald-500/[0.03] border-emerald-500/30 hover:border-emerald-500/60 shadow-xs"
          : "bg-white dark:bg-neutral-900/60 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md"
      }`}
    >
      {/* Card Header: Day Title & Quick Expand Icon */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Jour {day < 10 ? `0${day}` : day}
          </span>
          {isBothPublished && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Terminé
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
          <span className="text-xs font-medium">Ouvrir</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* 2 Slots: Matin and Soir */}
      <div className="mt-3 space-y-2.5 flex-1">
        {/* Matin Slot */}
        {matinItem && (
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-medium">
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Matin 12h00</span>
                <span className="text-[10px] text-neutral-400">#{matinItem.number < 10 ? `0${matinItem.number}` : matinItem.number}</span>
              </div>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: STATUS_CONFIG[matinItem.status].color }}
                title={`Statut : ${STATUS_CONFIG[matinItem.status].label}`}
              />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <div className="truncate">
                <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate" dir="rtl">
                  {matinItem.arabic}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {matinItem.french_written}
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <CopyButton
                  text={matinItem.omni_prompt}
                  label="Prompt"
                  size="sm"
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        )}

        {/* Soir Slot */}
        {soirItem && (
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors">
            <div className="flex items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-medium">
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Soir 18h30</span>
                <span className="text-[10px] text-neutral-400">#{soirItem.number < 10 ? `0${soirItem.number}` : soirItem.number}</span>
              </div>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: STATUS_CONFIG[soirItem.status].color }}
                title={`Statut : ${STATUS_CONFIG[soirItem.status].label}`}
              />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <div className="truncate">
                <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate" dir="rtl">
                  {soirItem.arabic}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {soirItem.french_written}
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <CopyButton
                  text={soirItem.omni_prompt}
                  label="Prompt"
                  size="sm"
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
