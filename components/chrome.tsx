"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Headphones, Search, Plus } from "lucide-react";
import { useState } from "react";

export function Header() {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Stan Army home">
          stan<span>army</span>
          <sup>™</sup>
        </Link>
        <nav className={menu ? "nav open" : "nav"} aria-label="Main navigation">
          <Link
            aria-current={path === "/discover" ? "page" : undefined}
            href="/discover"
            onClick={() => setMenu(false)}
          >
            Discovery
          </Link>
          <Link
            aria-current={path.startsWith("/army") ? "page" : undefined}
            href="/army/nova"
            onClick={() => setMenu(false)}
          >
            The listening room <Headphones size={15} />
          </Link>
          <span className="nav-note">Made for the music.</span>
        </nav>
        <div className="header-actions">
          <Link
            href="/discover"
            className="icon-button search-link"
            aria-label="Search artists"
          >
            <Search size={20} />
          </Link>
          <Link href="/create" className="button small outline">
            <Plus size={16} /> Create Your Army
          </Link>
          <button
            className="icon-button mobile-menu"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/" className="brand">
        stan<span>army</span>
        <sup>™</sup>
      </Link>
      <p>The heartbeat of every artist is their community.</p>
      <span className="micro">MILESTONE 01 · VISUAL PROTOTYPE</span>
      <Link href="/discover">Find your people</Link>
    </footer>
  );
}
export function DemoNotice() {
  return (
    <div className="demo-notice">
      <span className="demo-tag">DEMO SPACE</span>
      <span>
        Fictional artists. Sample activity. A little taste of what’s coming.
      </span>
    </div>
  );
}
