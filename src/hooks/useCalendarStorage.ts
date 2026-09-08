"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { PublicationItem, PublicationStatus } from "../types/calendar";
import defaultDataset from "../data/calendar_dataset.json";

const STORAGE_KEY_CALENDAR = "kalima_reels_calendar_v1";
const STORAGE_KEY_STATUSES = "kalima_reels_statuses_v1";
const STORAGE_KEY_GITHUB_URL = "kalima_reels_github_raw_url";

export function useCalendarStorage() {
  const [items, setItems] = useState<PublicationItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showNotification = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  // Initialize from LocalStorage or default dataset
  useEffect(() => {
    try {
      const storedGithub = localStorage.getItem(STORAGE_KEY_GITHUB_URL);
      if (storedGithub) setGithubUrl(storedGithub);

      const storedCalendar = localStorage.getItem(STORAGE_KEY_CALENDAR);
      const storedStatuses = localStorage.getItem(STORAGE_KEY_STATUSES);

      let baseItems: PublicationItem[] = defaultDataset as PublicationItem[];

      if (storedCalendar) {
        try {
          const parsed = JSON.parse(storedCalendar);
          if (Array.isArray(parsed) && parsed.length > 0) {
            baseItems = parsed;
          }
        } catch {
          // Fallback to default
        }
      }

      // Merge saved statuses
      if (storedStatuses) {
        try {
          const statusMap: Record<string, PublicationStatus> = JSON.parse(storedStatuses);
          baseItems = baseItems.map((item) => ({
            ...item,
            status: statusMap[item.id] || item.status || "todo",
          }));
        } catch {
          // Ignore
        }
      }

      setItems(baseItems);
    } catch {
      setItems(defaultDataset as PublicationItem[]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update a single item's status
  const updateStatus = useCallback((id: string, status: PublicationStatus) => {
    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      try {
        const statusMap: Record<string, PublicationStatus> = {};
        updated.forEach((it) => {
          statusMap[it.id] = it.status;
        });
        localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(statusMap));
      } catch (err) {
        console.error("Failed to save statuses to localStorage", err);
      }
      return updated;
    });
  }, []);

  // Import custom JSON file
  const importCalendar = useCallback((importedItems: PublicationItem[]) => {
    if (!Array.isArray(importedItems) || importedItems.length === 0) {
      showNotification("Fichier JSON invalide ou vide.", "error");
      return false;
    }

    // Basic schema check
    const isValid = importedItems.every(
      (item) => item.day && item.slot && item.omni_prompt && item.facebook_fields
    );

    if (!isValid) {
      showNotification("Format non reconnu : les champs requis (day, slot, prompt, facebook_fields) sont manquants.", "error");
      return false;
    }

    try {
      localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(importedItems));
      setItems(importedItems);
      showNotification(`Calendrier mis à jour avec succès (${importedItems.length} publications).`, "success");
      return true;
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors de la sauvegarde locale.", "error");
      return false;
    }
  }, [showNotification]);

  // Fetch from GitHub raw URL
  const fetchFromGitHub = useCallback(async (url: string) => {
    if (!url.trim()) {
      showNotification("Veuillez saisir une URL GitHub Raw valide.", "error");
      return false;
    }
    setIsLoadingUrl(true);
    try {
      const response = await fetch(url.trim());
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const success = importCalendar(data);
        if (success) {
          localStorage.setItem(STORAGE_KEY_GITHUB_URL, url.trim());
          setGithubUrl(url.trim());
          showNotification("Synchronisation GitHub réussie !", "success");
          return true;
        }
      } else {
        throw new Error("Le format reçu n'est pas un tableau JSON");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Erreur inconnue";
      showNotification(`Échec de récupération GitHub : ${errMsg}`, "error");
      return false;
    } finally {
      setIsLoadingUrl(false);
    }
    return false;
  }, [importCalendar, showNotification]);

  // Reset to initial dataset
  const resetToDefault = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_CALENDAR);
      localStorage.removeItem(STORAGE_KEY_STATUSES);
      setItems(defaultDataset as PublicationItem[]);
      showNotification("Calendrier réinitialisé aux 60 publications d'origine.", "info");
    } catch (err) {
      console.error(err);
    }
  }, [showNotification]);

  // Export state as HTML report via API route (proper Content-Disposition header)
  const exportBackup = useCallback(async () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    try {
      showNotification("Génération du rapport…", "info");
      const res = await fetch("/api/export-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Get filename from Content-Disposition if present, fallback to dateStr
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] ?? `kalima_rapport_${dateStr}.html`;

      // Blob + object URL is safe here because the URL comes from a real HTTP response
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(url);
      }, 1000);
      showNotification(`✅ Rapport téléchargé : ${filename}`, "success");
    } catch (err) {
      console.error("[exportBackup]", err);
      showNotification("Impossible de générer le rapport.", "error");
    }
  }, [items, showNotification]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((i) => i.status === "published").length;
    const scheduled = items.filter((i) => i.status === "scheduled").length;
    const generated = items.filter((i) => i.status === "generated").length;
    const todo = items.filter((i) => i.status === "todo").length;
    const percentage = total > 0 ? Math.round((published / total) * 100) : 0;

    return {
      total,
      published,
      scheduled,
      generated,
      todo,
      percentage,
    };
  }, [items]);

  return {
    items,
    isLoaded,
    stats,
    updateStatus,
    importCalendar,
    fetchFromGitHub,
    resetToDefault,
    exportBackup,
    githubUrl,
    setGithubUrl,
    isLoadingUrl,
    notification,
  };
}
