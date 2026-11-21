"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Camera, Check, ChevronDown, GripVertical, Maximize2, MessageCircle, MessageSquare, Minus, Music2, MoreHorizontal, Newspaper, Palette, Plus, RotateCcw } from "lucide-react";
import { useDemo } from "./demo-provider";
import { fanNotes } from "@/lib/fan-space";
import { DesktopChat, DesktopComposer, DesktopDiscussions, DesktopPost } from "./nova-layout-study";
import { StanStarIcon } from "./stan-icons";
import {
  DESKTOP_COLUMNS, DESKTOP_GAP, DESKTOP_ROW, DESKTOP_VERTICAL_STEP, DESKTOP_HORIZONTAL_STEP, MIN_PANEL_WIDTH, MIN_PANEL_HEIGHT, MAX_PANEL_HEIGHT, OWNER_DESKTOP_KEY, PANEL_IDS, PERSONAL_DESKTOP_KEY,
  canMovePanelRow, movePanelRow, movePanel, packDesktop, parseDesktop, parseOwnerDesktop, placePanel, resizePanel, setPanelMinimized, swapPanelSlots,
} from "@/lib/army-desktop";
import type { DesktopLayout, OwnerDesktop, PanelId } from "@/lib/army-desktop";
import { edgeScrollSpeed, resizeRect } from "@/lib/army-grid-geometry";
import { StanCam } from "./stan-cam";
import { ArmyStreamPlayer } from "./army-stream-player";
import { ArmyStyleEditor } from "./army-style-editor";
import type { StyleScope, StyleSection } from "./army-style-editor";
import { readableDesktopColour as readableColor } from "@/lib/army-style-editor";
import s from "./army-desktop-playground.module.css";

const names: Record<PanelId, string> = { feed: "The Army", chat: "Army Chat", board: "Discussions", music: "Army Stereo", stancam: "StanCam" };
const icons = { feed: Newspaper, chat: MessageCircle, board: MessageSquare, music: Music2, stancam: Camera };
const eventName = "stan-army:desktop-updated";
const serverSnapshot = () => null;
const clientReady = () => true;
const serverReady = () => false;
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
  slots: Record<PanelId, { x: number; y: number; width: number; height: number; titleHeight:number }>;
  pointer: {x:number; y:number; altKey:boolean};
  moved: boolean;
  verticalIntent: -1 | 0 | 1;
};

export function ArmyDesktopPlayground() {
  const demo = useDemo();
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const joined = demo.enlisted.includes("army-nova");
  const ownerRaw = useSyncExternalStore(subscribe, () => read(OWNER_DESKTOP_KEY), serverSnapshot);
  const personalRaw = useSyncExternalStore(subscribe, () => read(PERSONAL_DESKTOP_KEY), serverSnapshot);
  const savedOwner = useMemo(() => parseOwnerDesktop(ownerRaw), [ownerRaw]);
  const [unsavedOwner, setUnsavedOwner] = useState<OwnerDesktop | null>(null);
  const committedOwner = unsavedOwner ?? savedOwner;
  const [draftOwner, setDraftOwner] = useState<OwnerDesktop | null>(null);
  const owner = draftOwner ?? committedOwner;
  const [editorVisible, setEditorVisible] = useState(false);
  const [styleScope, setStyleScope] = useState<StyleScope>("feed");
  const [styleSection, setStyleSection] = useState<StyleSection>("themes");
  const styleTrigger = useRef<HTMLButtonElement>(null);
  const styleReturn = useRef<HTMLElement | null>(null);
  const savedLayout = useMemo(() => parseDesktop(personalRaw, owner.layout), [personalRaw, owner.layout]);
  const [unsavedLayout, setUnsavedLayout] = useState<DesktopLayout | null>(null);
  const layout = unsavedLayout ?? savedLayout;
  const desktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, () => false);
  const [modern, setModern] = useState(true);
  const [musicEditing, setMusicEditing] = useState(false);
  const [warning, setWarning] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [gridMinHeight, setGridMinHeight] = useState(0);
  const [active, setActive] = useState<PanelId>("chat");
  const [focused, setFocused] = useState<PanelId | null>(null);
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<{ id: PanelId; kind: "move" | "resize" | "resize-left"; layout: DesktopLayout } | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const edgeScrollFrame = useRef<number | null>(null);
  const draft = useRef<DesktopLayout | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const dockRefs = useRef<Partial<Record<PanelId, HTMLButtonElement | null>>>({});
  const frames = useRef<Partial<Record<PanelId, HTMLElement | null>>>({});
  const displayLayout = preview?.layout ?? (focused ? resizePanel(layout, focused, { width: 12, height: Math.max(6, layout.sizes[focused].height) }) : layout);
  const placements = packDesktop(displayLayout);
  const ghost = preview ? placements.find((item) => item.id === preview.id) : undefined;
  // Keep DOM nodes stable throughout gestures: moving DOM nodes can lose pointer capture.
  const ordered = desktop ? PANEL_IDS : layout.order;
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
    if (!editorVisible || id) styleReturn.current = document.activeElement instanceof HTMLElement ? document.activeElement : styleTrigger.current;
    finish(false); setFocused(null);
    if (!draftOwner) setDraftOwner(structuredClone(committedOwner));
    if (id) { setStyleScope(id); setStyleSection("panels"); }
    setEditorVisible(true);
  }
  function hideStyle() {
    setEditorVisible(false);
    requestAnimationFrame(() => {
      const origin = styleReturn.current;
      if (origin?.isConnected && !origin.closest("[hidden]")) origin.focus({preventScroll:true});
      else styleTrigger.current?.focus({preventScroll:true});
    });
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
  function resize(id: PanelId, width: number, height = displayLayout.sizes[id].height) {
    const next = resizePanel(displayLayout, id, { width, height });
    setFocused(null);
    save(next, `${names[id]}: ${next.sizes[id].width} columns wide, ${next.sizes[id].height} rows high. Neighbours made room.`);
  }
  function move(id: PanelId, index: number) {
    const target = layout.order[index];
    save(desktop && target && target !== id && !layout.minimized.includes(target) ? swapPanelSlots(layout, id, target) : movePanel(layout, id, index), `${names[id]} moved.`);
  }
  function moveRow(id: PanelId, direction: -1 | 1) {
    if (!desktop) { move(id,layout.order.indexOf(id)+direction); return; }
    const before = frames.current[id]?.getBoundingClientRect().top;
    setFocused(null);
    save(movePanelRow(displayLayout,id,direction), `${names[id]} row moved ${direction === -1 ? "up" : "down"}.`);
    requestAnimationFrame(() => {
      const after = frames.current[id]?.getBoundingClientRect().top;
      if (before !== undefined && after !== undefined) window.scrollBy({top:after-before,behavior:"instant"});
      frames.current[id]?.querySelector<HTMLButtonElement>("button[aria-label^='Move ']")?.focus({preventScroll:true});
    });
  }
  function finish(commit: boolean) {
    const current = gesture.current;
    const next = draft.current;
    if (edgeScrollFrame.current !== null) cancelAnimationFrame(edgeScrollFrame.current);
    edgeScrollFrame.current = null;
    gesture.current = null; draft.current = null; setPreview(null); setInteracting(false);
    if (current?.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    const scrollY = window.scrollY;
    if (commit && current && next) { setFocused(null); save(next, `${names[current.id]} ${current.kind === "move" ? "moved" : "resized"}. Your arrangement is saved on this device.`); requestAnimationFrame(() => window.scrollTo({top:scrollY,behavior:"instant"})); }
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
      if (edgeScrollFrame.current !== null) cancelAnimationFrame(edgeScrollFrame.current);
      edgeScrollFrame.current = null;
      gesture.current = null; draft.current = null; setPreview(null); setInteracting(false);
      if (current.handle.hasPointerCapture(current.pointerId)) current.handle.releasePointerCapture(current.pointerId);
    };
    const visibility = () => { if (document.hidden) cancel(); };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && gesture.current) { event.preventDefault(); event.stopPropagation(); cancel(); }
    };
    window.addEventListener("resize", cancel); window.addEventListener("blur", cancel); document.addEventListener("visibilitychange", visibility); window.addEventListener("keydown", escape, true);
    return () => { if (edgeScrollFrame.current !== null) cancelAnimationFrame(edgeScrollFrame.current); gesture.current = null; window.removeEventListener("resize", cancel); window.removeEventListener("blur", cancel); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("keydown", escape, true); };
  }, []);

  function start(event: PointerEvent<HTMLButtonElement>, id: PanelId, kind: Gesture["kind"]) {
    if (!desktop || gesture.current || event.button !== 0 || !grid.current) return;
    event.preventDefault();
    event.currentTarget.focus({preventScroll:true});
    for (const menu of grid.current.querySelectorAll("details[open]")) menu.removeAttribute("open");
    const bounds = grid.current.getBoundingClientRect();
    setGridMinHeight(bounds.height);
    const slots = {} as Gesture["slots"];
    for (const item of packDesktop(displayLayout)) {
      const rect = frames.current[item.id]!.getBoundingClientRect();
      slots[item.id] = { x: rect.x, y: rect.y + window.scrollY, width: rect.width, height: rect.height, titleHeight:frames.current[item.id]!.querySelector("header")!.getBoundingClientRect().height };
    }
    setActive(id); setInteracting(true);
    gesture.current = { id, kind, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY + window.scrollY,
      stepX: (grid.current.getBoundingClientRect().width + DESKTOP_GAP) / DESKTOP_COLUMNS,
      base: displayLayout, handle: event.currentTarget, slots,
      pointer: {x:event.clientX,y:event.clientY,altKey:event.altKey}, moved:false, verticalIntent:0 };
    const started = gesture.current;
    const scrollAtEdge = () => {
      if (gesture.current !== started) return;
      if (started.kind === "move" && started.moved) {
        const speed = edgeScrollSpeed(started.pointer.y,window.innerHeight,started.verticalIntent);
        if (speed) {
          const before = window.scrollY;
          window.scrollBy({top:speed,behavior:"instant"});
          if (window.scrollY !== before) updateGesture(started.pointer.x,started.pointer.y,started.pointer.altKey);
        }
      }
      edgeScrollFrame.current = requestAnimationFrame(scrollAtEdge);
    };
    edgeScrollFrame.current = requestAnimationFrame(scrollAtEdge);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function track(event: PointerEvent<HTMLButtonElement>) {
    if (gesture.current?.pointerId !== event.pointerId) return;
    updateGesture(event.clientX,event.clientY,event.altKey);
  }
  function updateGesture(clientX: number, clientY: number, altKey: boolean) {
    const current = gesture.current;
    if (!current) return;
    const pointerDy = clientY-current.pointer.y;
    if (Math.abs(pointerDy)>=.5) current.verticalIntent = pointerDy<0 ? -1 : 1;
    current.pointer = {x:clientX,y:clientY,altKey};
    const dx = clientX - current.startX, dy = clientY + window.scrollY - current.startY;
    if (Math.abs(dx) + Math.abs(dy) < 6) { current.moved = false; draft.current = null; setPreview(null); return; }
    current.moved = true;
    let next: DesktopLayout;
    if (current.kind !== "move") {
      const box = resizeRect(current.slots[current.id],Object.entries(current.slots).filter(([id])=>id!==current.id).map(([,rect])=>rect),dx,dy,current.kind === "resize-left",DESKTOP_GAP);
      next = resizePanel(current.base,current.id,{width:(box.width+DESKTOP_GAP)/current.stepX,height:(box.height+DESKTOP_GAP)/(DESKTOP_ROW+DESKTOP_GAP)},current.kind === "resize-left");
    } else {
      const x = clientX, y = clientY + window.scrollY;
      const hit = current.base.order.find((id) => {
        const rect = current.slots[id];
        if (id === current.id || !rect || x < rect.x || x > rect.x+rect.width || y < rect.y || y > rect.y+rect.height) return false;
        const onHeader = y <= rect.y+rect.titleHeight;
        const inCentre = x >= rect.x+rect.width*.18 && x <= rect.x+rect.width*.82 && y <= rect.y+rect.height*.82;
        return altKey || onHeader || inCentre;
      });
      const origin = packDesktop(current.base).find((item) => item.id === current.id)!;
      const position = {
        x: origin.x + Math.round(dx / (current.stepX * DESKTOP_HORIZONTAL_STEP)) * DESKTOP_HORIZONTAL_STEP,
        y: origin.y + Math.round(dy / ((DESKTOP_ROW + DESKTOP_GAP) * DESKTOP_VERTICAL_STEP)) * DESKTOP_VERTICAL_STEP,
      };
      next = hit ? swapPanelSlots(current.base, current.id, hit) : placePanel(current.base, current.id, position);
    }
    if (draft.current && JSON.stringify(draft.current) === JSON.stringify(next)) return;
    draft.current = next; setPreview({ id: current.id, kind: current.kind, layout: next });
  }
  function keys(event: KeyboardEvent<HTMLButtonElement>, id: PanelId, resizing = false, fromLeft = false) {
    if (event.key === "Escape") { finish(false); return; }
    const directions: Record<string, number> = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 };
    const direction = directions[event.key]; if (!direction) return;
    event.preventDefault(); setActive(id);
    if (resizing || event.shiftKey) {
      if (!desktop) { setNotice("Window sizes fit this view. Restore the desktop on a larger screen to resize."); return; }
      const size = displayLayout.sizes[id];
      const next = resizePanel(displayLayout, id, { width: size.width + (/Left|Right/.test(event.key) ? direction * DESKTOP_HORIZONTAL_STEP * (fromLeft ? -1 : 1) : 0), height: size.height + (/Up|Down/.test(event.key) ? direction * DESKTOP_VERTICAL_STEP : 0) }, fromLeft);
      setFocused(null);
      save(next, `${names[id]} resized. Your arrangement is saved on this device.`);
    } else if (desktop) {
      setFocused(null);
      const slot = packDesktop(displayLayout).find((item) => item.id === id)!;
      save(placePanel(displayLayout, id, { x: slot.x + (/Left|Right/.test(event.key) ? direction * DESKTOP_HORIZONTAL_STEP : 0), y: slot.y + (/Up|Down/.test(event.key) ? direction * DESKTOP_VERTICAL_STEP : 0) }), `${names[id]} moved.`);
    } else if (/Up|Down/.test(event.key)) moveRow(id,direction as -1 | 1);
  }

  return <main id="main" className={`${s.desktop} ${s[owner.look]}`} data-desktop-playground data-interacting={interacting ? "true" : undefined} data-interface={modern ? "modern" : "original"} data-animated-background={owner.room.image?.animated ? "true" : undefined} data-room-style={owner.look} data-editor-open={editorVisible ? "true" : undefined} data-window-corners={owner.corners} data-window-frame={owner.frame} data-header-typeface={owner.header.typeface}
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
      const openMenu = Array.from(event.currentTarget.querySelectorAll<HTMLDetailsElement>("details[open]")).find((menu) => menu.querySelector("summary")?.getClientRects().length);
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
      <p id="desktop-key-help" className="sr-only">Drag a window anywhere on the grid. Neighbours keep their sizes and move down if needed. Drop onto another window’s title bar or centre to exchange spaces. Drop in an empty gap to place it there. Arrow keys on a title move it across the grid. Shift plus arrows resizes it. Arrow keys on the corner resize. Escape cancels dragging. Sizing also has a menu. Mobile uses stacked windows.</p>
      {focused && <button className={s.focusReturn} onClick={() => setFocused(null)}><ArrowLeft size={16} />Restore layout</button>}

      <div ref={grid} className={`${s.grid} ${preview ? s.gridActive : ""}`} style={{"--grid-height":`${Math.max(placements.length ? 0 : 200,...placements.map((item)=>(item.y+item.height)*(DESKTOP_ROW+DESKTOP_GAP)-DESKTOP_GAP))}px`,...(interacting ? {minHeight:gridMinHeight} : {})} as CSSProperties} data-window-grid>
        {ordered.map((id) => {
          const placement = placements.find((item) => item.id === id);
          const hidden = layout.minimized.includes(id);
          const Icon = icons[id];
          const size = displayLayout.sizes[id];
          const visiblePlacement = placement;
          return <section key={id} ref={(element) => { frames.current[id] = element; }} hidden={hidden}
            className={`${s.window} ${active === id ? s.active : ""} ${preview?.id === id ? s.moving : ""}`}
            data-panel-id={id} data-player-size={id === "music" && owner.music?.startsWith("https://open.spotify.com/") && !musicEditing ? size.height >= 5 ? "full" : "compact" : undefined} data-style-selected={editorVisible && styleScope === id ? "true" : undefined} data-window-colour={owner.windows[id].colour} data-window-skin={owner.windows[id].skin} data-panel-surface={owner.windows[id].surface} data-panel-typeface={owner.windows[id].typeface} data-expanded={focused === id ? "true" : undefined} aria-labelledby={`window-title-${id}`}
            style={{ ...(owner.windows[id].surface === "custom" ? {
                "--surface-bg": owner.windows[id].customSurface,
                "--surface-ink": readableColor("#f3f4f3", owner.windows[id].customSurface),
                "--surface-muted": readableColor("#9caaa3", owner.windows[id].customSurface),
                "--surface-rule": `color-mix(in srgb,${owner.windows[id].customSurface} 70%,${readableColor("#f3f4f3", owner.windows[id].customSurface)})`,
              } : {}), ...(owner.windows[id].colour === "custom" ? { "--accent": owner.windows[id].customAccent } : {}),
              "--panel-left": `calc(${(visiblePlacement?.x ?? 0) / DESKTOP_COLUMNS} * (100% + ${DESKTOP_GAP}px))`,
              "--panel-top": `${(visiblePlacement?.y ?? 0) * (DESKTOP_ROW+DESKTOP_GAP)}px`,
              "--panel-width": `calc(${size.width / DESKTOP_COLUMNS} * (100% + ${DESKTOP_GAP}px) - ${DESKTOP_GAP}px)`,
              "--window-height": `${size.height * DESKTOP_ROW + (size.height - 1) * DESKTOP_GAP}px` } as CSSProperties}
            onFocusCapture={() => setActive(id)} onPointerDownCapture={() => setActive(id)}>
            <header className={s.titlebar}>
              <h2 id={`window-title-${id}`} className="sr-only">{names[id]}</h2>
              <button className={s.dragHandle} aria-label={`Move ${names[id]}`} aria-describedby="desktop-key-help"
                onPointerDown={(event) => start(event, id, "move")} onPointerMove={track}
                onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => { if (gesture.current) finish(false); }}
                onKeyDown={(event) => keys(event, id)} title="Drop on a panel to swap · drop in a gap to place · arrow keys to move">
                <GripVertical className={s.grip} size={15} /><Icon size={17} /><span className={s.windowTitle}>{names[id]}</span>
              </button>
              <button className={s.windowControl} aria-label={`Edit ${names[id]} style`} title={`Style ${names[id]}`} onClick={() => openStyle(id)}><Palette size={13} /></button>
              <details className={s.windowMenu} onKeyDown={(event) => {
                if (event.key === "Escape" && event.currentTarget.open) { event.stopPropagation(); for (const submenu of event.currentTarget.querySelectorAll("details[open]")) submenu.removeAttribute("open"); event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); }
              }}>
                <summary aria-label={`Panel options ${names[id]}`} title="Panel options"><MoreHorizontal size={15} /></summary>
                <div>
                  {id === "music" && <>
                    <button onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); setMusicEditing(true); }}><Music2 size={14} />Change music</button>
                    <button onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); resize(id, size.width, size.height >= 5 ? 3 : 5); }}>{size.height >= 5 ? "Compact player" : "Show full playlist"}</button>
                  </>}
                  <div className={s.rowMoves} role="group" aria-label="Move entire row">
                  <button aria-label="Move row up" title="Move entire row up" disabled={desktop ? !canMovePanelRow(displayLayout,id,-1) : layout.order.indexOf(id) === 0} onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); moveRow(id,-1); }}><ArrowUp size={15} />Move up</button>
                  <button aria-label="Move row down" title="Move entire row down" disabled={desktop ? !canMovePanelRow(displayLayout,id,1) : layout.order.indexOf(id) === layout.order.length - 1} onClick={(event) => { event.currentTarget.closest("details")?.removeAttribute("open"); moveRow(id,1); }}><ArrowDown size={15} />Move down</button>
                  </div>
                  <button aria-label={`${focused === id ? "Restore" : "Expand"} ${names[id]}`} onClick={(event) => { const menu = event.currentTarget.closest("details"); const trigger = menu?.querySelector("summary"); for (const submenu of menu?.querySelectorAll("details[open]") ?? []) submenu.removeAttribute("open"); menu?.removeAttribute("open"); trigger?.focus({preventScroll:true}); setFocused(focused === id ? null : id); setActive(id); requestAnimationFrame(() => { frames.current[id]?.scrollIntoView({block:"nearest", behavior:"instant"}); }); }}><Maximize2 size={14} />{focused === id ? "Restore size" : "Expand panel"}</button>
                  <details className={s.sizeOptions}><summary aria-label={`Size and position ${names[id]}`}>Size & position<ChevronDown size={13} /></summary><div>
                  <label>Window width<select aria-label={`${names[id]} width`} disabled={!desktop} value={size.width} onChange={(event) => resize(id, Number(event.target.value))}>{size.width % DESKTOP_HORIZONTAL_STEP !== 0 && <option value={size.width}>{Number(size.width.toFixed(3))}/12 · custom</option>}{Array.from({ length: (DESKTOP_COLUMNS - MIN_PANEL_WIDTH) / DESKTOP_HORIZONTAL_STEP + 1 }, (_, index) => index * DESKTOP_HORIZONTAL_STEP + MIN_PANEL_WIDTH).map((width) => <option value={width} key={width}>{width}/12{width === 4 ? " · narrow" : width === 8 ? " · wide" : width === 12 ? " · full" : ""}</option>)}</select></label>
                  <label>Window height<input aria-label={`${names[id]} height`} type="number" step="any" min={MIN_PANEL_HEIGHT} max={MAX_PANEL_HEIGHT} disabled={!desktop} value={size.height} onChange={(event) => { if (event.currentTarget.value && event.currentTarget.validity.valid) resize(id, size.width, Number(event.currentTarget.value)); }} /></label>
                  <label>Column<input aria-label={`${names[id]} column`} type="number" step="any" min={1} max={DESKTOP_COLUMNS - size.width + 1} disabled={!desktop} value={(placement?.x ?? 0) + 1} onChange={(event) => { if (event.currentTarget.value && event.currentTarget.validity.valid) { setFocused(null); save(placePanel(displayLayout,id,{x:Number(event.currentTarget.value)-1,y:placement?.y ?? 0}), `${names[id]} moved.`); } }} /></label>
                  <label>Row<input aria-label={`${names[id]} row`} type="number" min={1} max={10001} step="any" disabled={!desktop} value={(placement?.y ?? 0) + 1} onChange={(event) => { if (event.currentTarget.value && event.currentTarget.validity.valid) { setFocused(null); save(placePanel(displayLayout,id,{x:placement?.x ?? 0,y:Number(event.currentTarget.value)-1}), `${names[id]} moved.`); } }} /></label>

                  </div></details>
                </div>
              </details>

              <button className={s.windowControl} aria-label={`Minimize ${names[id]}`} onClick={() => minimize(id)}><Minus size={14} /></button>
            </header>
            <div className={s.windowBody} data-window-content={id}>
              {id === "feed" && <div className={s.feedContents}><DesktopComposer joined={joined} join={join} />{[...(demo.notes["army-nova"] ?? []), fanNotes[1], fanNotes[0], fanNotes[2], fanNotes[3]].map((note) => <DesktopPost key={note.id} note={note} />)}<Link className={s.archive} href="/armies/nova/posts">View all posts <ArrowUpRight size={16} /></Link></div>}
              {id === "chat" && <DesktopChat joined={joined} join={join} windowed />}
              {id === "music" && ready && <ArmyStreamPlayer source={owner.music} full={size.height >= 5} editing={musicEditing} edit={() => setMusicEditing(true)} cancel={() => setMusicEditing(false)} save={(music) => { saveOwner({...committedOwner,music}, music ? "Music link saved on this device." : "Music removed on this device."); setMusicEditing(false); }} />}
              {id === "board" && <DesktopDiscussions windowed />}
              {id === "stancam" && <StanCam />}
            </div>
            <button className={`${s.resizeHandle} ${s.resizeLeft}`} aria-label={`Resize ${names[id]} from left`} aria-describedby="desktop-key-help" title="Drag left to make this window wider"
              onPointerDown={(event) => start(event, id, "resize-left")} onPointerMove={track}
              onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => { if (gesture.current) finish(false); }}
              onKeyDown={(event) => keys(event, id, true, true)}><span aria-hidden="true" /></button>
            <button className={s.resizeHandle} aria-label={`Resize ${names[id]}`} aria-describedby="desktop-key-help" title="Drag to resize · arrow keys to resize"
              onPointerDown={(event) => start(event, id, "resize")} onPointerMove={track}
              onPointerUp={() => finish(true)} onPointerCancel={() => finish(false)} onLostPointerCapture={() => { if (gesture.current) finish(false); }}
              onKeyDown={(event) => keys(event, id, true)}><span aria-hidden="true" /></button>
          </section>;
        })}
        {ghost && <div className={s.ghost} data-drop-preview aria-hidden="true" style={{ "--panel-left":`calc(${ghost.x / DESKTOP_COLUMNS} * (100% + ${DESKTOP_GAP}px))`, "--panel-top":`${ghost.y * (DESKTOP_ROW+DESKTOP_GAP)}px`, "--panel-width":`calc(${ghost.width / DESKTOP_COLUMNS} * (100% + ${DESKTOP_GAP}px) - ${DESKTOP_GAP}px)`, "--window-height":`${ghost.height * (DESKTOP_ROW+DESKTOP_GAP)-DESKTOP_GAP}px` } as CSSProperties} /> }
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
