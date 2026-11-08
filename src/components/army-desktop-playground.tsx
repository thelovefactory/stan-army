"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, Check, ChevronDown, GripVertical, Maximize2, MessageCircle, MessageSquare, Minus, Music2, Newspaper, Palette, Plus, RotateCcw, Scan } from "lucide-react";
import { useDemo } from "./demo-provider";
import { fanNotes } from "@/lib/fan-space";
import { DesktopChat, DesktopComposer, DesktopDiscussions, DesktopMusic, DesktopPost } from "./nova-layout-study";
import { StanStarIcon } from "./stan-icons";
import {
  DESKTOP_COLUMNS, DESKTOP_GAP, DESKTOP_ROW, OWNER_DESKTOP_KEY, PANEL_IDS, PERSONAL_DESKTOP_KEY,
  movePanel, packDesktop, parseDesktop, parseOwnerDesktop, placePanel, resizePanel, setPanelMinimized, swapPanelSlots,
} from "@/lib/army-desktop";
import type { DesktopLayout, OwnerDesktop, PanelId } from "@/lib/army-desktop";
import { ArmyStyleEditor } from "./army-style-editor";
import type { StyleScope, StyleSection } from "./army-style-editor";
import { readableDesktopColour as readableColor } from "@/lib/army-style-editor";
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
  slots: Record<PanelId, { x: number; y: number; width: number; height: number }>;
  gridX: number; gridY: number; gridWidth: number; offsetX: number; offsetY: number;
  maxY: number;
};

export function ArmyDesktopPlayground() {
  const demo = useDemo();
  const joined = demo.enlisted.includes("army-nova");
  const ownerRaw = useSyncExternalStore(subscribe, () => read(OWNER_DESKTOP_KEY), serverSnapshot);
  const personalRaw = useSyncExternalStore(subscribe, () => read(PERSONAL_DESKTOP_KEY), serverSnapshot);
  const savedOwner = useMemo(() => parseOwnerDesktop(ownerRaw), [ownerRaw]);
  const [unsavedOwner, setUnsavedOwner] = useState<OwnerDesktop | null>(null);
  const committedOwner = unsavedOwner ?? savedOwner;
  const [draftOwner, setDraftOwner] = useState<OwnerDesktop | null>(null);
  const owner = draftOwner ?? committedOwner;
  const [editorVisible, setEditorVisible] = useState(false);
  const [styleScope, setStyleScope] = useState<StyleScope>("all");
  const [styleSection, setStyleSection] = useState<StyleSection>("themes");
  const styleTrigger = useRef<HTMLButtonElement>(null);
  const savedLayout = useMemo(() => parseDesktop(personalRaw, owner.layout), [personalRaw, owner.layout]);
  const [unsavedLayout, setUnsavedLayout] = useState<DesktopLayout | null>(null);
  const layout = unsavedLayout ?? savedLayout;
  const desktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, () => false);
  const [modern, setModern] = useState(true);
  const [warning, setWarning] = useState(false);
  const [active, setActive] = useState<PanelId>("chat");
  const [focused, setFocused] = useState<PanelId | null>(null);
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<{ id: PanelId; kind: "move" | "resize" | "resize-left"; layout: DesktopLayout } | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const draft = useRef<DesktopLayout | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const dockRefs = useRef<Partial<Record<PanelId, HTMLButtonElement | null>>>({});
  const frames = useRef<Partial<Record<PanelId, HTMLElement | null>>>({});
  const displayLayout = preview?.layout ?? (focused ? resizePanel(layout, focused, { width: 12, height: Math.max(6, layout.sizes[focused].height) }) : layout);
  const placements = packDesktop(displayLayout);
  const ghost = preview ? placements.find((item) => item.id === preview.id) : undefined;
  // Keep DOM nodes stable throughout gestures: moving DOM nodes can lose pointer capture.
  const ordered = layout.order;
  const join = () => { if (!joined) demo.toggle("army-nova"); };

  function save(next: DesktopLayout, message: string) {
    try {
      localStorage.setItem(PERSONAL_DESKTOP_KEY, JSON.stringify(next)); setUnsavedLayout(null); setWarning(false);
      window.dispatchEvent(new Event(eventName)); setNotice(message);
    } catch {
      setUnsavedLayout(next); setWarning(true); setNotice("Layout changed for this visit, but browser storage is unavailable. It won’t survive refresh.");
    }
  }
  function saveOwner(next: OwnerDesktop, message: string) {
    try {
      localStorage.setItem(OWNER_DESKTOP_KEY, JSON.stringify(next)); setUnsavedOwner(null); setWarning(false);
      window.dispatchEvent(new Event(eventName)); setNotice(message);
    } catch { setUnsavedOwner(next); setWarning(true); setNotice("Host changes are visible for this visit but could not be saved."); }
  }
  function openStyle(id?: PanelId) {
    finish(false); setFocused(null);
    if (!draftOwner) setDraftOwner(structuredClone(committedOwner));
    if (id) { setStyleScope(id); setStyleSection("panels"); }
    setEditorVisible(true);
  }
  function hideStyle() {
    setEditorVisible(false);
    requestAnimationFrame(() => styleTrigger.current?.focus());
  }
  function cancelStyle() { setDraftOwner(null); hideStyle(); }
  function commitStyle(next: OwnerDesktop) {
    saveOwner(next, "Army style saved on this device."); setDraftOwner(null); hideStyle();
  }
  function reset() {
    finish(false);
    setFocused(null); setActive("feed");
    try {
      localStorage.removeItem(PERSONAL_DESKTOP_KEY); setUnsavedLayout(null); setWarning(false);
      window.dispatchEvent(new Event(eventName)); setNotice("Back to the Army’s starting layout. Your drafts are still here.");
    } catch { setUnsavedLayout(structuredClone(owner.layout)); setWarning(true); setNotice("Starting layout restored for this visit; browser storage could not be updated."); }
  }
  function minimize(id: PanelId) {
    const hidden = layout.minimized.includes(id);
    if (focused === id) setFocused(null);
    save(setPanelMinimized(layout, id, !hidden), `${names[id]} ${hidden ? "restored" : "minimized to the dock"}. Drafts stay in the window.`);
    if (!hidden) requestAnimationFrame(() => dockRefs.current[id]?.focus());
  }
  function resize(id: PanelId, width: number, height = layout.sizes[id].height) {
    const next = resizePanel(layout, id, { width, height });
    save(next, `${names[id]}: ${next.sizes[id].width} columns wide, ${next.sizes[id].height} rows high. Neighbours made room.`);
  }
  function move(id: PanelId, index: number) {
    const target = layout.order[index];
    save(desktop && target && target !== id && !layout.minimized.includes(target) ? swapPanelSlots(layout, id, target) : movePanel(layout, id, index), `${names[id]} moved.`);
  }
  function finish(commit: boolean) {
    const current = gesture.current;
    const next = draft.current;
    gesture.current = null; draft.current = null; setPreview(null);
    if (current?.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    if (commit && current && next) save(next, `${names[current.id]} ${current.kind === "move" ? "moved" : "resized"}. Your arrangement is saved on this device.`);
  }
  useEffect(() => {
    const dismiss = (event: globalThis.PointerEvent) => {
      for (const menu of document.querySelectorAll<HTMLDetailsElement>("[data-desktop-playground] details[open]")) {
        if (!menu.contains(event.target as Node)) menu.open = false;
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

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
    for (const menu of grid.current.querySelectorAll("details[open]")) menu.removeAttribute("open");
    const bounds = grid.current.getBoundingClientRect();
    const slots = {} as Gesture["slots"];
    for (const item of packDesktop(layout)) {
      const rect = frames.current[item.id]!.getBoundingClientRect();
      slots[item.id] = { x: rect.x, y: rect.y + window.scrollY, width: rect.width, height: rect.height };
    }
    const origin = slots[id];
    setActive(id);
    gesture.current = { id, kind, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY + window.scrollY,
      stepX: (grid.current.getBoundingClientRect().width + DESKTOP_GAP) / DESKTOP_COLUMNS,
      base: layout, handle: event.currentTarget, slots,
      gridX: bounds.x, gridY: bounds.y + window.scrollY, gridWidth: bounds.width,
      offsetX: event.clientX - origin.x, offsetY: event.clientY + window.scrollY - origin.y,
      maxY: Math.min(48, Math.max(...packDesktop(layout).map((item) => item.y + item.height)) + 1) };
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
      next = resizePanel(current.base, current.id, { width: size.width + Math.round(dx / current.stepX) * (current.kind === "resize-left" ? -1 : 1), height: size.height + Math.round(dy / (DESKTOP_ROW + DESKTOP_GAP)) }, current.kind === "resize-left");
    } else {
      const x = event.clientX, y = event.clientY + window.scrollY;
      if (x < current.gridX || x > current.gridX + current.gridWidth || y < current.gridY) {
        draft.current = null; setPreview(null); return;
      }
      const hit = current.base.order.find((id) => {
        const rect = current.slots[id];
        return rect && x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
      });
      if (hit === current.id) { draft.current = null; setPreview(null); return; }
      if (hit) next = swapPanelSlots(current.base, current.id, hit);
      else next = placePanel(current.base, current.id, {
        x: Math.round((x - current.gridX - current.offsetX) / current.stepX),
        y: Math.min(current.maxY, Math.max(0, Math.round((y - current.gridY - current.offsetY) / (DESKTOP_ROW + DESKTOP_GAP)))),
      });
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

  return <main id="main" className={`${s.desktop} ${s[owner.look]}`} data-desktop-playground data-interface={modern ? "modern" : "original"} data-animated-background={owner.room.image?.animated ? "true" : undefined} data-room-style={owner.look} data-editor-open={editorVisible ? "true" : undefined} data-window-corners={owner.corners} data-window-frame={owner.frame} data-header-typeface={owner.header.typeface}
    style={{ "--participation": { mint: "#e1f5eb", pink: "#fce8f3", yellow: "#fff6d5" }[owner.participation],
      "--page-colour": owner.room.colour, "--header-colour": owner.header.colour, "--header-ink": readableColor("#f3f5f3", owner.header.colour),
      "--header-font": { sans: "Arial,Helvetica,sans-serif", mono: "'Courier New',monospace", chunky: "DesktopChunky,Impact,sans-serif", serif: "Georgia,serif" }[owner.header.typeface],
      "--violet": owner.accent, "--button-colour": owner.accent, "--button-ink": owner.accent === "#ff009d" ? "#ffffff" : readableColor("#ffffff", owner.accent),
      backgroundImage: owner.room.image ? `linear-gradient(#000000${Math.round(owner.room.dim * 2.55).toString(16).padStart(2, "0")},#000000${Math.round(owner.room.dim * 2.55).toString(16).padStart(2, "0")}),url("${owner.room.image.dataUrl}")` : undefined,
      backgroundSize: owner.room.image ? owner.room.fit === "tile" ? "auto, 320px auto" : "cover" : undefined,
      backgroundRepeat: owner.room.image ? owner.room.fit === "tile" ? "repeat" : "no-repeat" : undefined,
      backgroundPosition: owner.room.image ? `center ${owner.room.position}` : undefined,
    } as CSSProperties}
    onKeyDown={(event) => { if (event.key === "Escape") { if (gesture.current) finish(false); else if (editorVisible) hideStyle(); else {
      const openMenu = event.currentTarget.querySelector<HTMLDetailsElement>("details[open]");
      if (openMenu) { openMenu.open = false; openMenu.querySelector("summary")?.focus(); }
      else if (focused) setFocused(null);
    } } }}>
    <div className={s.wrap}>
      <header className={s.armyHeader} aria-labelledby="playground-army-name">
      <div className={s.breadcrumb}><Link href="/armies/nova"><ArrowLeft size={14} />Original Army</Link><div className={s.headerControls}>
        <label className={s.viewSelect}><span className="sr-only">Interface style</span><select aria-label="Interface style" value={modern ? "modern" : "original"} onChange={(event) => setModern(event.target.value === "modern")}><option value="modern">Modern view</option><option value="original">Original view</option></select><ChevronDown size={12} aria-hidden="true" /></label>
        <button ref={styleTrigger} className={s.styleTrigger} aria-expanded={editorVisible} onClick={() => editorVisible ? hideStyle() : openStyle()}><Palette size={14} />{draftOwner ? "Editing style" : "Army style"}<ChevronDown size={12} aria-hidden="true" /></button>
        <details className={`${s.ownerSettings} ${s.layoutSettings}`}><summary>Layout<ChevronDown size={12} aria-hidden="true" /></summary><div>
          <button disabled={!!draftOwner} onClick={() => saveOwner({ ...owner, layout: structuredClone(layout) }, "Starting layout saved for this local host demo. Members can still make their own arrangement.")}>Use this as the starting layout <Check size={16} /></button>
          <button className={s.resetStyle} disabled={!!draftOwner} onClick={reset}><RotateCcw size={16} />Reset layout</button>
        </div></details>
        </div><span>LOCAL DEMO</span></div>
      <div className={s.identity}>
        <Image src="/images/artist.jpg" alt="Nova Reign" width={66} height={66} priority />
        <div><span className={s.eyebrow}>s/nova · FAN-RUN · ALTERNATIVE R&B</span><h1 id="playground-army-name">Nova Reign’s Army <StanStarIcon size={30} /></h1><p>The music brought you here. Make yourself at home.</p><small>Hosted by <Link href="/fans/jess-wav">@jess.wav</Link> · 2,408 demo stans</small></div>
        <button className={s.join} aria-pressed={joined} onClick={() => demo.toggle("army-nova")}>{joined ? <Check size={17} /> : <Plus size={17} />}{joined ? "Joined" : "Join this Army"}</button>
      </div>
      </header>

      <p className={warning ? s.status : "sr-only"} role="status" aria-live="polite">{notice}</p>
      <p id="desktop-key-help" className="sr-only">Drag a window onto another to exchange their spaces, or into an empty grid space. Arrow keys on a title exchange nearby window spaces. Shift plus arrows resizes it. Arrow keys on the corner resize. Escape cancels dragging. Sizing also has a menu. Mobile uses stacked windows.</p>
      {focused && <button className={s.focusReturn} onClick={() => setFocused(null)}><ArrowLeft size={16} />Restore layout</button>}

      <div ref={grid} className={`${s.grid} ${preview ? s.gridActive : ""}`} data-window-grid>
        {ordered.map((id) => {
          const placement = placements.find((item) => item.id === id);
          const hidden = layout.minimized.includes(id);
          const Icon = icons[id];
          const size = displayLayout.sizes[id];
          const visiblePlacement = placement;
          return <section key={id} ref={(element) => { frames.current[id] = element; }} hidden={hidden}
            className={`${s.window} ${active === id ? s.active : ""} ${preview?.id === id ? s.moving : ""}`}
            data-panel-id={id} data-window-colour={owner.windows[id].colour} data-window-skin={owner.windows[id].skin} data-panel-surface={owner.windows[id].surface} data-panel-typeface={owner.windows[id].typeface} data-expanded={focused === id ? "true" : undefined} aria-labelledby={`window-title-${id}`}
            style={{ ...(owner.windows[id].surface === "custom" ? {
                "--surface-bg": owner.windows[id].customSurface,
                "--surface-ink": readableColor("#f3f4f3", owner.windows[id].customSurface),
                "--surface-muted": readableColor("#9caaa3", owner.windows[id].customSurface),
                "--surface-rule": `color-mix(in srgb,${owner.windows[id].customSurface} 70%,${readableColor("#f3f4f3", owner.windows[id].customSurface)})`,
              } : {}), ...(owner.windows[id].colour === "custom" ? { "--accent": owner.windows[id].customAccent } : {}), gridColumn: visiblePlacement ? `${visiblePlacement.x + 1} / span ${visiblePlacement.width}` : undefined,
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
              {draftOwner && <button className={s.windowControl} aria-label={`Edit ${names[id]} style`} title="Edit this panel" onClick={() => openStyle(id)}><Palette size={14} /></button>}
              <details className={s.windowMenu} onKeyDown={(event) => {
                if (event.key === "Escape") { event.stopPropagation(); event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); }
              }}>
                <summary aria-label={`Size and position ${names[id]}`} title="Size & position"><Scan size={16} /></summary>
                <div>
                  <label>Window width<select aria-label={`${names[id]} width`} disabled={!desktop || !!focused} value={size.width} onChange={(event) => resize(id, Number(event.target.value))}>{Array.from({ length: 9 }, (_, index) => index + 4).map((width) => <option value={width} key={width}>{width}/12{width === 4 ? " · narrow" : width === 8 ? " · wide" : width === 12 ? " · full" : ""}</option>)}</select></label>
                  <label>Window height<select aria-label={`${names[id]} height`} disabled={!desktop || !!focused} value={size.height} onChange={(event) => resize(id, size.width, Number(event.target.value))}>{Array.from({ length: 6 }, (_, index) => index + 3).map((height) => <option value={height} key={height}>{height} rows</option>)}</select></label>
                  <button disabled={layout.order.indexOf(id) === 0} onClick={() => move(id, layout.order.indexOf(id) - 1)}><ArrowLeft size={15} />Move earlier</button>
                  <button disabled={layout.order.indexOf(id) === layout.order.length - 1} onClick={() => move(id, layout.order.indexOf(id) + 1)}><ArrowDown size={15} />Move later</button>
                </div>
              </details>
              <button className={s.windowControl} aria-label={`${focused === id ? "Restore" : "Expand"} ${names[id]}`} onClick={() => { setFocused(focused === id ? null : id); setActive(id); requestAnimationFrame(() => frames.current[id]?.scrollIntoView({block:"nearest", behavior:"instant"})); }}><Maximize2 size={15} /></button>
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
        {ghost && <div className={s.ghost} data-drop-preview aria-hidden="true" style={{ gridColumn: `${ghost.x + 1} / span ${ghost.width}`, gridRow: `${ghost.y + 1} / span ${ghost.height}` }} /> }
        {layout.minimized.length === PANEL_IDS.length && <div className={s.empty}><StanStarIcon size={40} /><h2>Everyone’s in the dock.</h2></div>}
      </div>
      <section className={s.communityInvite} aria-label="Create your own Army"><StanStarIcon size={30} /><strong>MAKE SOME NOISE.</strong><Link href="/create">Start your own Army <ArrowUpRight size={17} /></Link></section>
      {layout.minimized.length > 0 && <nav className={s.dock} aria-label="Minimized Army windows">{layout.minimized.map((id) => { const Icon = icons[id];
        return <button key={id} ref={(element) => { dockRefs.current[id] = element; }} aria-label={`Show ${names[id]}`} onClick={() => {
          minimize(id); setFocused(null); setActive(id);
          requestAnimationFrame(() => frames.current[id]?.scrollIntoView({ block: "nearest", behavior: "instant" }));
        }}><Icon size={16} /><span>{names[id]}</span><Plus size={13} /></button>;
      })}</nav>}

    </div>
    {draftOwner && <ArmyStyleEditor initial={committedOwner} visible={editorVisible} scope={styleScope} section={styleSection} onScope={setStyleScope} onSection={setStyleSection} onPreview={setDraftOwner} onHide={hideStyle} onCancel={cancelStyle} onSave={commitStyle} />}
  </main>;
}
