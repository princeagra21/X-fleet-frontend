import type { Metadata } from "next";
import { APP_CONFIG } from "@/constants";
import "./globals.css";
import "@/styles/fonts.css";

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  authors: [{ name: APP_CONFIG.author }],
  keywords: ['fleet management', 'logistics', 'transportation', 'dashboard'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        {children}
      </body>
    </html>
  );
}
