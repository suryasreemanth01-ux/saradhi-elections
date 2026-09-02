import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saradhi Elections 2026",
  description: "Colony Election Voting System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
