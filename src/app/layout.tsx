import type { Metadata } from "next";
import "./globals.css";
import "./profile-theme.css";
import "./pivot.css";
import "./living.css";
import "./player.css";
import "./army-layout.css";
import { Header, Footer } from "@/components/shell";
import { BoardsProvider } from "@/components/boards-provider";
import { DemoProvider } from "@/components/demo-provider";
export const metadata: Metadata = {
  title: {
    default: "Stan Army — Every artist needs an army.",
    template: "%s · Stan Army",
  },
  description:
    "A local visual prototype for a music-first fan-led community. Discover fictional artists, explore their spaces, and find your people.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <BoardsProvider>
            <Header />
            {children}
            <Footer />
          </BoardsProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
