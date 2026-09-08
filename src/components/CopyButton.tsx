"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost" | "accent";
  className?: string;
}

export function CopyButton({
  text,
  label = "Copier",
  copiedLabel = "Copié !",
  iconOnly = false,
  size = "md",
  variant = "secondary",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-xs font-medium gap-2",
    lg: "px-4 py-2.5 text-sm font-semibold gap-2.5",
  };

  const variantClasses = {
    primary: copied
      ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
      : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 border-transparent shadow-sm",
    accent: copied
      ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
      : "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-sm",
    secondary: copied
      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
      : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700",
    ghost: copied
      ? "text-emerald-500 bg-emerald-500/10"
      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800",
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copié dans le presse-papier" : "Copier"}
      className={`inline-flex items-center justify-center rounded-lg border transition-all duration-150 active:scale-95 cursor-pointer select-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
    >
      {copied ? (
        <>
          <Check className={`${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} text-emerald-500 animate-in fade-in zoom-in-75`} />
          {!iconOnly && <span className="font-medium text-emerald-600 dark:text-emerald-400">{copiedLabel}</span>}
        </>
      ) : (
        <>
          <Copy className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
          {!iconOnly && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
