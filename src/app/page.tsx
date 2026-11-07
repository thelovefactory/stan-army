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
export const metadata = {
  title: "Stan for the things you love.",
  description:
    "The culture brings us together. The stans keep us fed. Create your Army or find your Army.",
};
export default function Home() {
  return (
    <main id="main">
      <section className="container landing-hero">
        <div className="hero-copy">
          <h1>
            Stan for the
            <br />
            things you <span className="love-word">love.</span>
          </h1>
          <div className="hero-description">
            <h2>The culture brings us together.</h2>
            <h2>The stans keep us fed.</h2>
          </div>
          <div className="hero-actions">
            <Link href="/create" className="button button-blue">
              Create your Army <ArrowUpRight size={19} />
            </Link>
            <Link href="/discover" className="text-link">
              Find your Army <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero-community">
            <div className="avatar-stack">
              <Image src="/images/sienna.jpg" width={34} height={34} alt="" />
              <Image src="/images/atlas.jpg" width={34} height={34} alt="" />
              <Image src="/images/artist.jpg" width={34} height={34} alt="" />
            </div>
            <p>
              For the stans. Built by the stans.
              <small>A first look at a new kind of community.</small>
            </p>
          </div>
        </div>
        <div className="hero-collage welcome-collage">
          <Image
            src="/brand/stan-army-welcome-sneaks.png"
            width={1448}
            height={1086}
            priority
            sizes="(max-width: 800px) 94vw, 58vw"
            alt="Cut-out collage labelled s/brie, s/popmusic and s/sneaks: Brie cheese, a fictional music fan and purple sneakers, with a blue frame and mint doodles."
          />
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
          Create your Army <ArrowUpRight size={20} />
        </Link>
      </section>
    </main>
  );
}
