import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Coding Platform",
  description: "Accepting programming projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  );
}