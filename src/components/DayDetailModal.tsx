"use client";

import { useEffect } from "react";
import { PublicationItem, PublicationStatus } from "../types/calendar";
import { SlotDetailCard } from "./SlotDetailCard";
import { X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DayDetailModalProps {
  day: number | null;
  items: PublicationItem[];
  onClose: () => void;
  onSelectDay: (day: number) => void;
  onUpdateStatus: (id: string, status: PublicationStatus) => void;
}

export function DayDetailModal({
  day,
  items,
  onClose,
  onSelectDay,
  onUpdateStatus,
}: DayDetailModalProps) {
  useEffect(() => {
    if (day === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && day > 1) {
        onSelectDay(day - 1);
      } else if (e.key === "ArrowRight" && day < 30) {
        onSelectDay(day + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [day, onClose, onSelectDay]);

  if (day === null) return null;

  const matinItem = items.find((i) => i.day === day && i.slot === "Matin");
  const soirItem = items.find((i) => i.day === day && i.slot === "Soir");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-7xl max-h-[94vh] bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
          {/* Day Title & Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Jour {day < 10 ? `0${day}` : day}
              </h2>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={day <= 1}
                onClick={() => onSelectDay(day - 1)}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Jour précédent (Flèche Gauche)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-neutral-400 font-mono px-1">
                {day} / 30
              </span>
              <button
                type="button"
                disabled={day >= 30}
                onClick={() => onSelectDay(day + 1)}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-700 dark:text-neutral-300 transition-colors"
                title="Jour suivant (Flèche Droite)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            title="Fermer (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content: 2 Slots */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Slot 1: Matin */}
            {matinItem ? (
              <SlotDetailCard
                item={matinItem}
                onStatusChange={(status) => onUpdateStatus(matinItem.id, status)}
              />
            ) : (
              <div className="p-8 text-center text-neutral-400 border border-dashed rounded-2xl">
                Aucune publication pour le matin
              </div>
            )}

            {/* Slot 2: Soir */}
            {soirItem ? (
              <SlotDetailCard
                item={soirItem}
                onStatusChange={(status) => onUpdateStatus(soirItem.id, status)}
              />
            ) : (
              <div className="p-8 text-center text-neutral-400 border border-dashed rounded-2xl">
                Aucune publication pour le soir
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
