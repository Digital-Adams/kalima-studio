"use client";

import { useState } from "react";
import { Upload, RefreshCw, AlertTriangle, X, Check, FileJson } from "lucide-react";
import { PublicationItem } from "../types/calendar";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: PublicationItem[]) => boolean;
  onFetchGitHub: (url: string) => Promise<boolean>;
  onReset: () => void;
  githubUrl: string;
  isLoadingUrl: boolean;
}

export function SyncModal({
  isOpen,
  onClose,
  onImport,
  onFetchGitHub,
  onReset,
  githubUrl: initialGithubUrl,
  isLoadingUrl,
}: SyncModalProps) {
  const [url, setUrl] = useState(initialGithubUrl);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const success = onImport(json);
        if (success) onClose();
      } catch (err) {
        alert("Fichier JSON invalide.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSyncGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onFetchGitHub(url);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-6 overflow-hidden space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Mettre à jour le Calendrier
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Import JSON direct ou synchronisation GitHub
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. File Upload Dropzone */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block">
            1. Importer un nouveau fichier JSON
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
              dragActive
                ? "border-indigo-500 bg-indigo-500/5"
                : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-950/50"
            }`}
          >
            <FileJson className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
              Glissez-déposez votre fichier <span className="font-mono font-medium">calendar_dataset.json</span> ici
            </p>
            <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer shadow-xs transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Parcourir mes fichiers</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* 2. GitHub Raw URL Sync */}
        <form onSubmit={handleSyncGitHub} className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
            <GithubIcon className="w-3.5 h-3.5" />
            <span>2. Synchroniser depuis GitHub (Raw URL)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://raw.githubusercontent.com/.../calendar.json"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoadingUrl || !url.trim()}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isLoadingUrl ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>Sync</span>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400">
            Permet de mettre à jour le calendrier automatiquement sans toucher au code de l&apos;application.
          </p>
        </form>

        {/* 3. Reset Button */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Besoin de repartir à zéro ?</span>
          <button
            type="button"
            onClick={() => {
              if (confirm("Réinitialiser le calendrier aux 60 publications par défaut ?")) {
                onReset();
                onClose();
              }
            }}
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors cursor-pointer"
          >
            Réinitialiser les 60 Reels
          </button>
        </div>
      </div>
    </div>
  );
}
