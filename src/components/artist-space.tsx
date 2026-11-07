"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Heart,
  Users,
  MapPin,
  CalendarDays,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { ArmyView, armyPath, armyAddress } from "@/lib/data";
import { LivingFanSpace, OrbitFans } from "./living-fan-space";
import { ArmyAnnouncements } from "./army-announcements";
import { MusicPanel } from "./music-panel";
import { SidebarPlaylist } from "./sidebar-playlist";
import { DiscussionBoard } from "./discussion-board";
import { StanStarIcon } from "./stan-icons";
import { ArmyModule } from "./army-module";
import { ArmyChat } from "./army-chat";
import { OutsideArmy } from "./outside-army";
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
      compactControls={view.army.id === "army-nova" && !room}
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
  const isNova = army.id === "army-nova";
  const { theme, visibleAsset } = useProfileTheme();
  const customBanner = visibleAsset(theme.images.banner);
  const customAvatar = visibleAsset(theme.images.avatar);
  const { enlisted, toggle } = useDemo();
  const isEnlisted = enlisted.includes(army.id);
  const members = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function close(event: PointerEvent) {
      if (
        members.current?.open &&
        !members.current.contains(event.target as Node)
      )
        members.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && members.current?.open) {
        members.current.open = false;
        members.current.querySelector("summary")?.focus();
      }
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
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
            <ArmyModule name="playlist" fallback>
              <MusicPanel wide />
            </ArmyModule>
            <ArmyModule name="playlist">
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
            </ArmyModule>
          </div>
          <ArmyModule name="chat" fallback>
            <ArmyChat view={view} focused />
          </ArmyModule>
        </div>
      </main>
    );
  return (
    <main
      id="main"
      className={`artist-page accent-${army.accent} ${isNova ? "living-army turn-up-army" : ""}`}
    >
      <div className="container">
        {!isNova && (
          <>
            <section
              className="artist-banner"
              aria-label={`${artist.name} banner`}
            >
              <Image
                src={
                  customBanner || (isNova ? artist.image : "/images/crowd.jpg")
                }
                unoptimized={!!customBanner}
                fill
                priority
                sizes="95vw"
                alt={
                  customBanner
                    ? "Locally selected custom artist banner"
                    : "Licensed stock photograph representing this fictional artist"
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
              <span className="banner-caption">
                {artist.city.toUpperCase()} ↗
              </span>
            </section>
          </>
        )}
        <section
          className={`artist-identity ${isNova ? "nova-identity-compact" : ""} ${customBanner ? "has-custom-banner" : ""}`}
          style={
            isNova && customBanner
              ? {
                  backgroundImage: `linear-gradient(90deg,${theme.background.color}8c,${theme.background.color}66),url("${customBanner}")`,
                }
              : undefined
          }
        >
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
                {isNova ? "NOVA’S ARMY · FAN-RUN" : "FANS RALLYING AROUND"}{" "}
                <span className="mint-text">{artist.genre.toUpperCase()}</span>
              </p>
              <h1>
                {artist.name}
                <span className="identity-star">
                  <StanStarIcon size={24} />
                </span>
              </h1>
              <p className="identity-meta">
                @{artist.officialHandle} <span>·</span> <MapPin size={13} />{" "}
                {artist.city}
              </p>
              <p className="army-creator-credit">
                Army by{" "}
                {founder.id === "fan-jess" ? (
                  <Link href="/fans/jess-wav">@{founder.handle}</Link>
                ) : (
                  <span>@{founder.handle}</span>
                )}
                <span className="identity-demo-label">Demo Army</span>
              </p>
            </div>
          </div>
          <div className="identity-actions">
            {isNova ? (
              <details className="member-dropdown" ref={members}>
                <summary
                  className="enlist-count"
                  aria-label="View Army members"
                >
                  <strong>
                    {(army.count + (isEnlisted ? 1 : 0)).toLocaleString(
                      "en-GB",
                    )}
                  </strong>
                  <span>
                    <Users size={12} /> demo stans · view members
                  </span>
                </summary>
                <div className="member-popover">
                  <OrbitFans />
                </div>
              </details>
            ) : (
              <div className="enlist-count" aria-live="polite">
                <strong>
                  {(army.count + (isEnlisted ? 1 : 0)).toLocaleString("en-GB")}
                </strong>
                <span>
                  <Users size={12} /> demo stans & counting
                </span>
              </div>
            )}

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
        {!isNova && (
          <div className="army-address-strip">
            <span>FAN-RUN · FAN-MADE</span>
            <b>{armyAddress(army)}</b>
            <small>Intended address · local prototype</small>
          </div>
        )}
        {!isNova && (
          <div className="artist-about-row">
            <p>{artist.bio}</p>
            <span role="status" className="share-status">
              {share ||
                (isEnlisted
                  ? "You’re in! This enlistment is local to your demo session."
                  : "Independent sounds. A space for everyone.")}
            </span>
          </div>
        )}
        {isNova && (
          <p className="sr-only" role="status">
            {share}
          </p>
        )}
        {isNova ? (
          <div
            className={`living-layout ${theme.modules.playlist || theme.modules.chat || theme.modules.outside || theme.modules.events ? "" : "modules-no-sidebar"}`}
          >
            <div className="living-primary">
              <ArmyModule name="feed">
                <LivingFanSpace armyId={army.id} />
              </ArmyModule>
              {(theme.modules.feed || theme.modules.videos) && (
                <nav className="feed-more-links" aria-label="More Army posts">
                  {theme.modules.feed && (
                    <Link href="/armies/nova/posts">
                      View all posts <ArrowUpRight size={15} />
                    </Link>
                  )}
                  {theme.modules.videos && (
                    <Link href="/armies/nova/videos">
                      Videos <ArrowUpRight size={14} />
                    </Link>
                  )}
                </nav>
              )}
              <ArmyModule name="announcements">
                <details className="army-voices-fold" id="artist-posts">
                  <summary>
                    <span>
                      From the Army <b>♡</b>
                    </span>
                    <span>
                      From the Artist <b>✳</b>
                    </span>
                    <small>Two distinct voices. Open their notes ↘</small>
                  </summary>
                  <ArmyAnnouncements view={view} />
                </details>
              </ArmyModule>
            </div>
            <div className="living-sidebar">
              <div className="sidebar-player">
                <ArmyModule name="playlist">
                  <SidebarPlaylist armySlug={army.slug} />
                </ArmyModule>
              </div>
              <div id="army-room">
                <ArmyModule name="chat">
                  <ArmyChat view={view} />
                </ArmyModule>
              </div>
              <ArmyModule name="outside">
                <OutsideArmy armyId={army.id} />
              </ArmyModule>
              <ArmyModule name="events">
                <aside id="events" className="panel events-panel">
                  <div className="panel-title">
                    <h2>
                      <CalendarDays size={17} /> Out in the world
                    </h2>
                  </div>
                  <p className="micro-label">
                    ILLUSTRATIVE EVENT · NOT BOOKABLE
                  </p>
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
                    <p>
                      Platform examples, not this fictional artist’s profiles.
                    </p>
                  </div>
                </aside>
              </ArmyModule>
            </div>
          </div>
        ) : (
          <>
            {" "}
            <div id="army-room" className="army-grid">
              <div className="artist-left-column">
                <ArmyModule name="playlist">
                  <SidebarPlaylist armySlug={army.slug} />
                  <MusicPanel />
                </ArmyModule>
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
              <ArmyModule name="chat">
                <ArmyChat view={view} />
              </ArmyModule>
              <ArmyModule name="outside">
                <OutsideArmy armyId={army.id} />
              </ArmyModule>
            </div>
            <section id="artist-posts" className="artist-post-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">BUILT BY FANS. OPEN TO THE ARTIST.</p>
                  <h2>The voices behind the Army.</h2>
                </div>
                <span className="micro-label">DEMO POSTS</span>
              </div>
              <ArmyModule name="announcements">
                <ArmyAnnouncements view={view} />
              </ArmyModule>
              <div className="posts-grid community-posts">
                <ArmyModule name="feed">
                  <article className="panel announcement">
                    <p className="eyebrow">THE ARMY NOTICEBOARD · DEMO</p>
                    <h3>
                      Three songs.
                      <br />
                      One new friend.
                    </h3>
                    <p>
                      This week’s fan challenge: send one of their songs to
                      someone who needs it. Bring back the story, not a
                      streaming screenshot. No targets, no fake plays. Just
                      music finding people.
                    </p>
                    <div className="post-byline">
                      <span>@{founder.handle} · Community post</span>
                      <span>✳</span>
                    </div>
                  </article>
                </ArmyModule>
                <ArmyModule name="feed">
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
                          <Heart
                            size={15}
                            fill={liked ? "currentColor" : "none"}
                          />{" "}
                          {42 + (liked ? 1 : 0)}
                        </button>
                      </div>
                    </div>
                  </article>
                </ArmyModule>
                <ArmyModule name="events">
                  <aside id="events" className="panel events-panel">
                    <div className="panel-title">
                      <h2>
                        <CalendarDays size={17} /> Out in the world
                      </h2>
                    </div>
                    <p className="micro-label">
                      ILLUSTRATIVE EVENT · NOT BOOKABLE
                    </p>
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
                      <p>
                        Platform examples, not this fictional artist’s profiles.
                      </p>
                    </div>
                  </aside>
                </ArmyModule>
              </div>
            </section>
          </>
        )}
        <ArmyModule name="discussions">
          <DiscussionBoard key={army.id} boardId={`s/${army.slug}`} />
        </ArmyModule>
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
