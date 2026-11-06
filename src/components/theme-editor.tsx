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
  fontLabels,
  fonts,
  MAX_ASSET_BYTES,
  MAX_TOTAL_ASSET_BYTES,
  presets,
  readableColor,
  Theme,
  ThemeAsset,
  validAsset,
} from "@/lib/theme";
import demoHeart from "@/lib/demo-heart.json";

type AssetTarget = "background" | "banner" | "avatar";
async function readImage(file: File): Promise<ThemeAsset> {
  if (
    !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
  )
    throw new Error(
      "Choose a JPG, PNG, WebP or GIF. SVG and other formats are not accepted.",
    );
  if (file.size > MAX_ASSET_BYTES)
    throw new Error("That image is too big. Maximum file size: 512 KB.");
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
  const dimensions = await new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      const image = new Image();
      image.onload = () =>
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () =>
        reject(new Error("That file is not a decodable image."));
      image.src = dataUrl;
    },
  );
  if (dimensions.width > 4096 || dimensions.height > 4096)
    throw new Error("Images must be 4096 × 4096 pixels or smaller.");
  const asset = validAsset({
    dataUrl,
    mime: file.type,
    bytes: file.size,
    ...dimensions,
    animated: false,
  });
  if (!asset)
    throw new Error("The file contents do not match a supported raster image.");
  return asset;
}
export function ThemeEditor({
  theme,
  onChange,
  onBusyChange,
}: {
  theme: Theme;
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
      <section className="editor-section">
        <h3>
          <Sparkles size={16} /> The grossness library
        </h3>
        <p>Six moods. Absolutely no taste police.</p>
        <ThemePresetPicker theme={theme} onChange={onChange} busy={busy} />
        <p className="editor-hint">
          Presets replace the current preview, including uploads. Cancel
          restores your saved theme.
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <Wallpaper size={16} /> Set the scene
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
            Image sizing
            <select
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
              <option value="natural">Original size / centre</option>
            </select>
          </label>
          <label>
            Position
            <select
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
            Scroll behaviour
            <select
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
          JPG, PNG, WebP or GIF · 512 KB each · 1 MB combined · max 4096 px.
          Files stay in this browser; nothing uploads to a server.
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <Palette size={16} /> Your colours, your call
        </h3>
        <div className="editor-grid">
          {(["text", "links", "buttons", "borders", "accent"] as const).map(
            (k) => (
              <ColorInput
                key={k}
                label={k[0].toUpperCase() + k.slice(1)}
                value={theme.colors[k]}
                onChange={(v) =>
                  update({ colors: { ...theme.colors, [k]: v } })
                }
              />
            ),
          )}
        </div>
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
          <Type size={16} /> Typographical crimes
        </h3>
        <label>
          Font collection
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
          System font stacks; retro fonts fall back to the closest installed
          option. Music, chat and controls keep readable interface fonts.
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <LayoutPanelTop size={16} /> Panel personality
        </h3>
        <div className="editor-grid">
          <ColorInput
            label="Panel background"
            value={theme.panels.color}
            onChange={(v) => update({ panels: { ...theme.panels, color: v } })}
          />
          <label>
            Corners
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
            Border style
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
          Panel opacity <span>{theme.panels.opacity}%</span>
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
          Chat, player and text backplates stay opaque so the army stays usable,
          even at 0% panel opacity.
        </p>
      </section>
      <section className="editor-section">
        <h3>
          <Sparkles size={16} /> More is more
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
          <ImagePlus size={16} /> Put a face to the feeling
        </h3>
        <AssetInput
          target="banner"
          label="Custom banner"
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
      </section>
      <section className="editor-section advanced-section">
        <h3>
          <Code size={16} /> Advanced CSS · a sneak peek
        </h3>
        <p>Structured tokens today. A scoped editor later.</p>
        <pre>{`--profile-background: ${theme.background.color};\n--profile-accent: ${theme.colors.accent};\n--panel-opacity: ${theme.panels.opacity / 100};`}</pre>
        <label>
          Custom CSS
          <textarea
            disabled
            placeholder="Arbitrary CSS is disabled in this prototype."
            rows={3}
          />
        </label>
        <p className="editor-hint">
          No HTML, JavaScript, remote asset URLs or free-form CSS is executed.
          Only validated profile settings reach the page.
        </p>
      </section>
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
          onClick={() => onChange(structuredClone(p.theme))}
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
