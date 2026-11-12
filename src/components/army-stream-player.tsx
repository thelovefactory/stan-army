"use client";

import { useState } from "react";
import { ArrowUpRight, Music2, Play, Square } from "lucide-react";
import { parseArmyMusic } from "@/lib/army-music";
import s from "./army-stream-player.module.css";

export function ArmyStreamPlayer({ source, edit }: { source: string | null; edit: () => void }) {
  const music = parseArmyMusic(source);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const loaded = !!music?.embed && loadedSource === music.url;
  return <section className={`${s.player} ${loaded ? s.loaded : ""}`} data-window-body="music" aria-label="Army stereo">
    {music ? <>
      {loaded && music.embed ? <>
        <iframe className={s.embed} title={`${music.label} Army player`} src={music.embed} width="100%" height={music.provider === "spotify" ? 152 : 175} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
        <div className={s.transport}><button aria-label="Stop music" onClick={() => setLoadedSource(null)}><Square size={12} />Stop</button><a href={music.url} target="_blank" rel="noreferrer">Open {music.label}<ArrowUpRight size={13} /></a></div>
        <p className="sr-only">Playback, queue and controls are supplied by {music.label}; availability and sign-in requirements depend on the service.</p>
      </> : <>
        <div className={s.summary}>
          <span className={s.record} data-music-record aria-hidden="true"><Music2 size={22} /></span>
          <div className={s.copy}><span>{music.label}</span><h3>{music.kind === "artist" ? "The artist’s music" : music.kind === "playlist" ? "The Army playlist" : music.kind === "album" ? "On repeat" : "On the Army stereo"}</h3><p>{music.provider === "apple" && music.kind === "artist" ? "Choose an album or playlist to listen here." : "A shared soundtrack. Your own listen."}</p></div>
          <div className={s.actions}>{music.embed && <button data-army-action onClick={() => setLoadedSource(music.url)} aria-label={`Load ${music.label} player`}><Play size={13} />Listen</button>}<a href={music.url} target="_blank" rel="noreferrer">Open {music.label}<ArrowUpRight size={14} /></a></div>
        </div>
        <p className={s.note}>{music.embed ? `Loads on click. Playback is provided by ${music.label}. ${music.provider === "apple" ? "Full tracks may require sign-in; previews may be limited." : "Availability and previews depend on Spotify."}` : "Artist profiles open in Apple Music. Add an album or playlist for an inline player."}</p>
      </>}
    </> : <div className={s.empty}><Music2 size={24} /><h3>Your Army’s soundtrack.</h3><button onClick={edit}>Add a music link<ArrowUpRight size={14} /></button></div>}
  </section>;
}
