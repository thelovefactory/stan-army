"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Headphones, Users } from "lucide-react";
import { ProfileTheme, useProfileTheme } from "./profile-theme";
import { useDemo } from "./demo-provider";
import { artists } from "@/lib/data";
import { ArtistCard } from "./artist-card";
export function FanProfile() {
  return (
    <ProfileTheme profileId="fan:jess-wav" kind="fan" name="Jess.wav">
      <FanProfileContent />
    </ProfileTheme>
  );
}
function FanProfileContent() {
  const { theme, visibleAsset } = useProfileTheme();
  const { enlisted } = useDemo();
  const banner = visibleAsset(theme.images.banner);
  const avatar = visibleAsset(theme.images.avatar);
  const joined = artists.filter((a) => enlisted.includes(a.slug));
  return (
    <main id="main" className="container fan-profile">
      <div className="fan-profile-banner">
        <Image
          src={banner || "/images/crowd.jpg"}
          unoptimized={!!banner}
          fill
          priority
          sizes="90vw"
          alt={
            banner
              ? "Locally selected fan banner"
              : "Licensed festival crowd photograph"
          }
        />
        <div />
        <span>
          LOUD MUSIC.
          <br />
          <i>SOFT HEART.</i>
        </span>
        <b>♥</b>
      </div>
      <section className="fan-profile-header">
        <div className="fan-portrait">
          <Image
            src={avatar || "/images/sienna.jpg"}
            unoptimized={!!avatar}
            fill
            sizes="110px"
            alt={
              avatar
                ? "Locally selected fan image"
                : "Stock portrait representing fictional fan Jess"
            }
          />
        </div>
        <div>
          <p className="eyebrow">FAN SPACE · FICTIONAL DEMO PROFILE</p>
          <h1>
            Jess.wav <span>♡</span>
          </h1>
          <p>@jess.wav · Bristol, UK · Here for the B-sides</p>
        </div>
        <span className="fan-status">
          ♫ Probably listening to something sad.
        </span>
      </section>
      <div className="fan-intro-grid">
        <section className="panel fan-bio">
          <p className="eyebrow">ABOUT THIS LITTLE HUMAN</p>
          <h2>
            I make playlists
            <br />
            instead of small talk.
          </h2>
          <p>
            Front-row feelings. Bedroom dancing. The person who sends you a song
            and says “this made me think of you”. Welcome to my corner.
          </p>
          <span className="fan-mood">
            MOOD: emotionally attached to the bridge ♡
          </span>
        </section>
        <aside className="panel fan-scrapbook">
          <p className="eyebrow">THE DIGITAL NOTICEBOARD</p>
          <div>
            <span>
              MY TOP 8<br />
              IS A FEELING.
            </span>
            <b>★</b>
            <span>
              SAVE THE
              <br />
              B-SIDES ♡
            </span>
          </div>
          <p>
            Personal imagery, decorative stickers, and a whole lot of
            personality. Hit Customise to try the same editor used by artists.
          </p>
        </aside>
      </div>
      <section className="fan-favourites">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <Headphones size={13} /> ALWAYS IN ROTATION
            </p>
            <h2>My forever favourites.</h2>
          </div>
          <span className="micro-label">SEEDED DEMO FAVOURITES</span>
        </div>
        <div className="artist-grid">
          {artists.slice(0, 3).map((a, i) => (
            <ArtistCard artist={a} index={i} key={a.slug} />
          ))}
        </div>
      </section>
      <section className="panel fan-enlistments">
        <div className="panel-title">
          <h2>
            <Users size={18} /> My enlisted armies
          </h2>
          <span className="demo-pill">SESSION DEMO</span>
        </div>
        <p>
          Armies you join with STAN during this visit appear here. These
          memberships still reset on refresh; only saved visual themes persist.
        </p>
        {joined.length ? (
          <ul>
            {joined.map((a) => (
              <li key={a.slug}>
                <Link href={`/artists/${a.slug}`}>
                  <Heart size={16} />
                  <span>
                    {a.name}
                    <small>@{a.handle}</small>
                  </span>
                  <ArrowUpRight size={18} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="fan-empty">
            <p>Your local army list is waiting for its first obsession.</p>
            <Link className="button button-blue" href="/discover">
              Find your people <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
