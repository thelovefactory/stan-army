"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { ArrowLeft, Check, Eye, ImagePlus, Redo2, Undo2, X } from "lucide-react";
import { PANEL_IDS } from "@/lib/army-desktop";
import type { DesktopLook, OwnerDesktop, PanelId, WindowAppearance, WindowTypeface } from "@/lib/army-desktop";
import { applyDesktopPreset, changeStyle, createStyleHistory, DESKTOP_PRESETS, redoStyle, sameDesktopStyle, undoStyle } from "@/lib/army-style-editor";
import { parseArmyMusic } from "@/lib/army-music";
import { readImage } from "@/lib/image-upload";
import s from "./army-style-editor.module.css";

export type StyleScope = PanelId | "all";
export type StyleSection = "themes" | "room" | "panels";
const names = { feed: "The Army", chat: "Army Chat", music: "Army Stereo", board: "Discussions", stancam: "StanCam" };
const fonts: { id: WindowTypeface; label: string; family: string }[] = [
  { id: "sans", label: "Clean", family: "Arial,sans-serif" },
  { id: "mono", label: "Terminal", family: "'Courier New',monospace" },
  { id: "chunky", label: "Chunky", family: "DesktopChunky,Impact,sans-serif" },
  { id: "serif", label: "Editorial", family: "Georgia,serif" },
];
const surfaces = [ ["dark", "Dark", "#151718"], ["mint", "Mint", "#a7f3d0"], ["pink", "Pink", "#f3b4db"], ["blue", "Blue", "#b7c9fb"], ["yellow", "Acid yellow", "#efff70"], ["cream", "Cream", "#eae2d3"] ] as const;
const accents = [ ["mint", "Mint", "#a7f3d0"], ["pink", "Pink", "#f1a0d0"], ["blue", "Blue", "#a2b4f5"], ["yellow", "Yellow", "#e6e9a4"], ["neutral", "Neutral", "#bfc9c4"] ] as const;

export function ArmyStyleEditor({ initial, visible, scope, section, onScope, onSection, onPreview, onHide, onCancel, onSave }: {
  initial: OwnerDesktop; visible: boolean; scope: StyleScope; section: StyleSection;
  onScope: (scope: StyleScope) => void; onSection: (section: StyleSection) => void;
  onPreview: (owner: OwnerDesktop) => void; onHide: () => void; onCancel: () => void; onSave: (owner: OwnerDesktop) => void;
}) {
  const [history, setHistory] = useState(() => createStyleHistory(initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sequence = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const value = history.present;
  const selected = scope === "all" ? PANEL_IDS : [scope];
  const windows = selected.map((id) => value.windows[id]);
  const first = windows[0];
  const same = (key: keyof WindowAppearance) => windows.every((item) => item[key] === first[key]);
  const dirty = !sameDesktopStyle(initial, value);

  useEffect(() => { if (visible) heading.current?.focus(); }, [visible]);
  useEffect(() => () => { sequence.current += 1; }, []);
  function update(next: OwnerDesktop) {
    const updated = changeStyle(history, next); setHistory(updated); onPreview(updated.present); setError("");
  }
  function travel(direction: "undo" | "redo") {
    const updated = direction === "undo" ? undoStyle(history) : redoStyle(history);
    setHistory(updated); onPreview(updated.present); setError("");
  }
  function editPanels(change: Partial<WindowAppearance>) {
    const next = { ...value, windows: { ...value.windows } };
    for (const id of selected) next.windows[id] = { ...value.windows[id], ...change };
    update(next);
  }
  async function upload(file?: File) {
    if (!file) return;
    const request = ++sequence.current; setBusy(true); setError("");
    try {
      const image = await readImage(file);
      if (request === sequence.current) update({ ...value, look: "black", room: { ...value.room, image } });
    } catch (reason) {
      if (request === sequence.current) setError(reason instanceof Error ? reason.message : "Could not load this image.");
    } finally { if (request === sequence.current) setBusy(false); }
  }
  function shortcut(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") { event.stopPropagation(); onHide(); }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z" && !(event.target as HTMLElement).closest("input,textarea,select")) {
      event.preventDefault(); if (!busy) travel(event.shiftKey ? "redo" : "undo");
    }
  }
  function tabKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const tabs: StyleSection[] = ["themes", "room", "panels"];
    const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : -1;
    if (next < 0) return;
    event.preventDefault(); onSection(tabs[next]); document.getElementById(`style-tab-${tabs[next]}`)?.focus();
  }

  return <aside className={s.editor} hidden={!visible} role="dialog" aria-modal="false" aria-labelledby="army-style-heading" onKeyDown={shortcut} data-army-style-editor>
    <header className={s.header}>
      <div><span>MAKE YOURSELF AT HOME</span><h2 id="army-style-heading" ref={heading} tabIndex={-1}>Your Army. Your look.</h2></div>
      <button aria-label="Hide style editor" title="Preview page" onClick={onHide}><X size={18} /></button>
    </header>
    <div className={s.history}><span>{dirty ? "Unsaved changes" : "Saved look"}</span><button aria-label="Undo style change" title="Undo · Ctrl/Cmd Z" disabled={busy || !history.past.length} onClick={() => travel("undo")}><Undo2 size={16} /></button><button aria-label="Redo style change" title="Redo · Ctrl/Cmd Shift Z" disabled={busy || !history.future.length} onClick={() => travel("redo")}><Redo2 size={16} /></button><button className={s.preview} onClick={onHide}><Eye size={15} />Preview</button></div>
    <div role="tablist" aria-label="Customisation sections" className={s.tabs}>{(["themes", "room", "panels"] as const).map((tab, index) => <button key={tab} id={`style-tab-${tab}`} role="tab" aria-selected={section === tab} aria-controls={`style-section-${tab}`} tabIndex={section === tab ? 0 : -1} disabled={busy} onKeyDown={(event) => tabKeys(event, index)} onClick={() => onSection(tab)}>{tab === "themes" ? "Themes" : tab === "room" ? "Room" : "Panels"}</button>)}</div>
    <div className={s.scroll}>
      <fieldset disabled={busy} aria-busy={busy}>
      {section === "themes" && <section id="style-section-themes" role="tabpanel" aria-labelledby="style-tab-themes">
        <h3>A starting point.</h3><p className={s.hint}>Pick a look. Make it yours.</p>
        <div className={s.presets}>{DESKTOP_PRESETS.map((preset) => <button key={preset.id} className={s.preset} aria-pressed={sameDesktopStyle(value, applyDesktopPreset(value, preset.id))} onClick={() => update(applyDesktopPreset(value, preset.id))}>
          <div className={`${s.thumbnail} ${s[preset.id]}`} aria-hidden="true" style={{ "--sample-bg": preset.colour, "--sample-accent": preset.accent } as CSSProperties}><span /><div><i /><i /><i /></div><Check size={15} /></div><strong>{preset.name}</strong><small>{preset.description}</small>
        </button>)}</div>
        <button className={s.nextSection} onClick={() => onSection("room")}>Fine-tune your room <ArrowLeft size={14} /></button>
      </section>}
      {section === "room" && <section id="style-section-room" role="tabpanel" aria-labelledby="style-tab-room">
        <h3>Set the atmosphere.</h3>
        <label className={s.field}>Background<select aria-label="Army room style" value={value.look} onChange={(e) => update({ ...value, look: e.target.value as DesktopLook, room: { ...value.room, image: null } })}><option value="black">Solid colour</option><option value="electric">Electric leopard</option><option value="afterhours">After hours</option><option value="chrome">Chrome</option></select></label>
        <Colour label="Background colour" value={value.room.colour} onChange={(colour) => update({ ...value, look: "black", room: { ...value.room, colour } })} />
        <div className={s.upload}><label><ImagePlus size={17} />{value.room.image ? "Replace background image" : "Upload a background"}<input aria-label="Upload background image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = ""; }} /></label><small>JPG, PNG, WebP or GIF · up to 512 KB</small></div>
        {value.room.image && <div className={s.imageOptions}><p>{value.room.image.width} × {value.room.image.height} · {Math.ceil(value.room.image.bytes / 1024)} KB</p><label className={s.field}>Image fit<select aria-label="Background image fit" value={value.room.fit} onChange={(e) => update({ ...value, room: { ...value.room, fit: e.target.value as "cover" | "tile" } })}><option value="cover">Fill the room</option><option value="tile">Repeat / tile</option></select></label><label className={s.field}>Image focus<select aria-label="Background image focus" value={value.room.position} onChange={(e) => update({ ...value, room: { ...value.room, position: e.target.value as "center" | "top" | "bottom" } })}><option value="center">Centre</option><option value="top">Top</option><option value="bottom">Bottom</option></select></label><label className={s.field}>Dim image <span>{value.room.dim}%</span><input aria-label="Dim background image" type="range" min={0} max={85} value={value.room.dim} onChange={(e) => update({ ...value, room: { ...value.room, dim: Number(e.target.value) } })} /></label><button className={s.textButton} onClick={() => update({ ...value, room: { ...value.room, image: null } })}>Remove image</button></div>}
        <div className={s.divider} /><h3>Bring it together.</h3>
        <Colour label="Button colour" value={value.accent} onChange={(accent) => update({ ...value, accent })} />
        <Colour label="Header colour" value={value.header.colour} onChange={(colour) => update({ ...value, header: { ...value.header, colour } })} />
        <p className={s.label}>Header typeface</p><FontChoices value={value.header.typeface} onChange={(typeface) => update({ ...value, header: { ...value.header, typeface } })} />
        <label className={s.field}>Window corners<select aria-label="Window corners" value={value.corners} onChange={(e) => update({ ...value, corners: e.target.value as OwnerDesktop["corners"] })}><option value="soft">Soft</option><option value="square">Square</option><option value="round">Round</option></select></label>
        <label className={s.field}>Window frame<select aria-label="Window frame" value={value.frame} onChange={(e) => update({ ...value, frame: e.target.value as OwnerDesktop["frame"] })}><option value="minimal">Minimal</option><option value="classic">Retro bevel</option></select></label>
      </section>}
      {section === "panels" && <section id="style-section-panels" role="tabpanel" aria-labelledby="style-tab-panels">
        <label className={s.field}>Editing panel<select aria-label="Style window" value={scope} onChange={(e) => onScope(e.target.value as StyleScope)}>{PANEL_IDS.map((id) => <option key={id} value={id}>{names[id]}</option>)}<option value="all">All panels together</option></select></label>
        <h3>{scope === "all" ? "Together, or totally different." : names[scope]}</h3>
        {scope === "music" && <MusicSourceEditor key={value.music ?? "empty"} source={value.music} apply={(music) => update({...value,music})} />}

        <p className={s.label}>Panel colour{!same("surface") && <small>Mixed</small>}</p><div className={s.swatches}>{surfaces.map(([surface, label, colour]) => <button key={surface} aria-label={`${label} panel colour`} aria-pressed={same("surface") && first.surface === surface} title={label} style={{ "--swatch": colour } as CSSProperties} onClick={() => editPanels({ surface })}><Check size={15} /></button>)}</div>
        <Colour label="Custom panel colour" value={first.customSurface} onChange={(customSurface) => editPanels({ surface: "custom", customSurface })} />
        <p className={s.label}>Title-bar accent{!same("colour") && <small>Mixed</small>}</p><div className={s.swatches}>{accents.map(([colour, label, hex]) => <button key={colour} aria-label={`${label} title accent`} aria-pressed={same("colour") && first.colour === colour} title={label} style={{ "--swatch": hex } as CSSProperties} onClick={() => editPanels({ colour })}><Check size={15} /></button>)}</div>
        <Colour label="Custom title accent" value={first.customAccent} onChange={(customAccent) => editPanels({ colour: "custom", customAccent })} />
        <p className={s.label}>Typeface{!same("typeface") && <small>Mixed</small>}</p><FontChoices value={same("typeface") ? first.typeface : undefined} onChange={(typeface) => editPanels({ typeface })} />
        <label className={s.field}>Title-bar skin<select aria-label="Window skin" value={same("skin") ? first.skin : "mixed"} onChange={(e) => editPanels({ skin: e.target.value as WindowAppearance["skin"] })}>{!same("skin") && <option value="mixed" disabled>Mixed</option>}<option value="solid">Solid</option><option value="leopard">Leopard</option><option value="grid">Grid</option></select></label>
      </section>}
      </fieldset>
      {busy && <p role="status" className={s.message}>Preparing your image…</p>}
      {error && <p role="alert" className={s.error}>{error}</p>}
    </div>
    <footer className={s.footer}><span>Live preview · saved on this device</span><div><button onClick={onCancel}>Cancel</button><button className={s.save} disabled={busy} onClick={() => onSave(value)}>Save style<Check size={15} /></button></div></footer>
  </aside>;
}
function Colour({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className={s.colour}><span>{label}</span><span><code>{value.toUpperCase()}</code><input type="color" aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} /></span></label>;
}
function FontChoices({ value, onChange }: { value?: WindowTypeface; onChange: (value: WindowTypeface) => void }) {
  return <div className={s.fonts}>{fonts.map((font) => <button key={font.id} aria-pressed={value === font.id} style={{ fontFamily: font.family }} onClick={() => onChange(font.id)}>{font.label}<span>Aa</span></button>)}</div>;
}

function MusicSourceEditor({source,apply}:{source:string|null;apply:(music:string|null)=>void}) {
  const [draft,setDraft] = useState(source ?? ""), [error,setError] = useState("");
  return <div className={s.musicSource}><label className={s.field}>Playlist or artist link<input aria-label="Music source link" type="url" value={draft} placeholder="Spotify or Apple Music link" maxLength={1500} onChange={(event)=>{setDraft(event.target.value);setError("");}} /></label><div><button className={s.textButton} onClick={()=>{const music=parseArmyMusic(draft);if(!music){setError("Use a public Spotify or Apple Music artist, playlist, album or track link.");return;}apply(music.url);setDraft(music.url);setError("");}}>Use music link</button><button className={s.textButton} onClick={()=>{apply(null);setDraft("");setError("");}}>Remove music</button></div><p className={s.hint}>Playback and the queue stay with the music service.</p>{error && <p role="alert" className={s.error}>{error}</p>}<div className={s.divider} /></div>;
}
