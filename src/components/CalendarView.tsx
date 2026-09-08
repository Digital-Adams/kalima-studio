"use client";

import { useState, useMemo } from "react";
import { PublicationItem } from "../types/calendar";
import { CalendarCard } from "./CalendarCard";
import { Search, Filter, Sparkles, CheckCircle2 } from "lucide-react";

interface CalendarViewProps {
  items: PublicationItem[];
  onSelectDay: (day: number) => void;
}

export function CalendarView({ items, onSelectDay }: CalendarViewProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [search, setSearch] = useState("");

  // Group items by day (1 to 30)
  const daysData = useMemo(() => {
    const daysMap: Record<number, { matin?: PublicationItem; soir?: PublicationItem }> = {};

    for (let d = 1; d <= 30; d++) {
      daysMap[d] = {};
    }

    items.forEach((item) => {
      if (!daysMap[item.day]) daysMap[item.day] = {};
      if (item.slot === "Matin") daysMap[item.day].matin = item;
      if (item.slot === "Soir") daysMap[item.day].soir = item;
    });

    return daysMap;
  }, [items]);

  // Filtered days list
  const filteredDays = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => i + 1).filter((day) => {
      const { matin, soir } = daysData[day] || {};
      const isBothPublished = matin?.status === "published" && soir?.status === "published";

      // Filter by status
      if (filter === "completed" && !isBothPublished) return false;
      if (filter === "pending" && isBothPublished) return false;

      // Filter by search term
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesMatin =
          matin?.arabic.toLowerCase().includes(query) ||
          matin?.phonetic.toLowerCase().includes(query) ||
          matin?.french_written.toLowerCase().includes(query) ||
          matin?.theme.toLowerCase().includes(query);
        const matchesSoir =
          soir?.arabic.toLowerCase().includes(query) ||
          soir?.phonetic.toLowerCase().includes(query) ||
          soir?.french_written.toLowerCase().includes(query) ||
          soir?.theme.toLowerCase().includes(query);

        if (!matchesMatin && !matchesSoir) return false;
      }

      return true;
    });
  }, [daysData, filter, search]);

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl gap-1 text-xs self-start">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
            }`}
          >
            Tous les jours (30)
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "pending"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
            }`}
          >
            À compléter
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "completed"
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
            }`}
          >
            Terminés
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher (mot arabe, thème, sens)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Grid of 30 days */}
      {filteredDays.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 text-xs">
          Aucun jour ne correspond à vos critères de recherche.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredDays.map((day) => {
            const dayInfo = daysData[day];
            return (
              <CalendarCard
                key={day}
                day={day}
                matinItem={dayInfo?.matin}
                soirItem={dayInfo?.soir}
                onSelectDay={onSelectDay}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
