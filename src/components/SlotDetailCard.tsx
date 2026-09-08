"use client";

import { PublicationItem, PublicationStatus } from "../types/calendar";
import { CopyButton } from "./CopyButton";
import { StatusSelector } from "./StatusSelector";
import { Video, Share2, Sun, Moon, Sparkles, Hash, MessageSquare, BookOpen, Layers } from "lucide-react";

interface SlotDetailCardProps {
  item: PublicationItem;
  onStatusChange: (status: PublicationStatus) => void;
}

export function SlotDetailCard({ item, onStatusChange }: SlotDetailCardProps) {
  const isMatin = item.slot === "Matin";
  const { facebook_fields } = item;

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-5 md:p-6 shadow-xs space-y-6">
      {/* Top Bar: Time, Theme & Status Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isMatin
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            }`}
          >
            {isMatin ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Créneau {item.slot} ({item.time})
              </span>
              <span className="text-xs text-neutral-500 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-mono">
                Reel #{item.number < 10 ? `0${item.number}` : item.number}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Thème : <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item.theme}</span>
            </p>
          </div>
        </div>

        {/* Status Selector */}
        <StatusSelector status={item.status} onChange={onStatusChange} size="sm" />
      </div>

      {/* Main Arabic Callout */}
      <div className="rounded-xl p-4 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-4">
        <div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white" dir="rtl">
            {item.arabic}
          </div>
          <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
            {item.phonetic}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Traduction écrite</div>
          <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {item.french_written}
          </div>
        </div>
      </div>

      {/* 1. Prompt Omni 1.1 Flash Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            <Video className="w-3.5 h-3.5 text-indigo-500" />
            <span>1. Prompt Vidéo Omni 1.1 Flash (10.0s)</span>
          </div>
          <CopyButton
            text={item.omni_prompt}
            label="Copier le Prompt"
            size="sm"
            variant="accent"
          />
        </div>
        <div className="p-3 rounded-xl bg-neutral-900 text-neutral-200 dark:bg-black font-mono text-xs leading-relaxed max-h-32 overflow-y-auto border border-neutral-800 selection:bg-indigo-500 selection:text-white">
          {item.omni_prompt}
        </div>
      </div>

      {/* 2. Atomic Facebook Fields Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            <Share2 className="w-3.5 h-3.5 text-blue-500" />
            <span>2. Champs Facebook (À copier individuellement)</span>
          </div>
          <CopyButton
            text={facebook_fields.full_post}
            label="Tout le post d'un coup"
            size="sm"
            variant="ghost"
          />
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Field: Titre / Accroche */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Accroche & Titre
              </span>
              <p className="text-neutral-800 dark:text-neutral-200 font-medium truncate mt-0.5">
                {facebook_fields.title}
              </p>
            </div>
            <CopyButton text={facebook_fields.title} size="sm" variant="secondary" />
          </div>

          {/* Dual Field: Arabe & Phonétique */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Arabe seul
                </span>
                <span className="text-sm font-semibold text-neutral-900 dark:text-white" dir="rtl">
                  {facebook_fields.arabic}
                </span>
              </div>
              <CopyButton text={facebook_fields.arabic} size="sm" variant="ghost" />
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Phonétique
                </span>
                <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate block">
                  {facebook_fields.phonetic}
                </span>
              </div>
              <CopyButton text={facebook_fields.phonetic} size="sm" variant="ghost" />
            </div>
          </div>

          {/* Field: Traduction */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Traduction française
              </span>
              <p className="text-neutral-800 dark:text-neutral-200 font-medium truncate mt-0.5">
                {facebook_fields.translation}
              </p>
            </div>
            <CopyButton text={facebook_fields.translation} size="sm" variant="secondary" />
          </div>

          {/* Field: Description / Contexte */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Contexte d&apos;usage
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 mt-0.5 leading-relaxed">
                {facebook_fields.description}
              </p>
            </div>
            <CopyButton text={facebook_fields.description} size="sm" variant="secondary" />
          </div>

          {/* Field: CTA / Question */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Question d&apos;engagement & CTA
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 mt-0.5 whitespace-pre-line leading-relaxed">
                {facebook_fields.cta}
              </p>
            </div>
            <CopyButton text={facebook_fields.cta} size="sm" variant="secondary" />
          </div>

          {/* Field: Hashtags */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Hashtags
              </span>
              <p className="text-blue-600 dark:text-blue-400 font-mono text-[11px] truncate mt-0.5">
                {facebook_fields.hashtags}
              </p>
            </div>
            <CopyButton text={facebook_fields.hashtags} size="sm" variant="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
