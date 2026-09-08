"use client";

import { CheckCircle2, Clock, Sparkles, Send, RefreshCw, Upload, Download, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  stats: {
    total: number;
    published: number;
    scheduled: number;
    generated: number;
    todo: number;
    percentage: number;
  };
  onOpenSync: () => void;
  onExport: () => void;
}

export function Header({ stats, onOpenSync, onExport }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Thème 1 = Dark Mode par défaut
    // Seulement si l'utilisateur a explicitement choisi 'light', on utilise le mode clair
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme !== "light"; // dark par défaut si rien ou si 'dark'
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 font-bold text-lg shadow-sm">
              ك
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  Kalima Studio
                </h1>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  30 Jours • 60 Reels
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Gestionnaire de publication Omni 1.1 Flash & Facebook Reels
              </p>
            </div>
          </div>

          {/* Progress Tracker & Quick Actions */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {/* Quick Stats Pills */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stats.published}</span>
                <span className="text-neutral-400 font-normal">publiés</span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Send className="w-3.5 h-3.5" />
                <span>{stats.scheduled}</span>
                <span className="text-neutral-400 font-normal">planifiés</span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{stats.generated}</span>
                <span className="text-neutral-400 font-normal">générés</span>
              </div>
            </div>

            {/* Sync / Import Button */}
            <button
              type="button"
              onClick={onOpenSync}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              title="Importer ou synchroniser le calendrier"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync / Import</span>
            </button>

            {/* Export Button */}
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              title="Exporter le rapport HTML (calendrier + prompts + statuts)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rapport HTML</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2 font-medium">
            <span>Progression du mois :</span>
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold">
              {stats.published} / {stats.total} Reels ({stats.percentage}%)
            </span>
          </div>
          <div className="w-full sm:w-64 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
