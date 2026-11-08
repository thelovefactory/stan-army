"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, GripVertical, Maximize2, MessageCircle, MessageSquare, Minus, Music2, Newspaper, Palette, Plus, RotateCcw, Scan } from "lucide-react";
import { useDemo } from "./demo-provider";
import { fanNotes } from "@/lib/fan-space";
import { DesktopChat, DesktopComposer, DesktopDiscussions, DesktopMusic, DesktopPost } from "./nova-layout-study";
import { StanStarIcon } from "./stan-icons";
import {
  DESKTOP_COLUMNS, DESKTOP_GAP, DESKTOP_ROW, OWNER_DESKTOP_KEY, PANEL_IDS, PERSONAL_DESKTOP_KEY,
  chatFirstDesktop, movePanel, packDesktop, parseDesktop, parseOwnerDesktop, resizePanel,
} from "@/lib/army-desktop";
import type { DesktopLayout, DesktopLook, OwnerDesktop, PanelId, Participation } from "@/lib/army-desktop";
import s from "./army-desktop-playground.module.css";

const names: Record<PanelId, string> = { feed: "The Army", chat: "Army Chat", board: "Discussions", music: "Army Stereo" };
const icons = { feed: Newspaper, chat: MessageCircle, board: MessageSquare, music: Music2 };
const eventName = "stan-army:desktop-updated";
const serverSnapshot = () => null;
function read(key: string) { try { return window.localStorage.getItem(key); } catch { return null; } }
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener(eventName, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(eventName, callback); };
}
function subscribeDesktop(callback: () => void) {
  const query = window.matchMedia("(min-width: 1000px)"); query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const desktopSnapshot = () => window.matchMedia("(min-width: 1000px)").matches;

type Gesture = {
  id: PanelId; kind: "move" | "resize" | "resize-left"; pointerId: number;
  startX: number; startY: number; stepX: number; base: DesktopLayout;
  handle: HTMLButtonElement;
};

export function ArmyDesktopPlayground() {
  const demo = useDemo();
  const joined = demo.enlisted.includes("army-nova");
  const ownerRaw = useSyncExternalStore(subscribe, () => read(OWNER_DESKTOP_KEY), serverSnapshot);
  const personalRaw = useSyncExternalStore(subscribe, () => read(PERSONAL_DESKTOP_KEY), serverSnapshot);
  const savedOwner = useMemo(() => parseOwnerDesktop(ownerRaw), [ownerRaw]);
  const [unsavedOwner, setUnsavedOwner] = useState<OwnerDesktop | null>(null);
  const owner = unsavedOwner ?? savedOwner;
  const savedLayout = useMemo(() => parseDesktop(personalRaw, owner.layout), [personalRaw, owner.layout]);
  const [unsavedLayout, setUnsavedLayout] = useState<DesktopLayout | null>(null);
  const layout = unsavedLayout ?? savedLayout;
  const desktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, () => false);
  const [role, setRole] = useState("visitor");
  const [active, setActive] = useState<PanelId>("chat");
  const [focused, setFocused] = useState<PanelId | null>(null);
  const [notice, setNotice] = useState("Your arrangement saves on this device. Everyone else keeps theirs.");
  const [preview, setPreview] = useState<{ id: PanelId; kind: "move" | "resize" | "resize-left"; layout: DesktopLayout } | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const draft = useRef<DesktopLayout | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const dockRefs = useRef<Partial<Record<PanelId, HTMLButtonElement | null>>>({});
  const frames = useRef<Partial<Record<PanelId, HTMLElement | null>>>({});
  const placements = packDesktop(layout);
  const ghost = preview ? packDesktop(preview.layout).find((item) => item.id === preview.id) : undefined;
  const ordered = desktop ? [...PANEL_IDS].sort((a, b) => {
    const one = placements.find((item) => item.id === a), two = placements.find((item) => item.id === b);
    return (one?.y ?? 99) - (two?.y ?? 99) || (one?.x ?? 99) - (two?.x ?? 99);
  }) : layout.order;
  const join = () => { if (!joined) demo.toggle("army-nova"); };

  function save(next: DesktopLayout, message: string) {
    try {
      localStorage.setItem(PERSONAL_DESKTOP_KEY, JSON.stringify(next)); setUnsavedLayout(null);
      window.dispatchEvent(new Event(eventName)); setNotice(message);
    } catch {
      setUnsavedLayout(next); setNotice("Layout changed for this visit, but browser storage is unavailable. It won’t survive refresh.");
    }
  }
  function saveOwner(next: OwnerDesktop, message: string) {
    if (role !== "host") return;
    try {
      localStorage.setItem(OWNER_DESKTOP_KEY, JSON.stringify(next)); setUnsavedOwner(null);
      window.dispatchEvent(new Event(eventName)); setNotice(message);
    } catch { setUnsavedOwner(next); setNotice("Host changes are visible for this visit but could not be saved."); }
  }
  function reset() {
    finish(false);
    setFocused(null); setActive("feed");
    try {
      localStorage.removeItem(PERSONAL_DESKTOP_KEY); setUnsavedLayout(null);
      window.dispatchEvent(new Event(eventName)); setNotice("Back to the Army’s starting layout. Your drafts are still here.");
    } catch { setUnsavedLayout(structuredClone(owner.layout)); setNotice("Starting layout restored for this visit; browser storage could not be updated."); }
  }
  function minimize(id: PanelId) {
    const hidden = layout.minimized.includes(id);
    if (focused === id) setFocused(null);
    save({ ...layout, minimized: hidden ? layout.minimized.filter((item) => item !== id) : [...layout.minimized, id] }, `${names[id]} ${hidden ? "restored" : "minimized to the dock"}. Drafts stay in the window.`);
    if (!hidden) requestAnimationFrame(() => dockRefs.current[id]?.focus());
  }
  function resize(id: PanelId, width: number, height = layout.sizes[id].height) {
    const next = resizePanel(layout, id, { width, height });
    save(next, `${names[id]}: ${next.sizes[id].width} columns wide, ${next.sizes[id].height} rows high. Neighbours made room.`);
  }
  function move(id: PanelId, index: number) {
    save(movePanel(layout, id, index), `${names[id]} moved. The grid made room.`);
  }
  function finish(commit: boolean) {
    const current = gesture.current;
    const next = draft.current;
    gesture.current = null; draft.current = null; setPreview(null);
    if (current?.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    if (commit && current && next) save(next, `${names[current.id]} ${current.kind === "move" ? "moved" : "resized"}. Your arrangement is saved on this device.`);
  }
  useEffect(() => {
    const cancel = () => {
      const current = gesture.current;
      if (!current) return;
      gesture.current = null; draft.current = null; setPreview(null);
      if (current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    };
    window.addEventListener("resize", cancel);
    return () => window.removeEventListener("resize", cancel);
  }, []);

  function start(event: PointerEvent<HTMLButtonElement>, id: PanelId, kind: Gesture["kind"]) {
    if (!desktop || focused || event.button !== 0 || !grid.current) return;
    event.preventDefault();
    setActive(id);
    gesture.current = { id, kind, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY + window.scrollY,
      stepX: (grid.current.getBoundingClientRect().width + DESKTOP_GAP) / DESKTOP_COLUMNS,
      base: layout, handle: event.currentTarget };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function track(event: PointerEvent<HTMLButtonElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX, dy = event.clientY + window.scrollY - current.startY;
    if (Math.abs(dx) + Math.abs(dy) < 6) return;
    let next: DesktopLayout;
    if (current.kind !== "move") {
      const size = current.base.sizes[current.id];
      next = resizePanel(current.base, current.id, { width: size.width + Math.round(dx / current.stepX) * (current.kind === "resize-left" ? -1 : 1), height: size.height + Math.round(dy / (DESKTOP_ROW + DESKTOP_GAP)) });
    } else {
      const others = current.base.order.filter((id) => id !== current.id && !current.base.minimized.includes(id));
      let target: PanelId | undefined;
      let distance = Infinity;
      for (const id of others) {
        const frame = frames.current[id]; if (!frame) continue;
        const rect = frame.getBoundingClientRect();
        const cx = Math.max(rect.left, Math.min(rect.right, event.clientX));
        const cy = Math.max(rect.top, Math.min(rect.bottom, event.clientY));
        const score = (cx - event.clientX) ** 2 + (cy - event.clientY) ** 2;
        if (score < distance) { target = id; distance = score; }
      }
      const order = current.base.order.filter((id) => id !== current.id);
      const rect = target ? frames.current[target]?.getBoundingClientRect() : null;
      const after = rect ? event.clientY > rect.top + rect.height / 2 || event.clientX > rect.left + rect.width * .6 : true;
      const index = target ? order.indexOf(target) + Number(after) : order.length;
      next = movePanel(current.base, current.id, index);
    }
    draft.current = next; setPreview({ id: current.id, kind: current.kind, layout: next });
    if (event.clientY > window.innerHeight - 45) window.scrollBy({ top: 16, behavior: "instant" });
    else if (event.clientY < 65) window.scrollBy({ top: -16, behavior: "instant" });
  }
  function keys(event: KeyboardEvent<HTMLButtonElement>, id: PanelId, resizing = false) {
    if (event.key === "Escape") { finish(false); return; }
    const directions: Record<string, number> = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 };
    const direction = directions[event.key]; if (!direction) return;
    event.preventDefault(); setActive(id);
    if (resizing || event.shiftKey) {
      if (!desktop || focused) { setNotice("Window sizes fit this view. Restore the desktop on a larger screen to resize."); return; }
      const size = layout.sizes[id];
      resize(id, size.width + (/Left|Right/.test(event.key) ? direction : 0), size.height + (/Up|Down/.test(event.key) ? direction : 0));
    } else move(id, layout.order.indexOf(id) + direction);
  }

  return <main id="main" className={`${s.desktop} ${s[owner.look]}`} data-desktop-playground
    style={{ "--participation": { mint: "#b8f5d9", pink: "#f7c5e4", yellow: "#f2efa8" }[owner.participation] } as CSSProperties}
    onKeyDown={(event) => { if (event.key === "Escape") { if (gesture.current) finish(false); else if (focused) setFocused(null); } }}>
    <div className={s.wrap}>
      <div className={s.breadcrumb}><Link href="/armies/nova"><ArrowLeft size={14} />Original Army</Link><span>DESKTOP PLAYGROUND · LOCAL DEMO</span></div>
      <header className={s.identity}>
        <Image src="/images/artist.jpg" alt="Nova Reign" width={66} height={66} priority />
        <div><span className={s.eyebrow}>s/nova · FAN-RUN · ALTERNATIVE R&B</span><h1>Nova Reign’s Army <StanStarIcon size={30} /></h1><p>The music brought you here. Make yourself at home.</p><small>Hosted by <Link href="/fans/jess-wav">@jess.wav</Link> · 2,408 demo stans</small></div>
        <button className={s.join} aria-pressed={joined} onClick={() => demo.toggle("army-nova")}>{joined ? <Check size={17} /> : <Plus size={17} />}{joined ? "Joined" : "Join this Army"}</button>
      </header>
      <div className={s.tools}>
        <div><strong>Same Army. Your arrangement.</strong><p className={s.desktopHint}>Drag a title bar. Pull a corner. Make room.</p><p className={s.mobileHint}>Your windows stack here. Reorder them from their menus.</p></div>
        <button onClick={() => { setFocused(null); save(chatFirstDesktop(), "Chat has the big space. Discussions take the smaller window. This is just your view."); }}><MessageCircle size={16} />Chat first</button>
        <button onClick={reset}><RotateCcw size={16} />Reset to Army layout</button>
        <label className={s.role}><span>Demo role</span><select aria-label="Demo role" value={role} onChange={(event) => setRole(event.target.value)}><option value="visitor">Community member</option><option value="host">Community host</option></select></label>
        {role === "host" && <details className={s.ownerSettings}><summary><Palette size={16} />Army style</summary><div>
          <strong>You set the atmosphere.</strong><p>Members arrange their own windows. This host demo saves only on this device; it isn’t authentication.</p>
          <label>Room style<select aria-label="Army room style" value={owner.look} onChange={(event) => saveOwner({ ...owner, look: event.target.value as DesktopLook }, "Host appearance saved on this device. Your personal arrangement stayed put.")}><option value="electric">Electric leopard</option><option value="afterhours">After hours</option><option value="chrome">Chrome room</option></select></label>
          <label>Participation colour<select aria-label="Army participation colour" value={owner.participation} onChange={(event) => saveOwner({ ...owner, participation: event.target.value as Participation }, "Composer and chat updated together.")}><option value="mint">Mint</option><option value="pink">Pink</option><option value="yellow">Yellow</option></select></label>
          <button onClick={() => saveOwner({ ...owner, layout: structuredClone(layout) }, "Starting layout saved for this local host demo. Members can still make their own arrangement.")}>Use this as the starting layout <Check size={16} /></button>
        </div></details>}
      </div>
      <p className={s.status} role="status" aria-live="polite">{notice}</p>
      <p id="desktop-key-help" className="sr-only">Drag the title to reorder. Arrow keys on a title move its window earlier or later. Shift plus arrows resizes it. Arrow keys on the corner resize. Escape cancels dragging. Sizing also has a menu. Mobile uses stacked windows.</p>
      {focused && <button className={s.focusReturn} onClick={() => setFocused(null)}><ArrowLeft size={16} />Back to all windows</button>}

      <div ref={grid} className={`${s.grid} ${preview ? s.gridActive : ""}`} data-window-grid>
        {ordered.map((id) => {
          const placement = placements.find((item) => item.id === id);
          const hidden = !placement || (focused !== null && focused !== id);
          const Icon = icons[id];
          const size = layout.sizes[id];
          const visiblePlacement = focused === id ? { x: 0, y: 0, width: 12, height: 8 } : placement;
          return <section key={id} ref={(element) => { frames.current[id] = element; }} hidden={hidden}
            className={`${s.window} ${s[id]} ${active === id ? s.active : ""} ${preview?.id === id ? s.moving : ""}`}
            data-panel-id={id} data-expanded={focused === id ? "true" : undefined} aria-labelledby={`window-title-${id}`}
            style={{ gridColumn: visiblePlacement ? `${visiblePlacement.x + 1} / span ${visiblePlacement.width}` : undefined,
              gridRow: visiblePlacement ? `${visiblePlacement.y + 1} / span ${visiblePlacement.height}` : undefined,
              "--window-height": `${size.height * DESKTOP_ROW + (size.height - 1) * DESKTOP_GAP}px` } as CSSProperties}
            onFocusCapture={() => setActive(id)} onPointerDownCapture={() => setActive(id)}>
            <header className={s.titlebar}>
              <h2 id={`window-title-${id}`} className="sr-only">{names[id]}</h2>
              <button className={s.dragHandle} aria-label={`Move ${names[id]}`} aria-describedby="desktop-key-help"
                onPointerDown={(event) => start(event, id, "move")} onPointerMove={track}
                onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => { if (gesture.current) finish(false); }}
                onKeyDown={(event) => keys(event, id)} title="Drag to move · arrow keys to reorder">
                <GripVertical className={s.grip} size={15} /><Icon size={17} /><span className={s.windowTitle}>{names[id]}</span>
              </button>
              <details className={s.windowMenu} onKeyDown={(event) => {
                if (event.key === "Escape") { event.stopPropagation(); event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); }
              }}>
                <summary aria-label={`Size and position ${names[id]}`} title="Size & position"><Scan size={16} /></summary>
                <div>
                  <label>Window width<select aria-label={`${names[id]} width`} disabled={!desktop || !!focused} value={size.width} onChange={(event) => resize(id, Number(event.target.value))}>{Array.from({ length: 9 }, (_, index) => index + 4).map((width) => <option value={width} key={width}>{width}/12{width === 4 ? " · narrow" : width === 8 ? " · wide" : width === 12 ? " · full" : ""}</option>)}</select></label>
                  <label>Window height<select aria-label={`${names[id]} height`} disabled={!desktop || !!focused} value={size.height} onChange={(event) => resize(id, size.width, Number(event.target.value))}>{Array.from({ length: 7 }, (_, index) => index + 2).map((height) => <option value={height} key={height}>{height} rows</option>)}</select></label>
                  <button disabled={layout.order.indexOf(id) === 0} onClick={() => move(id, layout.order.indexOf(id) - 1)}><ArrowLeft size={15} />Move earlier</button>
                  <button disabled={layout.order.indexOf(id) === layout.order.length - 1} onClick={() => move(id, layout.order.indexOf(id) + 1)}><ArrowDown size={15} />Move later</button>
                  <p>{desktop ? "The grid makes room for you." : "Widths fit your screen on mobile."}</p>
                </div>
              </details>
              <button className={s.windowControl} aria-label={`${focused === id ? "Restore" : "Expand"} ${names[id]}`} onClick={() => { setFocused(focused === id ? null : id); setActive(id); }}><Maximize2 size={15} /></button>
              <button className={s.windowControl} aria-label={`Minimize ${names[id]}`} onClick={() => minimize(id)}><Minus size={16} /></button>
            </header>
            <div className={s.windowBody} data-window-content={id}>
              {id === "feed" && <div className={s.feedContents}><DesktopComposer joined={joined} join={join} />{[...(demo.notes["army-nova"] ?? []), fanNotes[1], fanNotes[0], fanNotes[2], fanNotes[3]].map((note) => <DesktopPost key={note.id} note={note} />)}<Link className={s.archive} href="/armies/nova/posts">View all posts <ArrowUpRight size={16} /></Link></div>}
              {id === "chat" && <DesktopChat joined={joined} join={join} windowed />}
              {id === "music" && <DesktopMusic />}
              {id === "board" && <DesktopDiscussions windowed />}
            </div>
            {!focused && <button className={`${s.resizeHandle} ${s.resizeLeft}`} aria-label={`Resize ${names[id]} from left`} aria-describedby="desktop-key-help" title="Drag left to make this window wider"
              onPointerDown={(event) => start(event, id, "resize-left")} onPointerMove={track}
              onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => { if (gesture.current) finish(false); }}
              onKeyDown={(event) => keys(event, id, true)}><span aria-hidden="true">◢</span></button>}
            {!focused && <button className={s.resizeHandle} aria-label={`Resize ${names[id]}`} aria-describedby="desktop-key-help" title="Drag to resize · arrow keys to resize"
              onPointerDown={(event) => start(event, id, "resize")} onPointerMove={track}
              onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => { if (gesture.current) finish(false); }}
              onKeyDown={(event) => keys(event, id, true)}><span aria-hidden="true">◢</span></button>}
          </section>;
        })}
        {ghost && <div className={s.ghost} data-drop-preview aria-hidden="true" style={{ gridColumn: `${ghost.x + 1} / span ${ghost.width}`, gridRow: `${ghost.y + 1} / span ${ghost.height}` }}><span>{names[ghost.id]} · snap here</span></div>}
        {layout.minimized.length === PANEL_IDS.length && <div className={s.empty}><StanStarIcon size={40} /><h2>Everyone’s in the dock.</h2><p>Pick a window below to bring it back.</p></div>}
      </div>
      <nav className={s.dock} aria-label="Army window dock"><span className={s.dockBrand}><StanStarIcon size={22} /><b>YOUR ARMY DESKTOP</b></span>{PANEL_IDS.map((id) => { const Icon = icons[id]; const open = !layout.minimized.includes(id) && (!focused || focused === id);
        return <button key={id} ref={(element) => { dockRefs.current[id] = element; }} aria-label={`Show ${names[id]}`} aria-pressed={open} onClick={() => {
          if (layout.minimized.includes(id)) { minimize(id); setFocused(null); setActive(id); }
          else if (active === id && !focused) minimize(id);
          else { setFocused(null); setActive(id); requestAnimationFrame(() => frames.current[id]?.scrollIntoView({ block: "nearest", behavior: "instant" })); }
        }}><Icon size={17} /><span>{names[id]}</span><i aria-hidden="true" /></button>;
      })}<Link href="/create" className={s.dockCreate}>Start your own Army <ArrowUpRight size={16} /></Link></nav>
      <p className={s.footnote}>A local layout experiment. Messages and posts reset on refresh; your window arrangement stays on this device. Original Nova and its saved themes are unchanged.</p>
    </div>
  </main>;
}
