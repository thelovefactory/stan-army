"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, ImagePlus, Sparkles, Headphones } from "lucide-react";
import { safeMusicUrl, validHandle } from "@/lib/demo.mjs";
type Draft = {
  name: string;
  handle: string;
  bio: string;
  genre: string;
  link: string;
  image: string;
};
const steps = ["Your identity", "Your world", "Your sound", "Take a look"];
export function CreateWizard() {
  const [step, setStep] = useState(0),
    [error, setError] = useState(""),
    [complete, setComplete] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    name: "",
    handle: "",
    bio: "",
    genre: "Alternative R&B",
    link: "",
    image: "",
  });
  const title = useRef<HTMLHeadingElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrl = useRef("");
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );
  function update(key: keyof Draft, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
    setError("");
  }
  function move(next: number) {
    setStep(next);
    setError("");
    setTimeout(() => title.current?.focus(), 0);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (step === 0 && (!draft.name.trim() || !validHandle(draft.handle))) {
      setError(
        "Add your artist name and a handle of 3–24 lowercase letters, numbers or hyphens. Start with a letter or number.",
      );
      return;
    }
    if (step === 2 && !safeMusicUrl(draft.link)) {
      setError(
        "Use an HTTPS Spotify, YouTube, SoundCloud, Apple Music or Bandcamp link, or leave it blank.",
      );
      return;
    }
    if (step === 3) {
      setComplete(true);
    } else move(step + 1);
  }
  function loadImage(file?: File) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP image smaller than 5 MB.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    update("image", objectUrl.current);
  }
  return (
    <div className="wizard-layout">
      <div className="wizard-main">
        <ol className="wizard-steps">
          {steps.map((s, i) => (
            <li
              key={s}
              className={i === step ? "current" : i < step ? "done" : ""}
              aria-current={i === step ? "step" : undefined}
            >
              <span>{i < step ? <Check size={15} /> : i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        {complete ? (
          <div className="wizard-complete">
            <Sparkles size={38} />
            <h2>Your world is taking shape.</h2>
            <p>
              This is your local demo preview. Nothing has been published or
              saved to a server.
            </p>
            <div className="button-row">
              <button
                className="button primary"
                onClick={() => {
                  setComplete(false);
                  move(0);
                }}
              >
                Keep editing
              </button>
              <Link className="button outline" href="/army/nova">
                Explore a full demo room
              </Link>
            </div>
          </div>
        ) : (
          <form className="wizard-form" onSubmit={submit} noValidate>
            <p className="eyebrow mint">
              {step + 1} OF 4 · {steps[step].toUpperCase()}
            </p>
            <h2 ref={title} tabIndex={-1}>
              {
                [
                  "First, what do we call you?",
                  "Make yourself at home.",
                  "Give them something to feel.",
                  "This is your corner.",
                ][step]
              }
            </h2>
            <p className="form-description">
              {
                [
                  "An artist name. A little personality. The beginning of your Army.",
                  "Bring the personality. This is a space that should feel like you.",
                  "Connect your music. Your tracks stay with their official providers.",
                  "Looking good? Finish your demo preview, or go back and make it yours.",
                ][step]
              }
            </p>
            {step === 0 && (
              <>
                <label>
                  Artist name
                  <input
                    autoComplete="organization"
                    value={draft.name}
                    onChange={(e) => update("name", e.target.value)}
                    maxLength={60}
                    placeholder="e.g. NOVA"
                    required
                  />
                </label>
                <label>
                  Your handle
                  <div className="handle-input">
                    <span>stan.army/army/</span>
                    <input
                      value={draft.handle}
                      onChange={(e) =>
                        update("handle", e.target.value.toLowerCase())
                      }
                      maxLength={24}
                      placeholder="your-name"
                      required
                      aria-describedby="handle-help"
                    />
                  </div>
                </label>
                <p className="field-help" id="handle-help">
                  3–24 lowercase letters, numbers or hyphens. Availability isn’t
                  checked in this demo.
                </p>
              </>
            )}
            {step === 1 && (
              <>
                <label>
                  Artist photo <span className="optional">optional</span>
                  <div className="upload-field">
                    <ImagePlus size={25} />
                    <span>Choose a photo · JPG, PNG, WebP · up to 5 MB</span>
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => loadImage(e.target.files?.[0])}
                    />
                  </div>
                </label>
                <label>
                  A little about you
                  <textarea
                    value={draft.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    maxLength={300}
                    placeholder="The sound. The story. The feeling."
                    rows={4}
                  />
                </label>
                <label>
                  Your sound
                  <select
                    value={draft.genre}
                    onChange={(e) => update("genre", e.target.value)}
                  >
                    {[
                      "Alternative R&B",
                      "Indie rock",
                      "Electronic",
                      "Soul",
                      "Pop",
                      "Hip-hop",
                      "Something else",
                    ].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            {step === 2 && (
              <>
                <label>
                  A music or video link{" "}
                  <span className="optional">optional</span>
                  <input
                    type="url"
                    value={draft.link}
                    onChange={(e) => update("link", e.target.value)}
                    placeholder="https://open.spotify.com/artist/…"
                  />
                </label>
                <p className="field-help">
                  Spotify, YouTube, SoundCloud, Apple Music or Bandcamp. This
                  preview validates the provider, not the catalogue item.
                </p>
                <div className="form-callout">
                  <Headphones size={23} />
                  <p>
                    Your music stays yours. Embeds and link cards depend on each
                    provider’s support. No uploads or playback are enabled here.
                  </p>
                </div>
              </>
            )}
            {step === 3 && (
              <div className="review-summary">
                <p>
                  <strong>Name</strong>
                  {draft.name}
                </p>
                <p>
                  <strong>Handle</strong>@{draft.handle}
                </p>
                <p>
                  <strong>Sound</strong>
                  {draft.genre}
                </p>
                <p>
                  <strong>Music link</strong>
                  {draft.link || "Not added yet"}
                </p>
                <p>
                  No account, server upload or public page will be created.
                  Refreshing clears this draft.
                </p>
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="wizard-buttons">
              {step > 0 && (
                <button
                  type="button"
                  className="button outline"
                  onClick={() => move(step - 1)}
                >
                  Back
                </button>
              )}
              <button type="submit" className="button primary">
                {step === 3 ? "Finish demo preview" : "Continue"}
                {step === 3 && <Sparkles size={17} />}
              </button>
            </div>
          </form>
        )}
      </div>
      <aside className="wizard-preview">
        <p className="eyebrow">YOUR ARMY, TAKING SHAPE</p>
        <div className="preview-portrait">
          {draft.image ? (
            <img src={draft.image} alt="Your selected artist photo" />
          ) : (
            <div className="preview-placeholder">
              <span>✳</span>
              <p>Your sound belongs here.</p>
            </div>
          )}
          <span className="preview-badge">LOCAL PREVIEW</span>
        </div>
        <div className="preview-content">
          <p className="eyebrow mint">THE STAN ARMY OF</p>
          <h3>@{draft.handle || "yourname"}</h3>
          <p>
            {draft.name || "Your artist name"} <span> / </span> {draft.genre}
          </p>
          <p>
            {draft.bio ||
              "A little space for your sound and the people who get it."}
          </p>
          <span className="button primary preview-stan">♡ STAN</span>
          <p className="micro">THE FIRST STAN COULD BE ANYONE.</p>
        </div>
      </aside>
    </div>
  );
}
