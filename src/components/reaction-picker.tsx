"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { readImage } from "@/lib/image-upload";
import { ThemeAsset } from "@/lib/theme";
const gifs = [
  { id: "leave-your-mark", name: "Leave your mark", tags: "heart love stan" },
  {
    id: "bside-people",
    name: "B-side people",
    tags: "music friends community",
  },
];
const emojis = [
  "❤️",
  "🔥",
  "✨",
  "😭",
  "😍",
  "🥹",
  "🪩",
  "🎧",
  "🎶",
  "🙌",
  "💜",
  "😂",
  "👏",
  "⭐",
  "🦋",
  "💿",
  "🫶",
  "👀",
];
export function ReactionPicker({
  initialTab,
  onEmoji,
  onGif,
  onClose,
  canAttach,
  onBusy,
}: {
  initialTab: "gifs" | "emoji";
  onEmoji: (emoji: string) => void;
  onGif: (asset: ThemeAsset) => void;
  onClose: () => void;
  canAttach: boolean;
  onBusy: (busy: boolean) => void;
}) {
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, []);
  const [tab, setTab] = useState(initialTab),
    [query, setQuery] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <section
      ref={panel}
      className="reaction-picker"
      role="region"
      aria-label="GIF and emoji picker"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <header>
        <div role="group" aria-label="Picker category">
          <button
            type="button"
            aria-pressed={tab === "gifs"}
            onClick={() => setTab("gifs")}
          >
            GIFs
          </button>
          <button
            type="button"
            aria-pressed={tab === "emoji"}
            onClick={() => setTab("emoji")}
          >
            Emoji
          </button>
        </div>
        <button
          type="button"
          className="picker-close"
          aria-label="Close GIF and emoji picker"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </header>
      {tab === "emoji" ? (
        <div className="emoji-grid">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              aria-label={`Insert ${emoji}`}
              onClick={() => onEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <>
          <label htmlFor="gif-search" className="sr-only">
            Search demo GIFs
          </label>
          <input
            id="gif-search"
            maxLength={100}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search demo GIFs"
          />
          <div className="gif-picker-grid">
            {gifs
              .filter((g) =>
                `${g.name} ${g.tags}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((g) => (
                <button
                  key={g.id}
                  type="button"
                  disabled={busy || !canAttach}
                  aria-label={`Attach ${g.name} GIF`}
                  onClick={async () => {
                    setBusy(true);
                    onBusy(true);
                    setNotice("");
                    try {
                      const response = await fetch(`/gifs/${g.id}.gif`);
                      if (!response.ok) throw new Error("Could not load GIF.");
                      const blob = await response.blob();
                      onGif(
                        await readImage(
                          new File([blob], `${g.id}.gif`, {
                            type: "image/gif",
                          }),
                        ),
                      );
                    } catch (error) {
                      setNotice(
                        error instanceof Error
                          ? error.message
                          : "Could not load GIF.",
                      );
                    } finally {
                      setBusy(false);
                      onBusy(false);
                    }
                  }}
                >
                  <Image
                    src={`/gifs/${g.id}.png`}
                    width={240}
                    height={135}
                    alt=""
                  />
                  <span>{g.name}</span>
                </button>
              ))}
          </div>
          {!gifs.some((g) =>
            `${g.name} ${g.tags}`.toLowerCase().includes(query.toLowerCase()),
          ) && <p>No demo GIFs match. Try “music” or search on GIPHY.</p>}
          <p>
            Original demo GIFs · previews stay still.{" "}
            {canAttach
              ? "Pick one to attach."
              : "Cancel your poll to attach a GIF."}
          </p>
          <a
            href={`https://giphy.com/search/${encodeURIComponent(query.trim() || "music")}`}
            target="_blank"
            rel="noreferrer"
          >
            Search on GIPHY ↗
          </a>
          <small>
            Opens GIPHY in a new tab; external GIF importing isn’t connected.
          </small>
        </>
      )}
      <p role="status">{notice || (busy ? "Loading GIF…" : "")}</p>
    </section>
  );
}
