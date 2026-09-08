"use client";

import { useState } from "react";
import { useCalendarStorage } from "../hooks/useCalendarStorage";
import { Header } from "../components/Header";
import { CalendarView } from "../components/CalendarView";
import { DayDetailModal } from "../components/DayDetailModal";
import { SyncModal } from "../components/SyncModal";
import { NotificationBanner } from "../components/NotificationBanner";

export default function Home() {
  const {
    items,
    isLoaded,
    stats,
    updateStatus,
    importCalendar,
    fetchFromGitHub,
    resetToDefault,
    exportBackup,
    githubUrl,
    isLoadingUrl,
    notification,
  } = useCalendarStorage();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-400 text-xs">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>Chargement du calendrier Kalima...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Header */}
      <Header
        stats={stats}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onExport={exportBackup}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarView
          items={items}
          onSelectDay={(day) => setSelectedDay(day)}
        />
      </main>

      {/* Day Detail Modal (Matin & Soir cases) */}
      <DayDetailModal
        day={selectedDay}
        items={items}
        onClose={() => setSelectedDay(null)}
        onSelectDay={(day) => setSelectedDay(day)}
        onUpdateStatus={updateStatus}
      />

      {/* JSON Import & GitHub Sync Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onImport={importCalendar}
        onFetchGitHub={fetchFromGitHub}
        onReset={resetToDefault}
        githubUrl={githubUrl}
        isLoadingUrl={isLoadingUrl}
      />

      {/* Toast Notification */}
      <NotificationBanner notification={notification} />
    </div>
  );
}
