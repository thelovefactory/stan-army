"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowRight, Menu, X, Headphones } from "lucide-react";
import { useState } from "react";
function BrandLogo() {
  return (
    <Link href="/" aria-label="Stan Army home" className="logo">
      <Image
        src="/brand/stanarmy-header.png"
        width={502}
        height={224}
        alt="Stan Army"
        priority
      />
    </Link>
  );
}
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/discover", label: "Discover" },
    { href: "/armies/nova", label: "The demo army" },
    { href: "/fans/jess-wav", label: "Fan space" },
    { href: "/boards", label: "My Boards" },
  ];
  if (path === "/beta")
    return (
      <>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="site-header beta-header">
          <div className="container header-inner">
            <BrandLogo />
            <span className="beta-header-label">BETA PREVIEW</span>
            <Link href="/" className="text-link">
              Explore Stan Army <ArrowUpRight size={17} />
            </Link>
          </div>
        </header>
      </>
    );
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className={`site-header${path === "/" ? " landing-header" : ""}`}>
        <div className="container header-inner">
          <BrandLogo />
          <nav aria-label="Main navigation" className="desktop-nav">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={path === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header-end">
            <span className="prototype-label">
              <span /> VISUAL PROTOTYPE
            </span>
            <Link href="/create" className="button button-small">
              {path === "/" ? (
                <span>
                  Build your army <ArrowRight size={19} />
                </span>
              ) : (
                <>
                  Start an Army <ArrowUpRight size={15} />
                </>
              )}
            </Link>
            <button
              className="menu-button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav aria-label="Mobile navigation" className="mobile-nav">
            {[
              ...links,
              {
                href: "/create",
                label: path === "/" ? "Build your army" : "Start an Army",
              },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label} <ArrowUpRight size={16} />
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer container">
      <div>
        <Link href="/" className="footer-wordmark">
          stan.army<span>✳</span>
        </Link>
        <p>Whatever you stan for. Stan for it here.</p>
      </div>
      <div className="footer-meta">
        <span>
          <Headphones size={14} /> Built by the stans. For the stans.
        </span>
        <p>
          Milestone 01 · Sample communities & demo content · Nothing is
          published.
        </p>
        <Link href="/discover">Find your people ↗</Link>
      </div>
    </footer>
  );
}
export function DemoNote({ compact = false }: { compact?: boolean }) {
  return (
    <p className={`demo-note ${compact ? "compact" : ""}`}>
      <span className="demo-dot" /> DEMO SPACE{" "}
      <span>
        ·{" "}
        {compact
          ? "Fictional artist"
          : "Fictional artists, sample counts & conversations. Your changes last until refresh."}
      </span>
    </p>
  );
}
