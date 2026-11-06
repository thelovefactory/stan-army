"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Heart,
  Users,
  MapPin,
  Maximize2,
  CalendarDays,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { ArmyView, armyPath, armyAddress } from "@/lib/data";
import { ArmyAnnouncements } from "./army-announcements";
import { DemoNote } from "./shell";
import { MusicPanel } from "./music-panel";
import { ArmyChat } from "./army-chat";
import { useDemo } from "./demo-provider";
import { ProfileTheme, useProfileTheme } from "./profile-theme";
export function ArmySpace({
  view,
  room = false,
}: {
  view: ArmyView;
  room?: boolean;
}) {
  return (
    <ProfileTheme
      profileId={`army:${view.army.id}`}
      legacyProfileId={`artist:${view.artist.slug}`}
      kind="army"
      name={`${view.artist.name}’s Army`}
      officialParticipation={view.artist.id === "artist-nova"}
    >
      <ArmySpaceContent view={view} room={room} />
    </ProfileTheme>
  );
}
function ArmySpaceContent({
  view,
  room = false,
}: {
  view: ArmyView;
  room?: boolean;
}) {
  const { artist, army, founder } = view;
  const { theme, visibleAsset } = useProfileTheme();
  const customBanner = visibleAsset(theme.images.banner);
  const customAvatar = visibleAsset(theme.images.avatar);
  const { enlisted, toggle } = useDemo();
  const isEnlisted = enlisted.includes(army.id);
  const [share, setShare] = useState("");
  const [liked, setLiked] = useState(false);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${armyPath(army)}`,
      );
      setShare("Demo army link copied.");
    } catch {
      setShare(`Copy this demo link from your address bar: ${armyPath(army)}`);
    }
  }
  if (room)
    return (
      <main id="main" className="container listening-page">
        <div className="room-heading">
          <div>
            <Link className="back-link" href={armyPath(army)}>
              <ArrowLeft size={15} /> Back to {artist.name}’s army
            </Link>
            <h1>
              The listening room<span>✳</span>
            </h1>
            <p>
              A fan-run room for {artist.name}. Your own playback. A little room
              to connect.
            </p>
          </div>
          <span className="demo-pill">LOCAL DEMO · NO LIVE MESSAGING</span>
        </div>
        <div className="listening-grid">
          <div>
            <MusicPanel wide />
            <div className="room-note">
              <HeadphoneArt />
              <div>
                <h2>Same love. Your own listen.</h2>
                <p>
                  Press play whenever you’re ready. This room doesn’t
                  synchronize playback or connect to other listeners.
                </p>
              </div>
            </div>
          </div>
          <ArmyChat view={view} focused />
        </div>
      </main>
    );
  return (
    <main id="main" className={`artist-page accent-${army.accent}`}>
      <div className="container">
        <div className="artist-breadcrumb">
          <Link href="/discover">
            <ArrowLeft size={14} /> Discover the armies
          </Link>
          <DemoNote compact />
        </div>
        <section className="artist-banner" aria-label={`${artist.name} banner`}>
          <Image
            src={customBanner || "/images/crowd.jpg"}
            unoptimized={!!customBanner}
            fill
            priority
            sizes="95vw"
            alt={
              customBanner
                ? "Locally selected custom artist banner"
                : "Festival crowd, licensed stock banner for this demo artist"
            }
          />
          <div className="banner-overlay" />
          <span className="banner-tag">
            THIS IS OUR LITTLE CORNER OF THE INTERNET.
          </span>
          <div className="banner-lettering">
            FEEL IT.
            <br />
            <i>TOGETHER.</i>
            <span>✳</span>
          </div>
          <span className="banner-sticker">
            STAY FOR
            <br />
            THE PEOPLE ↘
          </span>
          <span className="banner-caption">{artist.city.toUpperCase()} ↗</span>
        </section>
        <section className="artist-identity">
          <div className="identity-left">
            <div className="artist-avatar">
              <Image
                src={customAvatar || artist.image}
                unoptimized={!!customAvatar}
                fill
                sizes="120px"
                alt={
                  customAvatar
                    ? "Locally selected custom profile image"
                    : `Stock photo representing demo artist ${artist.name}`
                }
              />
            </div>
            <div>
              <p className="eyebrow">
                FANS RALLYING AROUND{" "}
                <span className="mint-text">{artist.genre.toUpperCase()}</span>
              </p>
              <h1>
                {artist.name}
                <span className="identity-star">✳</span>
              </h1>
              <p className="identity-meta">
                @{artist.officialHandle} <span>·</span> <MapPin size={13} />{" "}
                {artist.city}
              </p>
            </div>
          </div>
          <div className="identity-actions">
            <div className="enlist-count" aria-live="polite">
              <strong>
                {(army.count + (isEnlisted ? 1 : 0)).toLocaleString("en-GB")}
              </strong>
              <span>
                <Users size={12} /> demo stans & counting
              </span>
            </div>
            <button
              className={`button ${isEnlisted ? "button-mint" : "button-blue"}`}
              aria-pressed={isEnlisted}
              onClick={() => toggle(army.id)}
            >
              {isEnlisted ? <Check size={17} /> : <Heart size={17} />}{" "}
              {isEnlisted ? "Enlisted · demo" : "STAN · join demo"}
            </button>
            <button
              className="icon-button share-button"
              onClick={copyLink}
              aria-label="Enlist others: copy demo army link"
            >
              <Copy size={18} />
              <span className="share-text">Enlist others</span>
            </button>
          </div>
        </section>
        <section
          className="founder-spotlight"
          aria-label="Meet the founding stan"
        >
          <div className="founder-photo">
            <Image
              src={founder.image}
              width={66}
              height={66}
              alt="Stock portrait representing the fictional founding stan"
            />
          </div>
          <div>
            <p className="eyebrow">ONE FAN STARTED THIS. LOOK WHAT WE BUILT.</p>
            <h2>
              Founded by{" "}
              {founder.id === "fan-jess" ? (
                <Link href="/fans/jess-wav">@{founder.handle}</Link>
              ) : (
                <span>@{founder.handle}</span>
              )}{" "}
              <span>✳</span>
            </h2>
            <p>
              A fan-run Army for {artist.name}. The community stewards its own
              space.
            </p>
          </div>
          <div className="army-address">
            <b>{armyAddress(army)}</b>
            <span>Intended public address · local demo</span>
            <code>{armyPath(army)}</code>
          </div>
        </section>
        <p className="army-identity-note">
          Artist identity: @{artist.officialHandle} · Fan founder: @
          {founder.handle} · Army address: {armyAddress(army)}. These are
          separate identities. Official participation never transfers community
          ownership.
        </p>
        <div className="artist-about-row">
          <p>{artist.bio}</p>
          <span role="status" className="share-status">
            {share ||
              (isEnlisted
                ? "You’re in! This enlistment is local to your demo session."
                : "Independent sounds. A space for everyone.")}
          </span>
        </div>
        <div className="artist-section-nav">
          <a href="#army-room" className="active">
            The army <span>✳</span>
          </a>
          <a href="#artist-posts">From {artist.name.split(" ")[0]}</a>
          <a href="#events">Events & links</a>
          <Link className="room-link" href={`${armyPath(army)}/room`}>
            <Maximize2 size={14} /> Open listening room
          </Link>
        </div>
        <div id="army-room" className="army-grid">
          <div className="artist-left-column">
            <MusicPanel />
            <section className="panel faces-panel">
              <div className="panel-title">
                <h2>The people behind the plays</h2>
                <span className="mint-text">↗</span>
              </div>
              <div className="fan-faces">
                <Image
                  src="/images/sienna.jpg"
                  width={46}
                  height={46}
                  alt="Stock fan portrait"
                />
                <Image
                  src="/images/atlas.jpg"
                  width={46}
                  height={46}
                  alt="Stock fan portrait"
                />
                {["JW", "LL", "MT", "+"].map((t, i) => (
                  <span
                    key={t}
                    className={`fan-avatar fan-${["pink", "mint", "orange", "blue"][i]}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p>
                Different people. One shared obsession.
                <br />
                <span>Illustrative faces & fictional fans.</span>
              </p>
            </section>
          </div>
          <ArmyChat view={view} />
        </div>
        <section id="artist-posts" className="artist-post-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BUILT BY FANS. OPEN TO THE ARTIST.</p>
              <h2>The voices behind the Army.</h2>
            </div>
            <span className="micro-label">DEMO POSTS</span>
          </div>
          <ArmyAnnouncements view={view} />
          <div className="posts-grid community-posts">
            <article className="panel announcement">
              <p className="eyebrow">THE ARMY NOTICEBOARD · DEMO</p>
              <h3>
                Three songs.
                <br />
                One new friend.
              </h3>
              <p>
                This week’s fan challenge: send one of their songs to someone who needs
                it. Bring back the story, not a streaming screenshot. No
                targets, no fake plays. Just music finding people.
              </p>
              <div className="post-byline">
                <span>@{founder.handle} · Community post</span>
                <span>✳</span>
              </div>
            </article>
            <article className="panel photo-post">
              <div className="post-image">
                <Image
                  src="/images/room.jpg"
                  fill
                  sizes="(max-width:800px) 90vw, 35vw"
                  alt="A concert stage photographed from the audience"
                />
                <span>FROM THE STAGE</span>
              </div>
              <div className="post-body">
                <p>
                  Still thinking about this feeling. Nothing beats a room
                  singing back. See you at the next one. 🖤
                </p>
                <div className="post-byline">
                  <span>Fan photo diary · Demo</span>
                  <button
                    className="like-button"
                    aria-pressed={liked}
                    onClick={() => setLiked(!liked)}
                    aria-label={
                      liked ? "Remove demo reaction" : "Like demo post"
                    }
                  >
                    <Heart size={15} fill={liked ? "currentColor" : "none"} />{" "}
                    {42 + (liked ? 1 : 0)}
                  </button>
                </div>
              </div>
            </article>
            <aside id="events" className="panel events-panel">
              <div className="panel-title">
                <h2>
                  <CalendarDays size={17} /> Out in the world
                </h2>
              </div>
              <p className="micro-label">ILLUSTRATIVE EVENT · NOT BOOKABLE</p>
              <div className="event-entry">
                <div className="date-block">
                  <span>DEC</span>
                  <b>12</b>
                </div>
                <div>
                  <h3>Fan listening meetup</h3>
                  <p>{artist.city} · Fictional venue</p>
                  <span className="mint-text">
                    Fan-organised example · No artist appearance implied
                  </span>
                </div>
              </div>
              <div className="artist-links">
                <p className="micro-label">EXPLORE THE PLATFORMS</p>
                <a
                  href="https://bandcamp.com/discover"
                  target="_blank"
                  rel="noreferrer"
                >
                  Discover music on Bandcamp <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.youtube.com/@nprmusic"
                  target="_blank"
                  rel="noreferrer"
                >
                  NPR Music on YouTube <ArrowUpRight size={16} />
                </a>
                <p>Platform examples, not this fictional artist’s profiles.</p>
              </div>
            </aside>
          </div>
        </section>
        <section className="flames-concept panel">
          <span>✳</span>
          <div>
            <p className="eyebrow">FUTURE CONCEPT · NO PAYMENTS</p>
            <h2>FAN. THE FLAMES.</h2>
            <p>
              Fans can one day pool optional support for transparent, clearly
              labelled promotional campaigns. Organic discovery stays organic.
              No guaranteed streams, fake engagement or ownership for sale.
            </p>
          </div>
        </section>
        <div className="artist-bottom-note">
          <span>✳</span>
          <p>
            The artist brings the music.
            <br />
            <b>The fans bring the Army.</b>
          </p>
          <Link href="/create" className="text-link">
            Make a space of your own <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
function HeadphoneArt() {
  return (
    <span className="room-symbol" aria-hidden="true">
      ♫
    </span>
  );
}
