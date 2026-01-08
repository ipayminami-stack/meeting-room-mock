import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meeting Room Mock",
  description: "A mock application for meeting room reservation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col")}>
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t bg-muted/30 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026 Information-technology Promotion Agency, Japan（IPA）
          </div>
        </footer>
      </body>
    </html>
  );
}
