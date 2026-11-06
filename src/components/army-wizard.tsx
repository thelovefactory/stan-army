"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import {
  artists,
  artistIdentityKey,
  armyForArtist,
  armyPath,
  currentFan,
  ArmyDraft,
  initialArmyDraft,
  suggestedAddress,
  validateArmyDraft,
} from "@/lib/data";
import { defaultTheme, Theme } from "@/lib/theme";
import { ThemePresetPicker } from "./theme-editor";
import { ProfileTheme } from "./profile-theme";
const steps = [
  "Pick your artist",
  "Your Army address",
  "Make it yours",
  "Rally the fans",
];
export function ArmyWizard({ prefill = "" }: { prefill?: string }) {
  const [step, setStep] = useState(0),
    [complete, setComplete] = useState(false),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState<ArmyDraft>({
    ...initialArmyDraft,
    artistName: prefill,
  });
  const [theme, setTheme] = useState<Theme>(structuredClone(defaultTheme));
  const heading = useRef<HTMLHeadingElement>(null);
  const selected =
    artists.find((a) => a.id === draft.artistId) ||
    artists.find(
      (a) => artistIdentityKey(a.name) === artistIdentityKey(draft.artistName),
    );
  const existing = selected && armyForArtist(selected.id);
  const suggestions = artists.filter(
    (a) =>
      !draft.artistName.trim() ||
      a.name.toLowerCase().includes(draft.artistName.trim().toLowerCase()),
  );
  function update(change: Partial<ArmyDraft>) {
    setDraft((d) => ({ ...d, ...change }));
    setError("");
  }
  function move(s: number) {
    setStep(s);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const problem = validateArmyDraft(
      { ...draft, artistId: selected?.id || "" },
      step,
    );
    if (problem) {
      setError(problem);
      return;
    }
    if (step === 0 && !draft.address)
      update({ address: suggestedAddress(draft.artistName) });
    if (step < 3) move(step + 1);
    else {
      for (let s = 0; s < 3; s++) {
        const issue = validateArmyDraft(
          { ...draft, artistId: selected?.id || "" },
          s,
        );
        if (issue) {
          move(s);
          setError(issue);
          return;
        }
      }
      setComplete(true);
      requestAnimationFrame(() => heading.current?.focus());
    }
  }
  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(
        `Preview only — ${draft.address}.stan.army is an intended address, not a live invite. ${currentFan.name} is starting a fan-run Army for ${draft.artistName}.`,
      );
      setCopied(true);
    } catch {
      setError(
        "Clipboard unavailable. The intended address shown below is preview text, not a live invite.",
      );
    }
  }
  return (
    <main id="main" className="container wizard-page">
      <div className="wizard-heading">
        <p className="eyebrow">ONE FAN CAN START SOMETHING.</p>
        <h1>
          Every Army starts
          <br />
          with <span>one stan.</span>
        </h1>
        <p>
          You bring the love. The artist doesn’t need to sign up, approve or
          pay.
        </p>
      </div>
      <div className="wizard-founder">
        <Image
          src={currentFan.image}
          width={42}
          height={42}
          alt="Stock portrait for fictional founding fan Jess"
        />
        <p>
          Starting as <b>@{currentFan.handle}</b>
          <span>
            Your fan identity stays yours. It never becomes the artist’s
            identity.
          </span>
        </p>
        <span className="demo-pill">FICTIONAL FAN ACCOUNT</span>
      </div>
      <div className="wizard-layout">
        <aside className="wizard-sidebar">
          <ol>
            {steps.map((label, i) => (
              <li
                key={label}
                className={step === i ? "current" : step > i ? "done" : ""}
              >
                <span>
                  {step > i ? (
                    <Check size={15} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <div>
                  <small>STEP {i + 1}</small>
                  <b>{label}</b>
                </div>
              </li>
            ))}
          </ol>
          <div className="wizard-sidebar-note">
            <span>✳</span>
            <h3>
              The fans build it.
              <br />
              The artist inspires it.
            </h3>
            <p>
              One canonical Army per artist. A local preview never reserves a
              public address or publishes a community.
            </p>
            <Link className="text-link" href="/official-access">
              Are you the artist? Request official access ↗
            </Link>
          </div>
        </aside>
        <form className="panel wizard-form" onSubmit={submit} noValidate>
          <div className="wizard-step-meta">
            <span className="micro-label">
              {complete ? "LOCAL PREVIEW READY" : `STEP 0${step + 1} OF 04`}
            </span>
            <span className="demo-pill">FAN-LED · DEMO ONLY</span>
          </div>
          <h2 ref={heading} tabIndex={-1}>
            {complete
              ? "Your rallying point is ready."
              : step === 0
                ? "Who are we rallying around?"
                : step === 1
                  ? "Give your Army an address."
                  : step === 2
                    ? "Make a home for your people."
                    : "Let’s rally the first fans."}
          </h2>
          <p className="wizard-description">
            {step === 0
              ? "Find an artist first. If their Army already exists, join it. If it doesn’t, you could be the founding stan."
              : step === 1
                ? "An Army address identifies the community. It is separate from your fan handle and the artist’s official identity."
                : step === 2
                  ? "Pick an initial theme, choose imagery and write a welcome in your own voice. The shared visual editor can take your full demo Army further."
                  : "Fan-run, fan-built, and clearly labelled. This local preview does not create a public Army or a working invite."}
          </p>
          {!complete && step === 0 && (
            <div className="form-fields">
              <label htmlFor="army-artist">
                Artist name <span>Required</span>
              </label>
              <input
                id="army-artist"
                maxLength={80}
                value={draft.artistName}
                onChange={(e) =>
                  update({ artistName: e.target.value, artistId: "" })
                }
                placeholder="Search or add an artist…"
              />
              <div
                className="artist-search-options"
                aria-label="Seeded artist matches"
              >
                {suggestions.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    aria-pressed={selected?.id === a.id}
                    onClick={() =>
                      update({ artistId: a.id, artistName: a.name })
                    }
                  >
                    <span>
                      <b>{a.name}</b>
                      <small>
                        {a.genre} · {a.city}
                      </small>
                    </span>
                    <span>
                      {armyForArtist(a.id)
                        ? "Army exists ↗"
                        : "Start their Army +"}
                    </span>
                  </button>
                ))}
              </div>
              {existing ? (
                <div className="existing-army-callout">
                  <h3>This artist already has an Army.</h3>
                  <p>One artist, one canonical community. Come help it grow.</p>
                  <Link
                    className="button button-blue"
                    href={armyPath(existing)}
                  >
                    Visit & enlist <ArrowUpRight size={16} />
                  </Link>
                </div>
              ) : (
                !selected && (
                  <>
                    <label htmlFor="artist-context">
                      Help us distinguish this artist{" "}
                      <span>Required for unlisted artists</span>
                    </label>
                    <textarea
                      id="artist-context"
                      maxLength={500}
                      rows={3}
                      value={draft.artistContext}
                      onChange={(e) =>
                        update({ artistContext: e.target.value })
                      }
                      placeholder="Genre, city, an official catalogue link, or another distinguishing detail."
                    />
                    <p className="input-help">
                      Unlisted identities would need conflict review before a
                      public canonical Army is established. This demo checks
                      seeded matches only.
                    </p>
                  </>
                )
              )}
            </div>
          )}
          {!complete && step === 1 && (
            <div className="form-fields">
              <label htmlFor="army-address">
                Army subdomain <span>Required</span>
              </label>
              <div className="handle-input army-subdomain-input">
                <input
                  id="army-address"
                  value={draft.address}
                  maxLength={63}
                  onChange={(e) =>
                    update({ address: e.target.value.toLowerCase() })
                  }
                />
                <span>.stan.army</span>
              </div>
              <p className="input-help">
                1–63 lowercase letters, numbers and internal hyphens. Reserved
                and seeded conflicts are checked locally. No public availability
                check or reservation.
              </p>
              <div className="identity-separation">
                <p>
                  <b>Artist:</b> {draft.artistName}
                </p>
                <p>
                  <b>Founding fan:</b> @{currentFan.handle}
                </p>
                <p>
                  <b>Intended Army address:</b> {draft.address || "your-army"}
                  .stan.army
                </p>
              </div>
            </div>
          )}
          {!complete && step === 2 && (
            <div className="form-fields">
              <label htmlFor="army-welcome">
                Welcome your fellow stans <span>Required</span>
              </label>
              <textarea
                id="army-welcome"
                rows={4}
                maxLength={500}
                value={draft.welcome}
                onChange={(e) => update({ welcome: e.target.value })}
                placeholder="I started this Army because…"
              />
              <p className="input-help">
                {draft.welcome.length}/500 · Write as yourself, not as the
                artist.
              </p>
              <label htmlFor="army-music-link">
                A public music link <span>Optional</span>
              </label>
              <input
                type="url"
                id="army-music-link"
                value={draft.musicLink}
                onChange={(e) => update({ musicLink: e.target.value })}
                maxLength={500}
                placeholder="https://…"
              />
              <p className="input-help">
                A permitted public music/video or catalogue link. It stays a
                link in this preview; nothing is scraped or hosted.
              </p>
              <fieldset>
                <legend>Pick a starting image</legend>
                <div className="image-options">
                  {[
                    "/images/room.jpg",
                    "/images/crowd.jpg",
                    "/images/artist.jpg",
                    "/images/sienna.jpg",
                  ].map((src, i) => (
                    <label key={src}>
                      <input
                        type="radio"
                        name="army-image"
                        checked={draft.image === src}
                        onChange={() => update({ image: src })}
                      />
                      <Image
                        src={src}
                        width={100}
                        height={90}
                        alt={`Licensed stock starting image ${i + 1}`}
                      />
                      {draft.image === src && (
                        <span>
                          <Check size={15} />
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="wizard-theme-picker">
                <h3>Your Army’s first mood</h3>
                <ThemePresetPicker theme={theme} onChange={setTheme} />
                <p className="input-help">
                  The same six-preset theme engine used by Army and fan
                  customisation. Preview below; full local file/GIF and colour
                  controls remain in the demo Army editor.
                </p>
              </div>
            </div>
          )}
          {(step >= 2 || complete) && (
            <ProfileTheme
              profileId="preview:army-wizard"
              kind="army"
              name={draft.artistName}
              previewTheme={theme}
            >
              <section className="panel wizard-pivot-preview">
                <div className="preview-banner">
                  <Image
                    src={draft.image}
                    fill
                    sizes="(max-width:800px) 80vw, 55vw"
                    alt="Licensed stock image for this local Army preview"
                  />
                  <span>BUILT BY FANS. FOR THE PEOPLE WHO GET IT.</span>
                </div>
                <div className="preview-body">
                  <p className="micro-label">FAN-RUN ARMY · LOCAL PREVIEW</p>
                  <h3>
                    {draft.artistName}’s Army <span>✳</span>
                  </h3>
                  <p>
                    {draft.address}.stan.army{" "}
                    <small>· Intended address only</small>
                  </p>
                  <p>
                    Founded by <b>@{currentFan.handle}</b>
                  </p>
                  <p>
                    {draft.welcome ||
                      "Your welcome will appear here as you type."}
                  </p>
                  {draft.musicLink && !validateArmyDraft(draft, 2) && (
                    <a
                      className="preview-external"
                      href={draft.musicLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Start listening ↗
                    </a>
                  )}
                  <p className="input-help">
                    Community stewardship is not ownership of the artist’s name,
                    music or IP.
                  </p>
                </div>
              </section>
            </ProfileTheme>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {!complete ? (
            <div className="wizard-actions">
              {step > 0 ? (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => move(step - 1)}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <Link href="/discover" className="text-link">
                  Back to discovery
                </Link>
              )}
              <button
                type="submit"
                className="button button-blue"
                disabled={step === 0 && !!existing}
              >
                {step === 3 ? "Create demo preview" : "Keep going"}{" "}
                {step === 3 ? <Check size={16} /> : <ArrowRight size={16} />}
              </button>
            </div>
          ) : (
            <div className="wizard-finished">
              <p role="status">
                <Check size={16} /> Local preview complete. No Army, account,
                public address or live invite has been created.
              </p>
              <div>
                <button type="button" className="button" onClick={copyInvite}>
                  {copied
                    ? "Preview invite text copied"
                    : "Copy preview invite text"}
                </button>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setComplete(false);
                    move(0);
                  }}
                >
                  Edit preview
                </button>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setComplete(false);
                    setCopied(false);
                    setDraft({ ...initialArmyDraft });
                    setTheme(structuredClone(defaultTheme));
                    move(0);
                  }}
                >
                  Start again
                </button>
                <Link className="text-link" href="/armies/nova">
                  Explore Nova’s full fan-run demo <Heart size={15} />
                </Link>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
