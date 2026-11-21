"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Music2 } from "lucide-react";
import { parseArmyMusic } from "@/lib/army-music";
import s from "./army-stream-player.module.css";

export function ArmyStreamPlayer({ source, edit, editing = false, full = false, save, cancel }: {
  source: string | null;
  edit: () => void;
  editing?: boolean;
  full?: boolean;
  save: (source: string | null) => void;
  cancel: () => void;
}) {
  const music = parseArmyMusic(source);
  return <section className={s.player} data-window-body="music" data-player-size={full ? "full" : "compact"} aria-label="Army stereo">
    {editing && <MusicLinkForm key={source ?? "empty"} source={source} save={save} cancel={cancel} />}
    {music ? <>
      {music.embed && <iframe className={s.embed} title={`${music.label} Army player`} src={music.embed} width="100%" height={music.provider === "spotify" ? full ? 352 : 152 : full ? 450 : 175} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />}
      <div className={s.fallback} data-link-only={!music.embed || undefined}>
        <a href={music.url} target="_blank" rel="noreferrer">Open {music.label}<ArrowUpRight size={13} /></a>
        {!music.embed && <p>Choose an album or playlist to listen here.</p>}
      </div>
      <p className="sr-only">Playback and controls are supplied by {music.label}. Availability, previews and sign-in requirements depend on the service.</p>
    </> : !editing && <div className={s.empty}><Music2 size={24} /><h3>Your Army’s soundtrack.</h3><button onClick={edit}>Add a music link<ArrowUpRight size={14} /></button></div>}
  </section>;
}

function MusicLinkForm({ source, save, cancel }: { source: string | null; save: (source: string | null) => void; cancel: () => void }) {
  const uid = useId();
  const [draft, setDraft] = useState(source ?? "");
  const [error, setError] = useState("");
  return <form className={s.settings} onSubmit={(event) => {
    event.preventDefault();
    const next = parseArmyMusic(draft);
    if (!next) { setError("Paste a Spotify or Apple Music track, playlist, album or artist link."); return; }
    save(next.url);
  }}>
    <label htmlFor={`${uid}-link`}>Music link</label>
    <input id={`${uid}-link`} type="url" required maxLength={1500} value={draft} placeholder="Paste a Spotify link" aria-invalid={!!error} aria-describedby={`${uid}-hint${error ? ` ${uid}-error` : ""}`} onChange={(event) => { setDraft(event.target.value); setError(""); }} />
    <p id={`${uid}-hint`}>Track, playlist, album or artist. Apple Music links work too.</p>
    {error && <p id={`${uid}-error`} role="alert" className={s.error}>{error}</p>}
    <div className={s.actions}><button type="submit" data-army-action>Save</button><button type="button" onClick={cancel}>Cancel</button>{source && <button type="button" onClick={() => save(null)}>Remove music</button>}</div>
  </form>;
}
