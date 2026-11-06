"use client";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties } from "react";
import {
  Paintbrush,
  Eye,
  Pause,
  Play,
  Check,
  X,
  RotateCcw,
} from "lucide-react";
import { ThemeEditor } from "./theme-editor";
import {
  defaultTheme,
  fonts,
  parseTheme,
  readableColor,
  saveProfileTheme,
  profileThemeSnapshot,
  Theme,
} from "@/lib/theme";

type ThemeContext = {
  openPlayerEditor: () => void;
  clean: boolean;
  animationsEnabled: boolean;
  role: string;
  canEditCommunity: boolean;
  canPostOfficial: boolean;
  theme: Theme;
  visibleAsset: (asset: Theme["background"]["image"]) => string | null;
};
const Context = createContext<ThemeContext>({
  openPlayerEditor: () => {},
  clean: false,
  animationsEnabled: false,
  role: "visitor",
  canEditCommunity: false,
  canPostOfficial: false,
  theme: defaultTheme,
  visibleAsset: () => null,
});
export function useProfileTheme() {
  return useContext(Context);
}
const localEvent = "stan-army:theme-updated";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(localEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(localEvent, callback);
  };
}
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function motionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
const symbols = {
  none: [],
  hearts: ["♥", "♡", "♥", "♡", "♥", "♡"],
  stars: ["★", "✦", "☆", "✧", "★", "✦"],
  flames: ["♨", "♨", "♨", "♨", "♨", "♨"],
  butterflies: ["ʚɞ", "✧", "ʚɞ", "☆", "ʚɞ", "✧"],
  pixels: ["▚", "▞", "✚", "▚", "▞", "✚"],
};
export function ProfileTheme({
  profileId,
  kind,
  name,
  children,
  legacyProfileId,
  officialParticipation = false,
  previewTheme,
  compactControls = false,
}: {
  profileId: string;
  kind: "army" | "fan";
  legacyProfileId?: string;
  officialParticipation?: boolean;
  previewTheme?: Theme;
  compactControls?: boolean;
  name: string;
  children: React.ReactNode;
}) {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return profileThemeSnapshot(
          window.localStorage,
          profileId,
          legacyProfileId,
        );
      } catch {
        return null;
      }
    },
    () => null,
  );
  const saved = useMemo(() => parseTheme(raw), [raw]);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    motionSnapshot,
    () => true,
  );
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Theme>(defaultTheme);
  const [clean, setClean] = useState(false);
  const [paused, setPaused] = useState(false);
  const [role, setRole] = useState(kind === "army" ? "founder" : "owner");
  const [status, setStatus] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const theme =
    previewTheme ??
    (clean && !editing ? defaultTheme : editing ? draft : saved);
  const canEditCommunity =
    kind === "army" && ["founder", "admin"].includes(role);
  const canPostOfficial =
    kind === "army" &&
    officialParticipation &&
    ["official-artist", "official-representative"].includes(role);
  const canEdit = kind === "fan" ? role === "owner" : canEditCommunity;
  const playing = theme.decorations.animated && !paused && !reduced;
  const custom =
    (!!previewTheme || editing || (!clean && raw !== null)) &&
    JSON.stringify(theme) !== JSON.stringify(defaultTheme);
  function visibleAsset(asset: Theme["background"]["image"]) {
    return asset && (!asset.animated || playing) ? asset.dataUrl : null;
  }
  function open() {
    setUploading(false);
    setDraft(structuredClone(saved));
    setClean(false);
    setEditing(true);
    setStatus("Live preview — changes are unsaved until you choose Save.");
  }
  function close() {
    setEditing(false);
    setStatus("Changes cancelled. Your saved theme is unchanged.");
    requestAnimationFrame(() => trigger.current?.focus());
  }
  function save() {
    try {
      saveProfileTheme(window.localStorage, profileId, draft);
      window.dispatchEvent(new Event(localEvent));
      setEditing(false);
      setClean(false);
      setStatus("Saved on this device. Your theme will survive refresh.");
      requestAnimationFrame(() => trigger.current?.focus());
    } catch {
      setStatus(
        "Could not save: browser storage is unavailable or full. Your preview is still open. Try smaller images or allow local storage.",
      );
    }
  }
  const panel = theme.panels.color,
    bg = theme.background.color;
  const vars = {
    "--theme-bg": bg,
    "--theme-panel": panel,
    "--theme-text": readableColor(theme.colors.text, panel),
    "--theme-page-text": readableColor(theme.colors.text, bg),
    "--theme-link": readableColor(theme.colors.links, panel),
    "--theme-page-link": readableColor(theme.colors.links, bg),
    "--theme-button": theme.colors.buttons,
    "--theme-button-text": readableColor("#ffffff", theme.colors.buttons),
    "--theme-border": theme.colors.borders,
    "--theme-control-border": readableColor(theme.colors.borders, panel),
    "--theme-accent": readableColor(theme.colors.accent, panel),
    "--theme-font": fonts[theme.font],
    "--theme-panel-fill": `rgba(${[1, 3, 5].map((i) => parseInt(panel.slice(i, i + 2), 16)).join(",")},${theme.panels.opacity / 100})`,
    "--theme-radius":
      theme.panels.corners === "square"
        ? "0px"
        : theme.panels.corners === "round"
          ? "30px"
          : theme.panels.corners === "wonky"
            ? "8px 35px 5px 24px"
            : "15px",
    "--theme-border-style": theme.panels.border,
    backgroundColor: custom ? bg : undefined,
    backgroundImage:
      custom && visibleAsset(theme.background.image)
        ? `url("${visibleAsset(theme.background.image)}")`
        : undefined,
    backgroundRepeat: theme.background.size === "tile" ? "repeat" : "no-repeat",
    backgroundSize:
      theme.background.size === "tile" || theme.background.size === "natural"
        ? "auto"
        : theme.background.size,
    backgroundPosition: theme.background.position,
    backgroundAttachment: theme.background.attachment,
  } as CSSProperties;
  return (
    <Context.Provider
      value={{
        openPlayerEditor: () => {
          if (canEdit) {
            if (!editing) open();
            requestAnimationFrame(() =>
              document.getElementById("army-player-skin")?.focus(),
            );
          }
        },
        clean,
        animationsEnabled: playing,
        role,
        canEditCommunity,
        canPostOfficial,
        theme: custom ? theme : defaultTheme,
        visibleAsset: (asset) => (custom ? visibleAsset(asset) : null),
      }}
    >
      <div
        className={`profile-workbench ${editing ? "is-editing" : ""} ${compactControls ? "profile-compact-controls" : ""}`}
        onKeyDown={(e) => {
          if (editing && e.key === "Escape") {
            e.preventDefault();
            close();
          }
        }}
      >
        {!previewTheme && (
          <>
            <div className="theme-toolbar">
              <div>
                <span className="theme-kicker">
                  MY {kind === "army" ? "ARMY" : "PROFILE"}, MY RULES.
                </span>
                <strong>
                  {name}’s space <span>· Local demo</span>
                </strong>
              </div>
              <div className="theme-toolbar-actions">
                <label className="demo-role">
                  Demo role
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (editing) close();
                    }}
                  >
                    {kind === "fan" ? (
                      <option value="owner">Fan profile owner</option>
                    ) : (
                      <>
                        <option value="founder">Founding stan</option>
                        <option value="admin">Community admin</option>
                        <option value="moderator">Community moderator</option>
                        {officialParticipation && (
                          <>
                            <option value="official-artist">
                              Official artist · demo
                            </option>
                            <option value="official-representative">
                              Official representative · demo
                            </option>
                          </>
                        )}
                      </>
                    )}
                    <option value="visitor">Visitor</option>
                  </select>
                </label>
                <button
                  className="theme-control"
                  aria-pressed={clean}
                  onClick={() => {
                    setClean(!clean);
                    setStatus(
                      !clean
                        ? "Clean view: custom visuals hidden, content unchanged."
                        : "Custom view restored.",
                    );
                  }}
                  disabled={editing}
                >
                  <Eye size={15} />
                  {clean ? "View custom" : "View clean"}
                </button>
                <button
                  className="theme-control"
                  aria-pressed={paused || reduced}
                  onClick={() => setPaused(!paused)}
                  disabled={reduced}
                >
                  <span>
                    {paused || reduced ? (
                      <Play size={14} />
                    ) : (
                      <Pause size={14} />
                    )}
                  </span>
                  {reduced
                    ? "Reduced motion"
                    : paused
                      ? "Play animations"
                      : "Pause animations"}
                </button>
                {canEdit && (
                  <button
                    ref={trigger}
                    className="button customise-trigger"
                    onClick={open}
                    disabled={editing}
                  >
                    <Paintbrush size={16} /> CUSTOMISE
                  </button>
                )}
              </div>
            </div>
            <div className="theme-status-row">
              <p role="status">
                {status ||
                  (compactControls
                    ? "Local demo controls · Theme saves stay on this device."
                    : "Local role simulation, not authentication. Community roles and official identity are separate. Visual settings save on this device only.")}
              </p>
              {playing ? (
                <span>Animation on</span>
              ) : (
                <span>Motion off · animated uploads hidden</span>
              )}
            </div>
          </>
        )}
        <div
          className={`profile-canvas ${custom ? "profile-custom" : ""} theme-${theme.preset} ${playing ? "theme-motion" : "theme-still"}`}
          data-profile={profileId}
          data-clean={clean}
          style={vars}
        >
          <div className="profile-pattern" aria-hidden="true" />
          {custom && (
            <div
              className={`theme-decorations decoration-${theme.decorations.style} ${theme.decorations.glitter ? "has-glitter" : ""}`}
              aria-hidden="true"
            >
              {symbols[theme.decorations.style].map((symbol, i) => (
                <span key={i} style={{ "--sticker-index": i } as CSSProperties}>
                  {symbol}
                </span>
              ))}
            </div>
          )}
          <div className="profile-content">{children}</div>
        </div>
        {editing && (
          <aside
            className="theme-editor"
            role="region"
            aria-label="Profile visual editor"
          >
            <div className="editor-topbar">
              <div>
                <span className="theme-kicker">LIVE CUSTOMISATION</span>
                <h2 id="theme-editor-heading" tabIndex={-1}>
                  Your space.
                  <br />
                  <em>Your rules.</em>
                </h2>
              </div>
              <button
                className="theme-control"
                onClick={close}
                aria-label="Cancel customisation"
              >
                <X size={19} />
              </button>
            </div>
            <p className="editor-intro">
              Go on. Make a glorious mess.
              <br />
              Your real page is the live preview.
            </p>
            <div className="editor-save-status">
              <span /> Unsaved preview · {name}
            </div>
            <ThemeEditor
              theme={draft}
              onChange={setDraft}
              onBusyChange={setUploading}
            />
            <div className="editor-actions">
              <button
                className="editor-reset"
                disabled={uploading}
                onClick={() => {
                  setDraft(structuredClone(defaultTheme));
                  setStatus(
                    "Default theme previewed. Save to keep it, or Cancel to restore your saved theme.",
                  );
                }}
              >
                <RotateCcw size={14} /> Reset to default
              </button>
              <div>
                <button className="theme-control" onClick={close}>
                  Cancel
                </button>
                <button
                  className="button button-blue"
                  disabled={uploading}
                  onClick={save}
                >
                  <Check size={16} /> Save theme
                </button>
              </div>
              <p>{status}</p>
            </div>
          </aside>
        )}
      </div>
    </Context.Provider>
  );
}
