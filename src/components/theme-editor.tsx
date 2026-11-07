"use client";
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  ImagePlus,
  Sparkles,
  Palette,
  Type,
  LayoutPanelTop,
  Code,
  Wallpaper,
} from "lucide-react";
import type { CSSProperties } from "react";
import {
  moduleLabels,
  ArmyModuleName,
  playerSkins,
  PlayerSkin,
  fontLabels,
  fonts,
  MAX_TOTAL_ASSET_BYTES,
  presets,
  readableColor,
  Theme,
  ThemeAsset,
  validAsset,
} from "@/lib/theme";
import { readImage } from "@/lib/image-upload";
import demoHeart from "@/lib/demo-heart.json";

type AssetTarget = "background" | "banner" | "avatar";
export function ThemeEditor({
  theme,
  onChange,
  onBusyChange,
  showModules = false,
  galleryControls = false,
  motionActive = false,
}: {
  theme: Theme;
  showModules?: boolean;
  galleryControls?: boolean;
  motionActive?: boolean;
  onChange: (t: Theme) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  useEffect(() => {
    document.getElementById("theme-editor-heading")?.focus();
  }, []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const uploadSequence = useRef(0);
  useEffect(
    () => () => {
      uploadSequence.current += 1;
      onBusyChange(false);
    },
    [onBusyChange],
  );
  function update(change: Partial<Theme>) {
    onChange({ ...theme, ...change });
    setError("");
  }
  function assetFor(target: AssetTarget) {
    return target === "background"
      ? theme.background.image
      : theme.images[target];
  }
  function setAsset(target: AssetTarget, asset: ThemeAsset | null) {
    const all = {
      background: theme.background.image,
      banner: theme.images.banner,
      avatar: theme.images.avatar,
      [target]: asset,
    };
    if (
      Object.values(all).reduce((sum, a) => sum + (a?.bytes || 0), 0) >
      MAX_TOTAL_ASSET_BYTES
    ) {
      setError(
        "Combined images exceed 1 MB. Remove an existing image or choose a smaller file.",
      );
      return;
    }
    if (target === "background")
      update({ background: { ...theme.background, image: asset } });
    else update({ images: { ...theme.images, [target]: asset } });
  }
  async function upload(target: AssetTarget, file: File | undefined) {
    if (!file) return;
    const sequence = ++uploadSequence.current;
    setBusy(true);
    onBusyChange(true);
    setError("");
    try {
      const asset = await readImage(file);
      if (sequence === uploadSequence.current) setAsset(target, asset);
    } catch (e) {
      if (sequence === uploadSequence.current)
        setError(e instanceof Error ? e.message : "Could not load image.");
    } finally {
      if (sequence === uploadSequence.current) {
        setBusy(false);
        onBusyChange(false);
      }
    }
  }
  const corrected =
    readableColor(theme.colors.text, theme.panels.color) !==
      theme.colors.text ||
    readableColor(theme.colors.links, theme.panels.color) !==
      theme.colors.links;
  return (
    <fieldset disabled={busy} className="editor-fields" aria-busy={busy}>
      {showModules && (
        <section className="editor-section">
          <h3>Tools for your Army</h3>
          <p>
            Whatever you stan for. Stan for it here. Show only the modules your
            Army needs. Spotify is for every Army.
          </p>
          <div className="module-toggles">
            {Object.entries(moduleLabels)
              .filter(([name]) => name !== "gallery" || galleryControls)
              .map(([name, label]) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={theme.modules[name as ArmyModuleName]}
                    onChange={(e) =>
                      update({
                        modules: { ...theme.modules, [name]: e.target.checked },
                      })
                    }
                  />
                  {label}
                </label>
              ))}
          </div>
          <p className="editor-hint">
            Visibility changes preview immediately. Save keeps them; Cancel
            restores your saved settings. Clean view respects hidden modules.
          </p>
        </section>
      )}
      <section className="editor-section">
        <h3>
          <Sparkles size={16} /> The grossness library
        </h3>
        <p>Six moods. Absolutely no taste police.</p>
        <ThemePresetPicker theme={theme} onChange={onChange} busy={busy} />
        <p className="editor-hint">
          Presets replace appearance settings and uploads; module visibility is
          kept. Cancel restores your saved theme.
        </p>
      </section>
      {showModules && (
        <section className="editor-section">
          <h3>Player appearance</h3>
          <label>
            Player skin
            <select
              id="army-player-skin"
              value={theme.playerSkin}
              onChange={(e) =>
                update({ playerSkin: e.target.value as PlayerSkin })
              }
            >
              {Object.entries(playerSkins).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <p className="editor-hint">
            Styles the Spotify frame and the full Army Player only. Spotify’s
            own embedded controls cannot be restyled. Open the listening room to
            see the full skin.
            {!theme.modules.playlist &&
              !theme.modules.videos &&
              " Enable Music / Spotify or Videos under Tools to preview a player."}
          </p>
        </section>
      )}
      <section className="editor-section">
        <h3>
          <Wallpaper size={16} /> Page background
        </h3>
        <AssetInput
          target="background"
          label="Background image or GIF"
          asset={theme.background.image}
          busy={busy}
          upload={upload}
          remove={() => setAsset("background", null)}
        />
        <button
          type="button"
          className="demo-gif-button"
          disabled={busy}
          onClick={() => setAsset("background", validAsset(demoHeart))}
        >
          ♥ Try our original animated pixel-heart GIF
        </button>
        <div className="editor-grid">
          <ColorInput
            label="Background colour"
            value={theme.background.color}
            onChange={(v) =>
              update({ background: { ...theme.background, color: v } })
            }
          />
          <label>
            Background sizing
            <select
              disabled={!theme.background.image}
              value={theme.background.size}
              onChange={(e) =>
                update({
                  background: {
                    ...theme.background,
                    size: e.target.value as Theme["background"]["size"],
                  },
                })
              }
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="tile">Tile / repeat</option>
              <option value="natural">Original size</option>
            </select>
          </label>
          <label>
            Background position
            <select
              disabled={!theme.background.image}
              value={theme.background.position}
              onChange={(e) =>
                update({
                  background: {
                    ...theme.background,
                    position: e.target.value as Theme["background"]["position"],
                  },
                })
              }
            >
              {["center", "top", "bottom", "left", "right"].map((v) => (
                <option key={v} value={v}>
                  {v === "center" ? "Centre" : v[0].toUpperCase() + v.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Wallpaper scroll
            <select
              disabled={!theme.background.image}
              value={theme.background.attachment}
              onChange={(e) =>
                update({
                  background: {
                    ...theme.background,
                    attachment: e.target.value as "scroll" | "fixed",
                  },
                })
              }
            >
              <option value="scroll">Scroll with page</option>
              <option value="fixed">Fixed to viewport</option>
            </select>
          </label>
        </div>
        <p className="editor-hint">
          {!theme.background.image &&
            "Choose an image to enable sizing, position and scrolling. "}
          {theme.background.image?.animated &&
            !motionActive &&
            "Your motion preference currently hides this animated image. Choose a static image to preview the wallpaper. "}
          Background colour also supplies readable header/caption backplates.
          Image sizing, position and scroll settings affect wallpaper only. JPG,
          PNG, WebP or GIF · 512 KB each · 1 MB combined · max 4096 px. Files
          stay in this browser; nothing uploads to a server.
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <Palette size={16} /> Colours & participation
        </h3>
        <div className="editor-grid">
          {(["text", "links", "buttons", "borders", "accent"] as const).map(
            (k) => (
              <ColorInput
                key={k}
                label={
                  {
                    text: "Page & panel text",
                    links: "Links",
                    buttons: "Primary buttons",
                    borders: "Panel borders",
                    accent: "Decorative accents",
                  }[k]
                }
                value={theme.colors[k]}
                onChange={(v) =>
                  update({ colors: { ...theme.colors, [k]: v } })
                }
              />
            ),
          )}
        </div>
        {showModules && (
          <div className="participation-colour-control">
            <ColorInput
              label="Participation Colour"
              value={theme.participationColor}
              onChange={(participationColor) => update({ participationColor })}
            />
            <p className="editor-hint">
              Shared by the post composer and Army Chat only. Other panels keep
              their own colour. Text is protected automatically; current
              participation text:{" "}
              {readableColor(theme.colors.text, theme.participationColor)}.
            </p>
          </div>
        )}
        <p className="editor-hint">
          Readable text is protected automatically. Low-contrast text and link
          colours get a readable fallback in the preview.
          {corrected
            ? " Your current text or link colour needed a fallback."
            : ""}
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <Type size={16} /> Headings & personality
        </h3>
        <label>
          Heading & decorative font
          <select
            value={theme.font}
            onChange={(e) => update({ font: e.target.value as Theme["font"] })}
          >
            {Object.keys(fonts).map((k) => (
              <option key={k} value={k}>
                {fontLabels[k as keyof typeof fonts]}
              </option>
            ))}
          </select>
        </label>
        <p className="font-specimen" style={{ fontFamily: fonts[theme.font] }}>
          Dear diary,
          <br />
          my army gets me. ♥
        </p>
        <p className="editor-hint">
          Changes page headings and decorative copy. Author-styled sample posts
          retain their own lettering. Posting, chat, navigation and controls
          keep familiar interface fonts. Retro font stacks use the closest
          installed font.
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <LayoutPanelTop size={16} /> Shared panels
        </h3>
        <p className="editor-hint">
          Secondary panels, ordinary posts and board surfaces use this
          background. The composer and chat use Participation Colour.
          Author-styled sample posts keep their own paper and ink, while shared
          frame corners and borders still follow the Army.
        </p>
        <div className="editor-grid">
          <ColorInput
            label="Secondary panel background"
            value={theme.panels.color}
            onChange={(v) => update({ panels: { ...theme.panels, color: v } })}
          />
          <label>
            Panel corners
            <select
              value={theme.panels.corners}
              onChange={(e) =>
                update({
                  panels: {
                    ...theme.panels,
                    corners: e.target.value as Theme["panels"]["corners"],
                  },
                })
              }
            >
              <option value="original">Original</option>
              <option value="square">Sharp / square</option>
              <option value="round">Extra round</option>
              <option value="wonky">Gloriously wonky</option>
            </select>
          </label>
          <label>
            Panel border style
            <select
              value={theme.panels.border}
              onChange={(e) =>
                update({
                  panels: {
                    ...theme.panels,
                    border: e.target.value as Theme["panels"]["border"],
                  },
                })
              }
            >
              {["solid", "dashed", "dotted", "double"].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="range-label">
          Secondary panel opacity <span>{theme.panels.opacity}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={theme.panels.opacity}
            onChange={(e) =>
              update({
                panels: { ...theme.panels, opacity: Number(e.target.value) },
              })
            }
          />
        </label>
        <p className="editor-hint">
          {showModules
            ? "Affects decorative content panels, including events and announcements. Their text backplates stay opaque. The composer, chat, player, posts and boards remain opaque for reading. Panel corners and borders affect shared panel frames, not button shapes."
            : "Affects the fill of fan-profile content panels. Text backplates and controls stay opaque for reading. Panel corners and borders affect shared frames, not button shapes."}
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <Sparkles size={16} /> Stickers & motion
        </h3>
        <label>
          Original CSS sticker set
          <select
            value={theme.decorations.style}
            onChange={(e) =>
              update({
                decorations: {
                  ...theme.decorations,
                  style: e.target.value as Theme["decorations"]["style"],
                },
              })
            }
          >
            <option value="none">None (for now)</option>
            <option value="hearts">Hearts & love notes</option>
            <option value="stars">Stars & sparkles</option>
            <option value="flames">CSS flames & heat</option>
            <option value="butterflies">Butterflies & daydreams</option>
            <option value="pixels">Pixel bits</option>
          </select>
        </label>
        <label className="editor-check">
          <input
            type="checkbox"
            checked={theme.decorations.glitter}
            onChange={(e) =>
              update({
                decorations: {
                  ...theme.decorations,
                  glitter: e.target.checked,
                },
              })
            }
          />{" "}
          Add a little glitter
        </label>
        <label className="editor-check">
          <input
            type="checkbox"
            checked={theme.decorations.animated}
            onChange={(e) =>
              update({
                decorations: {
                  ...theme.decorations,
                  animated: e.target.checked,
                },
              })
            }
          />{" "}
          Animate decorations & uploaded GIFs
        </label>
        <p className="editor-hint">
          Reduced motion always wins. Pause controls hide animated uploads and
          freeze CSS decorations.
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <ImagePlus size={16} /> Header & profile image
        </h3>
        <AssetInput
          target="banner"
          label="Header image"
          asset={assetFor("banner")}
          busy={busy}
          upload={upload}
          remove={() => setAsset("banner", null)}
        />
        <AssetInput
          target="avatar"
          label="Profile image"
          asset={assetFor("avatar")}
          busy={busy}
          upload={upload}
          remove={() => setAsset("avatar", null)}
        />
        <p className="editor-hint">
          {showModules
            ? "The header image appears behind the Army identity card; the profile image changes its portrait. Open the main Army page to preview these when editing from the listening room or media pages."
            : "The header image changes your fan-profile banner; the profile image changes your portrait."}
        </p>
      </section>
      <details className="editor-section advanced-section">
        <summary>
          <Code size={16} /> Advanced styling · read-only
        </summary>
        <p>Structured tokens today. A scoped editor later.</p>
        <pre>{`--theme-bg: ${theme.background.color};\n--theme-accent: ${theme.colors.accent};\n--panel-opacity: ${theme.panels.opacity / 100};`}</pre>
        <p className="editor-hint">
          No HTML, JavaScript, remote asset URLs or free-form CSS is executed.
          Only validated profile settings reach the page.
        </p>
      </details>
      {(error || busy) && (
        <p
          className={`editor-upload-status ${error ? "is-error" : ""}`}
          role={error ? "alert" : "status"}
        >
          {error || "Reading and checking your image…"}
        </p>
      )}
    </fieldset>
  );
}
function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="color-input">
      {label}
      <span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <code>{value}</code>
      </span>
    </label>
  );
}
function AssetInput({
  target,
  label,
  asset,
  busy,
  upload,
  remove,
}: {
  target: AssetTarget;
  label: string;
  asset: ThemeAsset | null;
  busy: boolean;
  upload: (target: AssetTarget, file: File | undefined) => void;
  remove: () => void;
}) {
  return (
    <div className="asset-input">
      <label>
        <Upload size={15} />
        {label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={busy}
          onChange={(e) => {
            void upload(target, e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {asset && (
        <div className="asset-meta">
          <span>
            {asset.width}×{asset.height} · {Math.ceil(asset.bytes / 1024)} KB ·{" "}
            {asset.animated ? "Animated" : "Static"}
          </span>
          <button type="button" onClick={remove} disabled={busy}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export function ThemePresetPicker({
  theme,
  onChange,
  busy = false,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
  busy?: boolean;
}) {
  return (
    <div className="preset-grid">
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={theme.preset === p.id}
          className={`preset-button preset-${p.id}`}
          onClick={() =>
            onChange({
              ...structuredClone(p.theme),
              modules: { ...theme.modules },
            })
          }
          disabled={busy}
          style={{ "--preset-color": p.color } as CSSProperties}
        >
          <span>{p.symbol}</span>
          <b>{p.name}</b>
          <small>{p.line}</small>
        </button>
      ))}
    </div>
  );
}
