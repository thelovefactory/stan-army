import type { Metadata } from "next";
import { Header, Footer } from "@/components/chrome";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Stan Army — Every artist needs an army.",
    template: "%s · Stan Army",
  },
  description:
    "Your music. Your people. Your corner of the internet. Explore the Stan Army visual prototype.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
