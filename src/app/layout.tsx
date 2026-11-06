import type { Metadata } from "next";
import "./globals.css";
import "./profile-theme.css";
import { Header, Footer } from "@/components/shell";
import { DemoProvider } from "@/components/demo-provider";
export const metadata: Metadata = {
  title: {
    default: "Stan Army — Every artist needs an army.",
    template: "%s · Stan Army",
  },
  description:
    "A local visual prototype for a music-first artist community. Discover fictional artists, explore their spaces, and find your people.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <Header />
          {children}
          <Footer />
        </DemoProvider>
      </body>
    </html>
  );
}
