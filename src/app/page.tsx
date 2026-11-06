import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Headphones,
  MessageCircle,
  Heart,
} from "lucide-react";
import { ArmyCard } from "@/components/artist-card";
import { DemoNote } from "@/components/shell";
import { armies, armyView } from "@/lib/data";
export default function Home() {
  return (
    <main id="main">
      <section className="container landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="mint-dot" /> FOR THE MUSIC. FOR THE PEOPLE.
          </p>
          <h1>
            Every artist
            <br />
            needs an
            <br />
            <span className="army-word">
              army
              <svg viewBox="0 0 390 18" aria-hidden="true">
                <path d="M4 13 Q180 -3 380 8 M30 17 Q220 3 360 14" />
              </svg>
            </span>
            <span className="period">.</span>
          </h1>
          <p className="hero-description">
            The songs bring us together.
            <br />
            The fans bring it to life.
          </p>
          <p className="hero-support">
            Fans start the Army. Fans run it. The artist is who we rally around.
          </p>
          <div className="hero-actions">
            <Link href="/create" className="button button-blue">
              Create your army <ArrowUpRight size={19} />
            </Link>
            <Link href="/discover" className="text-link">
              Find your artist <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero-community">
            <div className="avatar-stack">
              <Image src="/images/sienna.jpg" width={34} height={34} alt="" />
              <Image src="/images/atlas.jpg" width={34} height={34} alt="" />
              <span>✳</span>
            </div>
            <p>
              Less scrolling. More belonging.
              <small>A first look at a new kind of music community.</small>
            </p>
          </div>
        </div>
        <div className="hero-collage">
          <div className="collage-back" />
          <div className="hero-image">
            <Image
              src="/images/artist.jpg"
              fill
              priority
              sizes="(max-width: 900px) 90vw, 48vw"
              alt="Licensed stock portrait representing fictional demo artist Nova Reign"
            />
            <div className="photo-shade" />
            <span className="image-caption">
              FIND YOUR NEXT
              <br />
              <b>“I was here first.”</b>
            </span>
            <Link href="/armies/nova" className="photo-artist">
              <span>
                <small>MEET NOVA’S FAN-RUN ARMY</small>
                <strong>Nova Reign</strong>
                <span>Alternative R&B · Bristol</span>
              </span>
              <span className="round-arrow">
                <ArrowUpRight />
              </span>
            </Link>
          </div>
          <span className="sticker sticker-orange">
            GOOD MUSIC.
            <br />
            GREAT PEOPLE.
          </span>
          <div className="floating-chat">
            <span className="chat-icon">
              <MessageCircle size={19} />
            </span>
            <div>
              <b>More than a comment section.</b>
              <span>A whole army in your corner.</span>
            </div>
            <span className="spark">✳</span>
          </div>
          <div className="little-sticker">
            YOUR PEOPLE
            <br />
            <b>ARE HERE ↗</b>
          </div>
        </div>
      </section>
      <div className="ticker" aria-label="Listen. Connect. Belong.">
        <div>
          <span>LISTEN TOGETHER</span>
          <b>✳</b>
          <span>FIND YOUR PEOPLE</span>
          <b>✳</b>
          <span>BACK YOUR ARTISTS</span>
          <b>✳</b>
          <span>MAKE SOME NOISE</span>
          <b>✳</b>
        </div>
      </div>
      <section className="container explore-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SMALL DISCOVERIES. BIG FEELINGS.</p>
            <h2>
              Your next obsession
              <br />
              has a home here.
            </h2>
          </div>
          <Link href="/discover" className="text-link">
            Explore the armies <ArrowUpRight size={19} />
          </Link>
        </div>
        <DemoNote />{" "}
        <div className="artist-grid">
          {armies.slice(0, 3).map((a, i) => (
            <ArmyCard view={armyView(a)} index={i} key={a.id} />
          ))}
        </div>
      </section>
      <section className="container belonging-section">
        <div className="belonging-photo">
          <Image
            src="/images/crowd.jpg"
            fill
            sizes="(max-width: 800px) 90vw, 45vw"
            alt="A festival crowd with hands raised"
          />
          <span>
            THE BEST PART?
            <br />
            <b>YOU’RE PART OF IT.</b>
          </span>
        </div>
        <div className="belonging-copy">
          <p className="eyebrow">A LITTLE OLD INTERNET. A WHOLE NEW ENERGY.</p>
          <h2>
            It’s not my space.
            <br />
            It’s yours.
            <br />
            <span>And theirs.</span>
          </h2>
          <p>
            A place that feels like your artist. A room full of people who get
            it. No disappearing into the feed.
          </p>
          <div className="feature-row">
            <Headphones />
            <span>Listen, discover, repeat.</span>
          </div>
          <div className="feature-row">
            <MessageCircle />
            <span>Conversation at the heart of every army.</span>
          </div>
          <div className="feature-row">
            <Heart />
            <span>Show up for the artists you love.</span>
          </div>
          <Link href="/armies/nova" className="button">
            Step inside a demo army <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container final-cta">
        <span className="big-asterisk">✳</span>
        <div>
          <p className="eyebrow">ONE FAN CAN START SOMETHING.</p>
          <h2>
            Their music.
            <br />
            Your people. Your army.
          </h2>
        </div>
        <Link href="/create" className="button button-blue">
          Create your army <ArrowUpRight size={20} />
        </Link>
      </section>
    </main>
  );
}
