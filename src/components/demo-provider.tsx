'use client';
import { createContext, useContext, useState } from 'react';
type Message = { text: string; time: string };
type DemoState = { enlisted: string[]; toggle: (slug: string) => void; messages: Record<string, Message[]>; send: (slug: string, text: string) => void };
const Context = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [enlisted, setEnlisted] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  function toggle(slug: string) { setEnlisted(current => current.includes(slug) ? current.filter(s => s !== slug) : [...current, slug]); }
  function send(slug: string, text: string) { setMessages(current => ({ ...current, [slug]: [...(current[slug] || []), { text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] })); }
  return <Context.Provider value={{ enlisted, toggle, messages, send }}>{children}</Context.Provider>;
}
export function useDemo() { const ctx = useContext(Context); if (!ctx) throw new Error('DemoProvider missing'); return ctx; }
