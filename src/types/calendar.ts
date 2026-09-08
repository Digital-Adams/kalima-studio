export type SlotType = "Matin" | "Soir";

export type PublicationStatus = "todo" | "generated" | "scheduled" | "published";

export interface FacebookFields {
  title: string;
  arabic: string;
  phonetic: string;
  translation: string;
  description: string;
  cta: string;
  hashtags: string;
  full_post: string;
}

export interface PublicationItem {
  id: string;
  day: number;
  slot: SlotType;
  time: string;
  number: number;
  theme: string;
  arabic: string;
  phonetic: string;
  french_written: string;
  french_spoken: string;
  omni_prompt: string;
  facebook_fields: FacebookFields;
  status: PublicationStatus;
}

export type CalendarData = PublicationItem[];

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export const STATUS_CONFIG: Record<PublicationStatus, StatusConfig> = {
  todo: {
    label: "À faire",
    color: "#64748b",
    bgColor: "rgba(100, 116, 139, 0.12)",
    borderColor: "rgba(100, 116, 139, 0.25)",
    icon: "⚪",
  },
  generated: {
    label: "Vidéo générée",
    color: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.12)",
    borderColor: "rgba(234, 179, 8, 0.3)",
    icon: "🟡",
  },
  scheduled: {
    label: "Planifié",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.12)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    icon: "🔵",
  },
  published: {
    label: "Publié",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    icon: "🟢",
  },
};
