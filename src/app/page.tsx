import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, ChevronRight } from "lucide-react";
import { StanStarIcon } from "@/components/stan-icons";
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
      <div
        className="ticker"
        aria-label="Find your people. Back your obsessions. Make some noise."
      >
        <div>
          <span>Find your people</span>
          <StanStarIcon size={26} />
          <span>Back your obsessions</span>
          <StanStarIcon size={26} />
          <span>Make some noise</span>
          <StanStarIcon size={26} />
        </div>
      </div>
      <section className="container explore-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DIFFERENT OBSESSIONS. STAN ENERGY.</p>
            <h2>There&apos;s an Army for that.</h2>
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
          <h2>
            It&apos;s not my space.
            <br />
            <span>It&apos;s ours.</span>
          </h2>
          <p>
            Find your people, share what you love, and make a little corner of
            the internet your own.
          </p>
          <div className="feature-row">
            <StanStarIcon size={22} />
            <span>
              <strong>Make it yours.</strong> Every Army has its own look, feel
              and personality.
            </span>
          </div>
          <div className="feature-row">
            <StanStarIcon size={22} />
            <span>
              <strong>Find your people.</strong> Real conversations, shared
              obsessions and opinions.
            </span>
          </div>
          <div className="feature-row">
            <StanStarIcon size={22} />
            <span>
              <strong>Keep the internet weird.</strong> From princesses to
              parmesan. If you love it, there&apos;s an army for it.
            </span>
          </div>
          <Link href="/create" className="button">
            Create your army <ChevronRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container final-cta">
        <span className="big-asterisk">✳</span>
        <div>
          <p className="eyebrow">ONE STAN CAN START AN ARMY.</p>
          <h2>What&apos;s your obsession?</h2>
        </div>
        <div className="final-cta-actions">
          <Link href="/create" className="button button-blue">
            Create your army <ArrowUpRight size={20} />
          </Link>
          <Link href="/discover" className="text-link">
            Find your army <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
