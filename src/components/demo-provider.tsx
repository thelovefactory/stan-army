"use client";
import { createContext, useContext, useState } from "react";
import {
  FanNote,
  FanReply,
  safeNoteStyle,
  validateMark,
} from "@/lib/fan-space";
type Message = { text: string; time: string };
type DemoState = {
  enlisted: string[];
  toggle: (id: string) => void;
  messages: Record<string, Message[]>;
  send: (id: string, text: string) => void;
  notes: Record<string, FanNote[]>;
  leaveMark: (armyId: string, text: string, style: string) => void;
  replies: Record<string, FanReply[]>;
  reply: (key: string, text: string) => void;
  hearts: string[];
  heart: (key: string) => void;
  savedMemories: string[];
  keepMemory: (id: string) => void;
};
const Context = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [enlisted, setEnlisted] = useState<string[]>([]),
    [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [notes, setNotes] = useState<Record<string, FanNote[]>>({}),
    [replies, setReplies] = useState<Record<string, FanReply[]>>({}),
    [hearts, setHearts] = useState<string[]>([]),
    [savedMemories, setSavedMemories] = useState<string[]>([]);
  function toggle(id: string) {
    setEnlisted((c) =>
      c.includes(id) ? c.filter((s) => s !== id) : [...c, id],
    );
  }
  function send(id: string, text: string) {
    setMessages((c) => ({
      ...c,
      [id]: [
        ...(c[id] || []),
        {
          text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));
  }
  function leaveMark(armyId: string, text: string, style: string) {
    if (validateMark(text)) return;
    const note: FanNote = {
      id: crypto.randomUUID(),
      handle: "jess.wav",
      name: "You",
      initials: "YO",
      style: safeNoteStyle(style),
      label: "YOUR MARK · LOCAL DEMO",
      text: text.trim(),
      likes: 0,
      replies: [],
      local: true,
    };
    setNotes((c) => ({ ...c, [armyId]: [note, ...(c[armyId] || [])] }));
  }
  function reply(key: string, text: string) {
    if (validateMark(text)) return;
    const r: FanReply = {
      id: crypto.randomUUID(),
      handle: "you.demo",
      text: text.trim(),
    };
    setReplies((c) => ({ ...c, [key]: [...(c[key] || []), r] }));
  }
  function heart(key: string) {
    setHearts((c) =>
      c.includes(key) ? c.filter((k) => k !== key) : [...c, key],
    );
  }
  function keepMemory(id: string) {
    setSavedMemories((c) =>
      c.includes(id) ? c.filter((k) => k !== id) : [...c, id],
    );
  }
  return (
    <Context.Provider
      value={{
        enlisted,
        toggle,
        messages,
        send,
        notes,
        leaveMark,
        replies,
        reply,
        hearts,
        heart,
        savedMemories,
        keepMemory,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("DemoProvider missing");
  return ctx;
}
