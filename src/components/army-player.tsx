"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  AudioLines,
  ListMusic,
  Maximize2,
  Minimize2,
  MonitorPlay,
  Music2,
  Paintbrush,
  Pause,
  Play,
  Repeat2,
  SkipBack,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  adjacentItem,
  formatTime,
  itemFor,
  playerItems,
  PlayerMode,
  safeSeek,
} from "@/lib/player";
import { playerSkins } from "@/lib/theme";
import { useProfileTheme } from "./profile-theme";
export function ArmyPlayer({
  wide = false,
  initialMode = "music",
  initialItemId,
}: {
  wide?: boolean;
  initialMode?: PlayerMode;
  initialItemId?: string;
}) {
  const {
    theme,
    clean,
    animationsEnabled,
    canEditCommunity,
    openPlayerEditor,
  } = useProfileTheme();
  const [selectedId, setSelectedId] = useState(
      itemFor(initialItemId || "", initialMode).id,
    ),
    [playing, setPlaying] = useState(false),
    [waiting, setWaiting] = useState(false),
    [expanded, setExpanded] = useState(wide),
    [queueOpen, setQueueOpen] = useState(wide),
    [embedLoaded, setEmbedLoaded] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [duration, setDuration] = useState(0),
    [volume, setVolume] = useState(0.55),
    [muted, setMuted] = useState(false),
    [repeat, setRepeat] = useState(false),
    [viz, setViz] = useState(true),
    [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null),
    video = useRef<HTMLVideoElement | null>(null);
  const uid = useId();
  const item = itemFor(selectedId),
    mode = item.mode;
  const skin = clean ? "minimal" : theme.playerSkin;
  const local = item.kind !== "embed";
  const queue = playerItems.filter((i) => i.mode === mode);
  const total = duration || item.seconds || 0;
  const attachAudio = useCallback((node: HTMLAudioElement | null) => {
    if (audio.current && audio.current !== node) audio.current.pause();
    audio.current = node;
  }, []);
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    if (video.current && video.current !== node) video.current.pause();
    video.current = node;
  }, []);
  useEffect(() => {
    if (!animationsEnabled) video.current?.pause();
  }, [animationsEnabled]);
  useEffect(() => {
    for (const media of [audio.current, video.current])
      if (media) {
        media.volume = volume;
        media.muted = muted;
      }
  }, [volume, muted]);
  function active() {
    return item.kind === "audio" ? audio.current : video.current;
  }
  function choose(id: string) {
    audio.current?.pause();
    video.current?.pause();
    setPlaying(false);
    setWaiting(false);
    setEmbedLoaded(false);
    setElapsed(0);
    setDuration(0);
    setError("");
    setSelectedId(id);
  }
  async function play() {
    if (!local) {
      setEmbedLoaded(!embedLoaded);
      return;
    }
    const media = active();
    if (!media) return;
    setError("");
    if (!media.paused) {
      media.pause();
      return;
    }
    media.volume = volume;
    media.muted = muted;
    try {
      await media.play();
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setPlaying(false);
      setWaiting(false);
      setError(
        "Playback could not start. Try Play again or use the source link.",
      );
    }
  }
  function stop() {
    const media = active();
    media?.pause();
    if (media) {
      try {
        media.currentTime = 0;
      } catch {}
    }
    setElapsed(0);
    setPlaying(false);
    setWaiting(false);
  }
  function metadata(media: HTMLMediaElement) {
    if (media !== active() || !local) return;
    setDuration(Number.isFinite(media.duration) ? media.duration : 0);
    media.volume = volume;
    media.muted = muted;
  }
  function seek(value: number) {
    const media = active();
    if (media && total > 0) {
      const time = safeSeek(value, total);
      try {
        media.currentTime = time;
        setElapsed(time);
      } catch {
        setError("Seeking is not ready yet. Press Play to load the media.");
      }
    }
  }
  const handlers = {
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLMediaElement>) =>
      metadata(e.currentTarget),
    onDurationChange: (e: React.SyntheticEvent<HTMLMediaElement>) =>
      metadata(e.currentTarget),
    onTimeUpdate: (e: React.SyntheticEvent<HTMLMediaElement>) =>
      e.currentTarget === active() && setElapsed(e.currentTarget.currentTime),
    onPlaying: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (e.currentTarget !== active() || !local) return;
      setPlaying(true);
      setWaiting(false);
    },
    onPause: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (e.currentTarget === active()) setPlaying(false);
    },
    onWaiting: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (e.currentTarget === active()) setWaiting(true);
    },
    onCanPlay: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (e.currentTarget === active()) setWaiting(false);
    },
    onEnded: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (e.currentTarget !== active() || !local) return;
      setPlaying(false);
      setWaiting(false);
    },
    onError: (e: React.SyntheticEvent<HTMLMediaElement>) => {
      if (e.currentTarget !== active() || !local) return;
      setPlaying(false);
      setWaiting(false);
      setError(
        "This demo file could not be loaded. Open the source link or select another item.",
      );
    },
  };
  return (
    <section
      id="army-player"
      className={`army-player player-skin-${skin} ${expanded ? "player-expanded" : ""} player-mode-${mode}`}
      aria-labelledby={`${uid}-heading`}
    >
      <div className="player-titlebar">
        <div>
          <span className="player-screw" aria-hidden="true" />
          <h2 id={`${uid}-heading`}>THE ARMY PLAYER</h2>
          <small>PERSONAL PLAYBACK · DEMO MEDIA</small>
        </div>
        <div className="player-window-buttons">
          {canEditCommunity && !clean ? (
            <button
              onClick={openPlayerEditor}
              aria-label="Customise and save the Army Player skin"
            >
              <Paintbrush size={13} />
              <span>{playerSkins[skin]}</span>
            </button>
          ) : (
            <span className="player-current-skin">{playerSkins[skin]}</span>
          )}
          <button
            onClick={() => {
              setQueueOpen(!expanded);
              setExpanded(!expanded);
            }}
            aria-expanded={expanded}
            aria-label={expanded ? "Compact player" : "Expand player"}
          >
            {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>
      <div className="player-body">
        <div className="player-mode-switch" aria-label="Media mode">
          <button
            aria-pressed={mode === "music"}
            onClick={() => {
              if (mode !== "music") choose(itemFor("", "music").id);
            }}
          >
            <Music2 size={14} /> MUSIC
          </button>
          <button
            aria-pressed={mode === "video"}
            onClick={() => {
              if (mode !== "video") choose(itemFor("", "video").id);
            }}
          >
            <MonitorPlay size={15} /> VIDEO
          </button>
          <span className="player-room-label">MAKE YOURSELF AT HOME. ♡</span>
        </div>
        <div className="player-deck">
          <div className="player-lcd">
            <div className="lcd-timer">
              <span>{local ? (playing && !waiting ? "▶" : "Ⅱ") : "↗"}</span>
              <strong>{local ? formatTime(elapsed) : "LINK"}</strong>
              <small>
                {local
                  ? item.kind === "audio"
                    ? "LOCAL AUDIO"
                    : "SILENT VIDEO"
                  : "PROVIDER PLAYER"}
              </small>
            </div>
            <div className="lcd-track">
              <span>
                {String(queue.findIndex((i) => i.id === item.id) + 1).padStart(
                  2,
                  "0",
                )}{" "}
                ·{" "}
                {mode === "music"
                  ? "ORIGINAL PROTOTYPE SKETCH"
                  : "VIDEO SELECTION"}
              </span>
              <h3>{item.title}</h3>
              <p>{item.by}</p>
            </div>
            <div
              className={`pixel-visualizer ${playing && !waiting && local && viz && animationsEnabled ? "pixels-dancing" : ""} ${!viz || clean ? "pixels-off" : ""}`}
              aria-hidden="true"
            >
              {Array.from({ length: 18 }, (_, i) => (
                <i
                  key={i}
                  style={
                    {
                      "--bar": i,
                      "--bar-height": `${14 + ((i * 17) % 43)}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>
          <div className="player-seek">
            <span>{local ? formatTime(elapsed) : "—"}</span>
            <label className="sr-only" htmlFor={`${uid}-seek`}>
              Seek within {item.title}
            </label>
            <input
              id={`${uid}-seek`}
              type="range"
              min="0"
              max={Math.max(total, 1)}
              step=".1"
              value={Math.min(elapsed, Math.max(total, 1))}
              disabled={!local || duration <= 0}
              onChange={(e) => seek(Number(e.target.value))}
            />
            <span>{local ? formatTime(total) : "—"}</span>
          </div>
          <div className="player-controls">
            <div className="transport">
              <button
                onClick={() => choose(adjacentItem(item.id, -1).id)}
                aria-label="Previous selection"
              >
                <SkipBack size={19} />
              </button>
              <button
                className="transport-play"
                onClick={play}
                aria-label={
                  !local
                    ? embedLoaded
                      ? "Unload YouTube player"
                      : "Load YouTube player"
                    : playing
                      ? "Pause"
                      : "Play"
                }
              >
                {!local ? (
                  embedLoaded ? (
                    <X size={22} />
                  ) : (
                    <Play size={22} />
                  )
                ) : playing ? (
                  <Pause size={22} />
                ) : (
                  <Play size={22} fill="currentColor" />
                )}
              </button>
              <button
                onClick={() => choose(adjacentItem(item.id, 1).id)}
                aria-label="Next selection"
              >
                <SkipForward size={19} />
              </button>
              <button
                onClick={stop}
                aria-label="Stop and rewind"
                disabled={!local}
              >
                <Square size={15} fill="currentColor" />
              </button>
            </div>
            <div className="volume-control">
              <button
                onClick={() => setMuted(!muted)}
                disabled={!local}
                aria-label={muted ? "Unmute" : "Mute"}
                aria-pressed={muted}
              >
                {muted || volume === 0 ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              <label className="sr-only" htmlFor={`${uid}-volume`}>
                Playback volume
              </label>
              <input
                id={`${uid}-volume`}
                type="range"
                min="0"
                max="1"
                step=".01"
                value={volume}
                disabled={!local}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
            <div className="deck-options">
              <button
                aria-pressed={repeat}
                disabled={!local}
                onClick={() => setRepeat(!repeat)}
                aria-label="Repeat current selection"
              >
                <Repeat2 size={17} />
              </button>
              <button
                aria-pressed={viz && skin !== "minimal"}
                disabled={skin === "minimal"}
                onClick={() => setViz(!viz)}
                aria-label="Toggle decorative pixel visualizer"
              >
                <AudioLines size={17} />
              </button>
              <button
                aria-expanded={queueOpen}
                onClick={() => setQueueOpen(!queueOpen)}
                aria-label="Show or hide selections"
              >
                <ListMusic size={18} />
              </button>
            </div>
          </div>
        </div>
        {mode === "video" && (
          <div className="army-video-surface">
            {item.kind === "video" ? (
              <>
                <video
                  ref={attachVideo}
                  src={item.src}
                  preload="metadata"
                  playsInline
                  loop={repeat}
                  {...handlers}
                  aria-label={item.title + " — original silent demo video"}
                />
                {!playing && (
                  <button className="video-center-play" onClick={play}>
                    <Play size={23} />
                    <span>Play local demo</span>
                  </button>
                )}
              </>
            ) : embedLoaded ? (
              <>
                <iframe
                  src={item.src}
                  title={item.title}
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
                <button
                  className="embed-unload"
                  onClick={() => setEmbedLoaded(false)}
                >
                  Unload YouTube <X size={13} />
                </button>
              </>
            ) : (
              <div className="embed-before-consent">
                <MonitorPlay size={34} />
                <h3>NPR Music · Tiny Desk</h3>
                <p>
                  YouTube loads only after your click. Use its own playback
                  controls. This is not Nova’s music.
                </p>
                <button onClick={() => setEmbedLoaded(true)}>
                  Load YouTube player <ArrowUpRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
        {queueOpen && (
          <div className="army-player-queue" aria-label={`${mode} selections`}>
            {queue.map((q, i) => (
              <button
                key={q.id}
                aria-pressed={q.id === item.id}
                onClick={() => choose(q.id)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{q.title}</b>
                  <small>
                    {q.kind === "embed"
                      ? "APPROVED PROVIDER EXAMPLE"
                      : q.kind === "audio"
                        ? "ORIGINAL DEMO AUDIO"
                        : "ORIGINAL SILENT STUDY"}
                  </small>
                </div>
                <span>{q.seconds ? formatTime(q.seconds) : "↗"}</span>
              </button>
            ))}
          </div>
        )}
        <div className="player-bottomline">
          <p role="status">
            {error ||
              (!local
                ? embedLoaded
                  ? "Provider controls handle play, pause, seek and volume."
                  : "External player unloaded. No third-party request yet."
                : waiting
                  ? "Loading local media…"
                  : playing
                    ? "Playing on your device."
                    : `Ready when you are. ${queue.length} ${mode} selections.`)}
          </p>
          <span>
            {!viz || !animationsEnabled || clean
              ? "VISUAL MOTION OFF"
              : "DECORATIVE PIXEL PULSE · NOT AUDIO ANALYSIS"}
          </span>
        </div>
        <div className="player-source">
          <p>{item.credit} Playback is individual, never synchronized.</p>
          <a href={item.source} target="_blank" rel="noreferrer">
            {item.kind === "embed"
              ? "Watch on YouTube"
              : "Open original demo file"}{" "}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <audio
        ref={attachAudio}
        src={item.kind === "audio" ? item.src : undefined}
        preload="metadata"
        loop={repeat}
        {...handlers}
      />
    </section>
  );
}
