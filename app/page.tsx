import Link from "next/link";
import {
  Heart,
  Headphones,
  MessageCircle,
  Sparkles,
  Disc3,
} from "lucide-react";
import { ArtistCard } from "@/components/artist-card";
import { artists } from "@/lib/artists";
export default function Home() {
  return (
    <main id="main">
      <section className="landing-hero container">
        <div className="hero-copy">
          <p className="eyebrow mint">
            <span className="tiny-star">✳</span> YOUR NEXT FAVOURITE PLACE ON
            THE INTERNET
          </p>
          <h1>
            Every artist
            <br />
            needs an <span className="gradient-text">army.</span>
          </h1>
          <p className="hero-description">
            The heartbeat of every artist is their community.
            <br className="desktop-break" /> Find your people. Turn it up. Be
            part of the story.
          </p>
          <div className="button-row">
            <Link href="/create" className="button primary">
              Create Your Army <Sparkles size={18} />
            </Link>
            <Link href="/discover" className="button outline">
              Find Your Artist
            </Link>
          </div>
          <p className="little-note">
            A little old-school internet. A whole new connection.
          </p>
        </div>
        <div className="hero-collage">
          <div className="orbit-label">MUSIC IS BETTER TOGETHER</div>
          <div className="collage-photo">
            <img
              src="/images/nova.jpg"
              alt="Editorial portrait representing demo artist Nova"
            />
            <span className="collage-name">
              NOVA<span>Alternative R&B / London</span>
            </span>
          </div>
          <span className="sticker sticker-hello">
            your people
            <br />
            are here ♡
          </span>
          <div className="mini-chat">
            <span className="avatar lavender">J</span>
            <div>
              <strong>@jess.mp3</strong>
              <p>this feels like finding my people.</p>
            </div>
            <Heart size={18} fill="#e8a9da" color="#e8a9da" />
          </div>
          <div className="collage-disc">
            <Disc3 size={67} strokeWidth={1} />
            <span>
              SOUND ON.
              <br />
              WORLD OFF.
            </span>
          </div>
          <span className="scribble-star">✧</span>
        </div>
      </section>
      <div className="manifesto-strip">
        <span>LESS SCROLLING. MORE CONNECTION.</span>
        <span>✳</span>
        <span>FANS, NOT FOLLOWERS.</span>
        <span>✳</span>
        <span>YOUR MUSIC. YOUR PEOPLE.</span>
        <span>✳</span>
        <span>EVERY ARTIST NEEDS AN ARMY.</span>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow mint">GOOD MUSIC TRAVELS THROUGH PEOPLE</p>
            <h2>
              Find your next obsession<span className="mint">.</span>
            </h2>
          </div>
          <Link href="/discover" className="text-link">
            Explore discovery
          </Link>
        </div>
        <div className="artist-grid">
          {artists.slice(0, 3).map((artist) => (
            <ArtistCard key={artist.handle} artist={artist} />
          ))}
        </div>
        <p className="subtle">
          A few fictional artists to help you explore the prototype.
        </p>
      </section>
      <section className="container community-section">
        <div>
          <p className="eyebrow peach">
            A CORNER OF THE INTERNET THAT FEELS LIKE YOU
          </p>
          <h2>
            It’s not my space.
            <br />
            It’s <span className="gradient-text">yours and theirs.</span>
          </h2>
        </div>
        <div className="feature-list">
          {[
            {
              icon: Headphones,
              title: "Come for the music.",
              text: "Discover artists and listen through the platforms you already love.",
            },
            {
              icon: MessageCircle,
              title: "Stay for your people.",
              text: "An Army room for the deep cuts, the big feelings, and the “you had to be there.”",
            },
            {
              icon: Heart,
              title: "Be more than a follower.",
              text: "Enlist free. Get closer to the artists and communities that mean something.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="feature">
              <Icon size={25} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container cta-panel">
        <p className="eyebrow">INDEPENDENT SPIRIT. COLLECTIVE ENERGY.</p>
        <h2>
          Your sound.
          <br />
          Your world. Your army.
        </h2>
        <Link className="button dark-button" href="/create">
          Create Your Army <Sparkles size={18} />
        </Link>
        <p>Explore the creation wizard. No account needed for this demo.</p>
      </section>
    </main>
  );
}
