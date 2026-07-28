import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GalleryOS — From camera roll to client-ready", template: "%s — GalleryOS" },
  description: "A calmer photography workflow for culling, proofing, and delivering client galleries.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
