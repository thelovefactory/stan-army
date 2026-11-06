'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X, Headphones } from 'lucide-react';
import { useState } from 'react';
export function Header() {
  const path = usePathname(); const [open, setOpen] = useState(false);
  const links = [{ href: '/discover', label: 'Discover' }, { href: '/artists/nova-reign', label: 'The demo army' }];
  return <><a href="#main" className="skip-link">Skip to content</a><header className="site-header"><div className="container header-inner"><Link href="/" aria-label="Stan Army home" className="logo"><Image src="/brand/stan-army-logo.png" width={160} height={132} alt="Stan Army" priority /></Link><nav aria-label="Main navigation" className="desktop-nav">{links.map(l => <Link key={l.href} href={l.href} aria-current={path === l.href ? 'page' : undefined}>{l.label}</Link>)}</nav><div className="header-end"><span className="prototype-label"><span /> VISUAL PROTOTYPE</span><Link href="/create" className="button button-small">Create your army <ArrowUpRight size={15} /></Link><button className="menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div>{open && <nav aria-label="Mobile navigation" className="mobile-nav">{[...links, { href: '/create', label: 'Create your army' }].map(l => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label} <ArrowUpRight size={16} /></Link>)}</nav>}</header></>;
}
export function Footer() { return <footer className="site-footer container"><div><Link href="/" className="footer-wordmark">stan.army<span>✳</span></Link><p>The heartbeat of every artist is their community.</p></div><div className="footer-meta"><span><Headphones size={14} /> Made for the music. Built around the people.</span><p>Milestone 01 · Fictional artists & demo content · Nothing is published.</p><Link href="/discover">Find your people ↗</Link></div></footer>; }
export function DemoNote({ compact = false }: { compact?: boolean }) { return <p className={`demo-note ${compact ? 'compact' : ''}`}><span className="demo-dot" /> DEMO SPACE <span>· {compact ? 'Fictional artist' : 'Fictional artists, sample counts & conversations. Your changes last until refresh.'}</span></p>; }
