import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalima Studio — Gestionnaire de Publications 30 Jours",
  description: "Planification et publication des 60 Reels Facebook pour la série Kalima avec prompts Omni 1.1 Flash.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
        {children}
      </body>
    </html>
  );
}
