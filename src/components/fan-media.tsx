"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Play,
  X,
} from "lucide-react";
import { ArmyView, armyPath } from "@/lib/data";
import { memories } from "@/lib/fan-space";
import { useDemo } from "./demo-provider";
import { ProfileTheme, useProfileTheme } from "./profile-theme";
import { ArmyModule } from "./army-module";
import { ArmyPlayer } from "./army-player";
import { MemoryVisual } from "./memory-visual";
export function FanMediaPreviews() {
  const { theme } = useProfileTheme();
  if (!theme.modules.gallery && !theme.modules.videos) return null;
  return (
    <section className="fan-media-previews">
      <ArmyModule name="gallery">
        <div className="memory-preview-heading">
          <div>
            <p className="eyebrow">WE KEEP THE LITTLE THINGS.</p>
            <h2>The communal shoebox.</h2>
          </div>
          <Link href="/armies/nova/gallery">
            Open the gallery <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="shoebox-preview">
          {memories.slice(0, 3).map((m) => (
            <Link key={m.id} href={`/armies/nova/gallery?memory=${m.id}`}>
              <MemoryVisual memoryId={m.id} />
              <span>{m.title}</span>
              <small>@{m.by} · demo</small>
            </Link>
          ))}
        </div>
      </ArmyModule>
      <ArmyModule name="videos">
        <Link className="video-shelf-preview" href="/armies/nova/videos">
          <span className="video-preview-play">
            <Play size={20} />
          </span>
          <div>
            <b>Someone stayed up making this.</b>
            <span>Fan video studies & a little after-hours creativity.</span>
          </div>
          <ArrowUpRight size={21} />
        </Link>
      </ArmyModule>
    </section>
  );
}
export function FanMediaPage({
  view,
  mode,
  initialMemory,
}: {
  view: ArmyView;
  mode: "gallery" | "videos";
  initialMemory?: string;
}) {
  return (
    <ProfileTheme
      profileId={`army:${view.army.id}`}
      legacyProfileId={`artist:${view.artist.slug}`}
      kind="army"
      galleryControls={mode === "gallery"}
      name={`${view.artist.name}’s Army`}
      officialParticipation
    >
      <main id="main" className="container media-page">
        <Link className="back-link" href={armyPath(view.army)}>
          <ArrowLeft size={15} /> Back to Nova’s Army
        </Link>
        <div className="media-page-heading">
          <p className="eyebrow">MADE, KEPT & SHARED BY THIS LITTLE CORNER.</p>
          <h1>
            {mode === "gallery" ? (
              <>
                The communal
                <br />
                <span>shoebox.</span>
              </>
            ) : (
              <>
                The after-hours
                <br />
                <span>video shelf.</span>
              </>
            )}
          </h1>
          <p>
            {mode === "gallery"
              ? "Blurry photos. Desk prints. Things too small to explain and too good to throw away."
              : "Little creative studies, made for the feeling of it. No algorithm required."}
          </p>
          <div className="media-tabs">
            <Link
              href="/armies/nova/gallery"
              aria-current={mode === "gallery" ? "page" : undefined}
            >
              Galleries & keepsakes
            </Link>
            <Link
              href="/armies/nova/videos"
              aria-current={mode === "videos" ? "page" : undefined}
            >
              Fan videos
            </Link>
          </div>
        </div>
        {mode === "gallery" ? (
          <ArmyModule name="gallery" fallback>
            <MemoryGallery initialMemory={initialMemory} />
          </ArmyModule>
        ) : (
          <ArmyModule name="videos" fallback>
            <FanVideos />
          </ArmyModule>
        )}
      </main>
    </ProfileTheme>
  );
}
function MemoryGallery({ initialMemory }: { initialMemory?: string }) {
  const [filter, setFilter] = useState("All"),
    [selected, setSelected] = useState<string | null>(
      initialMemory && memories.some((m) => m.id === initialMemory)
        ? initialMemory
        : null,
    );
  const dialog = useRef<HTMLDialogElement>(null);
  const { savedMemories, keepMemory } = useDemo();
  const active = memories.find((m) => m.id === selected);
  const filtered = memories.filter(
    (m) => filter === "All" || m.kind === filter,
  );
  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [selected]);
  function next(direction: number) {
    const index = memories.findIndex((m) => m.id === selected);
    setSelected(
      memories[(index + direction + memories.length) % memories.length].id,
    );
  }
  return (
    <>
      <div className="gallery-filter-bar">
        <div>
          {["All", "Photos", "Fan art", "Keepsakes"].map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <span>{savedMemories.length} kept on your local shelf</span>
      </div>
      <p className="living-demo-label">
        Fictional contributions. Photographs are licensed stock examples; prints
        and keepsakes are original prototype graphics. No real uploads.
      </p>
      <div className="memory-gallery-grid">
        {filtered.map((m) => (
          <button
            className="memory-card"
            key={m.id}
            onClick={() => setSelected(m.id)}
            aria-label={`Open ${m.title}`}
          >
            <MemoryVisual memoryId={m.id} />
            <span>{m.title}</span>
            <small>
              @{m.by} · {m.kind}
            </small>
          </button>
        ))}
      </div>
      <div className="shoebox-invitation">
        <span>♡</span>
        <div>
          <h2>One memory is enough to start a collection.</h2>
          <p>Your first note can be the thing somebody else remembers.</p>
        </div>
        <Link className="button" href="/armies/nova#fan-space">
          Leave your mark <ArrowUpRight size={17} />
        </Link>
      </div>
      <dialog
        className="memory-dialog"
        ref={dialog}
        onClose={() => setSelected(null)}
        aria-label={active?.title || "Community memory"}
      >
        {active && (
          <>
            <div className="memory-dialog-bar">
              <span>{active.kind} · Demo memory</span>
              <button
                onClick={() => dialog.current?.close()}
                aria-label="Close memory"
              >
                <X size={22} />
              </button>
            </div>
            <MemoryVisual memoryId={active.id} />
            <div className="memory-dialog-copy">
              <h2>{active.title}</h2>
              <p>Shared by @{active.by}</p>
              <p>{active.caption}</p>
              <div>
                <button onClick={() => next(-1)} aria-label="Previous memory">
                  <ArrowLeft size={19} />
                </button>
                <button
                  aria-pressed={savedMemories.includes(active.id)}
                  onClick={() => keepMemory(active.id)}
                >
                  <Bookmark
                    size={16}
                    fill={
                      savedMemories.includes(active.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {savedMemories.includes(active.id)
                    ? "Kept for this visit"
                    : "Keep on my local shelf"}
                </button>
                <button onClick={() => next(1)} aria-label="Next memory">
                  <ArrowRight size={19} />
                </button>
              </div>
              <p className="memory-shelf-status" role="status">
                {savedMemories.includes(active.id)
                  ? "Saved in memory for this browser session. Refresh clears your shelf."
                  : "No account or real upload is involved."}
              </p>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
function FanVideos() {
  return (
    <>
      <p className="living-demo-label">
        Original silent local demo films, not Nova performances or real fan
        uploads. Press play yourself; nothing autoplays.
      </p>
      <ArmyPlayer initialMode="video" wide />
      <div className="video-letter">
        <span>To the first person who makes something here:</span>
        <h2>
          It doesn’t have to go viral.
          <br />
          <em>It just has to mean something.</em>
        </h2>
        <p>
          Concert clips, covers, reactions and edits belong in this future shelf
          when they can be shared with the right permissions. For now, these
          original motion studies let you try the experience without borrowing
          someone else’s performance.
        </p>
        <Link className="text-link" href="/armies/nova#fan-space">
          Tell us what you’d make <ArrowUpRight size={17} />
        </Link>
      </div>
    </>
  );
}
