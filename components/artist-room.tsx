"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Heart,
  Headphones,
  MapPin,
  Share2,
  Expand,
  Minimize2,
  Pin,
  Send,
  ExternalLink,
  Music2,
  CalendarDays,
  Shirt,
  MessageCircle,
  Play,
} from "lucide-react";
import type { Artist } from "@/lib/artists";
import { DemoNotice } from "./chrome";

type Message = {
  id: number;
  user: string;
  text: string;
  time: string;
  colour: string;
};
const seedMessages: Message[] = [
  {
    id: 1,
    user: "jess.mp3",
    text: "That last chorus has been living in my head all week.",
    time: "20:41",
    colour: "pink",
  },
  {
    id: 2,
    user: "tom_2",
    text: "headphones on. rest of the world off. 🎧",
    time: "20:42",
    colour: "lavender",
  },
  {
    id: 3,
    user: "softsignal",
    text: "Anyone else find this room at exactly the right time?",
    time: "20:44",
    colour: "mint-bg",
  },
  {
    id: 4,
    user: "jess.mp3",
    text: "@softsignal yep. feels like home already ♡",
    time: "20:45",
    colour: "pink",
  },
];
export function ArtistRoom({ artist }: { artist: Artist }) {
  const [enlisted, setEnlisted] = useState(false),
    [focused, setFocused] = useState(false),
    [embed, setEmbed] = useState(false);
  const [messages, setMessages] = useState(seedMessages),
    [draft, setDraft] = useState(""),
    [notice, setNotice] = useState(""),
    [liked, setLiked] = useState(false);
  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    setMessages((m) => [
      ...m,
      { id: Date.now(), user: "you.demo", text, time, colour: "mint-bg" },
    ]);
    setDraft("");
    setNotice("Demo message added in this tab only.");
  }
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Room link copied. Invite your people.");
    } catch {
      setNotice(`Share this demo room: ${window.location.href}`);
    }
  }
  return (
    <main
      id="main"
      className={`container artist-page ${focused ? "room-focused" : ""}`}
      style={{ "--artist-accent": artist.accent } as React.CSSProperties}
    >
      <DemoNotice />
      <div className="room-breadcrumb">
        <Link href="/discover">Discovery</Link>
        <span>/</span>
        <span>{artist.name}’S ARMY</span>
      </div>
      <section className="artist-hero">
        <div className="artist-intro">
          <p className="eyebrow mint">
            THE STAN ARMY OF <span className="peach">{artist.tag}</span>
          </p>
          <h1>@{artist.name.replaceAll(" ", "")}</h1>
          <p className="artist-location">
            <MapPin size={15} />
            {artist.city}
            <span>•</span>
            {artist.genre}
          </p>
          <p className="artist-bio">{artist.bio}</p>
          <div className="artist-cta">
            <button
              className={`button ${enlisted ? "enlisted" : "primary"}`}
              aria-pressed={enlisted}
              onClick={() => {
                setEnlisted(!enlisted);
                setNotice(
                  enlisted
                    ? "You left the demo Army."
                    : "You’re in! Demo enlistment applies only in this tab.",
                );
              }}
            >
              <Heart size={18} fill={enlisted ? "currentColor" : "none"} />
              {enlisted ? "YOU’RE IN THE ARMY" : "STAN"}
            </button>
            <button className="button outline" onClick={share}>
              <Share2 size={16} /> ENLIST OTHERS
            </button>
          </div>
          <div className="community-count">
            <div className="avatar-stack">
              {["J", "T", "S", "K"].map((n, i) => (
                <span
                  key={n}
                  className={`avatar ${["pink", "lavender", "mint-bg", "peach-bg"][i]}`}
                >
                  {n}
                </span>
              ))}
            </div>
            <div>
              <strong>
                {(artist.stans + Number(enlisted)).toLocaleString("en-GB")}{" "}
                <span>stans & counting</span>
              </strong>
              <p>Sample community · enlisting is free</p>
            </div>
          </div>
        </div>
        <div className="artist-portrait">
          <img
            src={artist.image}
            alt={`Editorial portrait representing ${artist.name}, a fictional demo artist`}
          />
          <div className="portrait-overlay" />
          <span className="portrait-top">
            INDEPENDENT SOUND.
            <br />
            COLLECTIVE HEART.
          </span>
          <span className="portrait-name">
            {artist.name}
            <span>
              THE {artist.handle === "nova" ? "LATE NIGHT" : "LISTENING"} CLUB
            </span>
          </span>
          <span className="portrait-sticker">
            a space
            <br />
            for us ✳
          </span>
          <span className="demo-photo">DEMO ARTIST · EDITORIAL PHOTO</span>
        </div>
      </section>
      <div
        role="status"
        aria-live="polite"
        className={notice ? "action-notice" : "sr-only"}
      >
        {notice}
      </div>
      <div className="room-heading">
        <div>
          <p className="eyebrow mint">COME ON IN. STAY A WHILE.</p>
          <h2>
            The listening room<span className="mint">.</span>
          </h2>
        </div>
        <button
          className="button small outline"
          onClick={() => setFocused(!focused)}
          aria-pressed={focused}
        >
          {focused ? <Minimize2 size={16} /> : <Expand size={16} />}{" "}
          {focused ? "Full artist page" : "Focus room"}
        </button>
      </div>
      <section className="listening-grid" aria-label="Listening room">
        <div className="music-panel panel">
          <div className="panel-title">
            <span>
              <Headphones size={17} /> ON THE DECK
            </span>
            <span className="micro">LISTEN YOUR WAY</span>
          </div>
          <div className="record-art">
            <div className="record-type">
              AFTER
              <br />
              <em>HOURS</em>
              <span>THE COMMUNITY MIX</span>
            </div>
            <div className="vinyl">
              <div />
            </div>
            <span className="record-star">✳</span>
          </div>
          <div className="track-details">
            <div>
              <p className="eyebrow">A LITTLE INSPIRATION</p>
              <h3>Late-night listening</h3>
              <p>Curated mood · sample player</p>
            </div>
            <Music2 size={24} />
          </div>
          {embed ? (
            <iframe
              className="spotify-embed"
              title="Spotify sample track: Dreams by Fleetwood Mac"
              src="https://open.spotify.com/embed/track/0ofHAoxe9vBkTCp2UQIavz?utm_source=generator"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <button
              className="button player-button"
              onClick={() => setEmbed(true)}
            >
              <Play size={17} fill="currentColor" /> Load sample Spotify player
            </button>
          )}
          <p className="player-disclosure">
            A real provider embed, separate from this fictional artist. Loading
            connects to Spotify. Playback depends on your account and region; it
            isn’t synchronized.
          </p>
          <a
            className="provider-link"
            href="https://open.spotify.com/track/0ofHAoxe9vBkTCp2UQIavz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Listen on Spotify instead <ExternalLink size={13} />
          </a>
        </div>
        <div className="chat-panel panel">
          <div className="panel-title">
            <span>
              <MessageCircle size={17} /> ARMY CHAT
            </span>
            <span className="demo-tag">DEMO CONVERSATION</span>
          </div>
          <div className="pinned-message">
            <Pin size={16} />
            <div>
              <strong>A note from {artist.name}</strong>
              <p>
                This little corner is ours. Share what you’re listening to. Be
                kind. Make yourself at home. ♡
              </p>
            </div>
          </div>
          <div
            className="chat-messages"
            role="log"
            aria-label="Demo Army conversation"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div className="chat-message" key={m.id}>
                <span className={`avatar ${m.colour}`}>
                  {m.user[0].toUpperCase()}
                </span>
                <div>
                  <div className="message-meta">
                    <strong>@{m.user}</strong>
                    <time>{m.time}</time>
                  </div>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form className="chat-composer" onSubmit={send}>
            <label className="sr-only" htmlFor="chat-message">
              Your demo message
            </label>
            <input
              id="chat-message"
              maxLength={500}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Say something nice…"
              autoComplete="off"
            />
            <button
              className="send-button"
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send demo message"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="chat-footnote">
            Local preview only. Messages disappear when you leave or refresh.
          </p>
        </div>
      </section>
      <section className="artist-bottom">
        <div className="artist-feed">
          <div className="section-heading">
            <h2>From the artist</h2>
            <span className="micro">THE NOTES BETWEEN THE SONGS</span>
          </div>
          <article className="post panel">
            <div className="post-meta">
              <span className="avatar mint-bg">{artist.name[0]}</span>
              <div>
                <strong>{artist.name}</strong>
                <p>Sample post · 2 hours ago</p>
              </div>
              <span className="post-tag">ARTIST NOTE</span>
            </div>
            <h3>Made this one for the people who stay.</h3>
            <p>
              There’s a moment at the end of a show when everyone keeps singing,
              even after the music stops. That’s the feeling I’m chasing. Thanks
              for being part of it. More soon. ♡
            </p>
            <div className="post-bottom">
              <button
                className="reaction-button"
                aria-pressed={liked}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={17} fill={liked ? "currentColor" : "none"} />{" "}
                {86 + Number(liked)} <span>demo reactions</span>
              </button>
              <span>PUBLIC POST</span>
            </div>
          </article>
          <article className="exclusive-card">
            <span className="eyebrow">CLOSER TO THE PROCESS</span>
            <h3>
              Voice notes.
              <br />
              First takes. Happy accidents.
            </h3>
            <p>
              {enlisted
                ? "You’re enlisted in this demo. Exclusive content will arrive in a later milestone."
                : "A future home for enlisted-only posts. Enlist to try the demo state."}
            </p>
            <span className="outline-chip">EXCLUSIVES · COMING LATER</span>
          </article>
        </div>
        <aside className="artist-sidebar">
          <div className="panel event-card">
            <p className="eyebrow peach">
              <CalendarDays size={16} /> OUT IN THE WORLD
            </p>
            <h3>See you at the front.</h3>
            <p>
              Tour dates and ticket links will live here. Nothing scheduled for
              this demo.
            </p>
            <span className="outline-chip">NO UPCOMING EVENTS</span>
          </div>
          <div className="panel event-card">
            <p className="eyebrow mint">
              <Shirt size={16} /> WEAR YOUR HEART
            </p>
            <h3>A little piece of the Army.</h3>
            <p>An artist’s official merch shop can link out from here.</p>
            <span className="outline-chip">MERCH PREVIEW</span>
          </div>
          <p className="sidebar-note">
            No fake verified badges.
            <br />
            Just a fictional artist and a real idea.
          </p>
        </aside>
      </section>
    </main>
  );
}
