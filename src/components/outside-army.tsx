"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Play, Settings2, X } from "lucide-react";
import { useProfileTheme } from "./profile-theme";
import { readableColor } from "@/lib/theme";
import {
  gallerySourceUrl,
  getGallerySource,
  instagramGallerySource,
  parseSocialConfig,
  socialStorageKey,
} from "@/lib/social-channels";
import type { SocialConfig } from "@/lib/social-channels";

const changeEvent = "stan-army:social-updated";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

// Local artwork for reviewing the layout only. Never attributed to Instagram,
// paired with unrelated social permalinks, or displayed as an imported feed.
const layoutSamples = [
  { image: "/images/crowd.jpg", alt: "Sample concert crowd" },
  { image: "/images/brie.jpg", alt: "Sample brie photograph" },
  { image: "/images/sneakers.jpg", alt: "Sample sneakers photograph" },
  { image: "/images/artist.jpg", alt: "Sample artist portrait" },
  { image: "/gifs/bside-people.png", alt: "Sample fan artwork video", video: "/videos/bside-people.mp4" },
  { image: "/images/celebrity-pets.jpg", alt: "Sample pet photograph" },
  { image: "/brand/obsessions/community.png", alt: "Sample friends photograph" },
  { image: "/images/sienna.jpg", alt: "Sample pop artist portrait" },
  { image: "/images/room.jpg", alt: "Sample music venue" },
  { image: "/gifs/leave-your-mark.png", alt: "Sample creative video", video: "/videos/leave-your-mark.mp4" },
  { image: "/brand/obsessions/tv.png", alt: "Sample television obsession" },
  { image: "/brand/obsessions/cheese.png", alt: "Sample cheese obsession" },
];
const pageSize = 6;

function GalleryLayoutPreview() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(layoutSamples.length / pageSize);
  return (
    <>
      <div className="outside-gallery" aria-label="Sample gallery — design preview, not an Instagram feed">
        {layoutSamples.slice(page * pageSize, (page + 1) * pageSize).map((item) => (
          <a key={item.image} className="outside-tile" href={item.video ?? item.image}
            target="_blank" rel="noreferrer" aria-label={`Open ${item.alt.toLowerCase()}`}>
            <Image src={item.image} alt={item.alt} fill sizes="(max-width: 800px) 30vw, 160px" />
            {item.video && <span className="outside-video" aria-label="Video"><Play size={16} fill="currentColor" /></span>}
            <span className="outside-tile-open" aria-hidden="true"><ArrowUpRight size={18} /></span>
          </a>
        ))}
      </div>
      <footer className="outside-tools">
        <span>Sample media · not live</span>
        <nav aria-label="Gallery pages">
          <button type="button" aria-label="Previous images" title="Previous images"
            disabled={page === 0} onClick={() => setPage(page - 1)}><ArrowLeft size={17} /></button>
          <span className="outside-page" aria-live="polite">{page + 1} / {pageCount}</span>
          <button type="button" aria-label="Next images" title="Next images"
            disabled={page === pageCount - 1} onClick={() => setPage(page + 1)}><ArrowRight size={17} /></button>
        </nav>
      </footer>
    </>
  );
}

export function OutsideArmy({ armyId }: { armyId: string }) {
  const { theme, canEditCommunity } = useProfileTheme();
  const raw = useSyncExternalStore(subscribe, () => {
    try { return window.localStorage.getItem(socialStorageKey(armyId)); }
    catch { return null; }
  }, () => null);
  const config = useMemo(() => parseSocialConfig(raw, armyId), [raw, armyId]);
  const source = getGallerySource(config);
  const sourceLabel = source ? `${source.kind === "account" ? "@" : "#"}${source.value}` : "";
  const [input, setInput] = useState("");
  const [editingSource, setEditingSource] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(true);
  const showPreview = canEditCommunity && !!source && preview;
  const xAccount = config.accounts.find((account) => account.platform === "x");

  function save(next: SocialConfig) {
    if (!canEditCommunity) return false;
    try {
      window.localStorage.setItem(socialStorageKey(armyId), JSON.stringify(next));
      window.dispatchEvent(new Event(changeEvent));
      setError("");
      setNotice("Source saved on this device. Live imports are not connected yet.");
      return true;
    } catch {
      setError("Couldn’t save. Your existing settings are unchanged.");
      return false;
    }
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextSource = instagramGallerySource(editingSource ? input : sourceLabel);
    if (!nextSource) {
      setError("Enter a public @username, Instagram profile URL or #hashtag.");
      return;
    }
    if (save({ ...config, gallerySource: nextSource })) {
      setInput("");
      setEditingSource(false);
    }
  }
  const accent = readableColor(theme.outsideArmy.accent ?? theme.colors.accent, theme.panels.color);
  if (!source && !xAccount && !canEditCommunity) return null;

  return (
    <section className={`panel outside-army outside-${theme.outsideArmy.treatment} ${canEditCommunity ? "outside-has-manager" : ""}`}
      style={{ "--outside-accent": accent } as CSSProperties}
      aria-labelledby={`outside-heading-${armyId}`}>
      <h2 className="sr-only" id={`outside-heading-${armyId}`}>Outside the Army</h2>
      <header className="outside-toolbar">
        <Instagram size={16} aria-hidden="true" />
        {showPreview ? <span className="outside-account">Gallery preview</span>
          : source ? <a className="outside-account" href={gallerySourceUrl(source)} target="_blank" rel="noreferrer">{sourceLabel}<ArrowUpRight size={14} /></a>
            : <span className="outside-account">Outside the Army</span>}
      </header>

      {showPreview ? <GalleryLayoutPreview /> : (
        <div className="outside-empty">
          <p>{source ? "Gallery not connected yet." : "Add an account or hashtag."}</p>
          {source && <a href={gallerySourceUrl(source)} target="_blank" rel="noreferrer">View on Instagram <ArrowUpRight size={14} /></a>}
          {canEditCommunity && source && <button type="button" onClick={() => setPreview(true)}>Preview gallery layout</button>}
        </div>
      )}
      {xAccount && !showPreview && (
        <a className="outside-x-link" href={xAccount.url} target="_blank" rel="noreferrer">View @{xAccount.handle} on X <ArrowUpRight size={14} /></a>
      )}

      {canEditCommunity && (
        <details className="outside-manage">
          <summary aria-label="Gallery settings" title="Gallery settings"><Settings2 size={17} /><span className="sr-only">Gallery settings</span></summary>
          <form onSubmit={submit}>
            <label htmlFor={`outside-source-${armyId}`}>Instagram account or hashtag</label>
            <input id={`outside-source-${armyId}`} type="text" required maxLength={240}
              value={editingSource ? input : sourceLabel} placeholder="@username or #brie"
              onChange={(event) => { setInput(event.target.value); setEditingSource(true); setError(""); setNotice(""); }} />
            <p className="outside-hint">Public sources only. No Instagram sign-in. Hashtag posts will need approval before appearing.</p>
            <button type="submit">Save source</button>
          </form>
          <p className="outside-hint">Design preview uses sample artwork. Automatic imports are not connected yet; changing the source does not fetch posts.</p>
          <div className="outside-manage-actions">
            {source && <button type="button" onClick={() => setPreview(!preview)}>{preview ? "Hide layout preview" : "Show layout preview"}</button>}
            {source && <button type="button" onClick={() => save({ ...config, gallerySource: null,
              accounts: config.accounts.filter((account) => account.platform !== "instagram") })}>Remove Instagram source</button>}
          </div>
          {xAccount && <div className="outside-saved-link">
            <a href={xAccount.url} target="_blank" rel="noreferrer">X · @{xAccount.handle}<ArrowUpRight size={14} /></a>
            <button type="button" aria-label="Remove X link" onClick={() => save({ ...config,
              accounts: config.accounts.filter((account) => account.platform !== "x") })}><X size={16} /></button>
          </div>}
          <p className="outside-hint">Existing post links are preserved. Hide or restyle this module in Customise.</p>
          {error && <p className="outside-status" role="alert">{error}</p>}
          {notice && <p className="outside-status" role="status">{notice}</p>}
        </details>
      )}
    </section>
  );
}
