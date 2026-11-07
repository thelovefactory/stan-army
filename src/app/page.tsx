import { ObsessionStrip } from "@/components/obsession-strip";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { StanStarIcon } from "@/components/stan-icons";
import { ArmyCard } from "@/components/artist-card";
import { armies, armyView } from "@/lib/data";
export const metadata = {
  title: "Stan for something.",
  description:
    "Unapologetically human. Slightly obsessive. Utterly yours. Build your Army around anything you love.",
};
export default function Home() {
  return (
    <main id="main" className="landing-page">
      <section className="container landing-hero">
        <div className="hero-copy">
          <h1>
            Stan for
            <br />
            <span className="love-word">something.</span>
          </h1>
          <div className="hero-description">
            <p>Unapologetically human. Slightly obsessive. Utterly yours.</p>
          </div>
          <div className="hero-actions">
            <Link href="/create" className="button button-blue">
              <span>
                Build your Army today <ArrowRight size={19} />
              </span>
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
            <p className="eyebrow">02 / TRENDING</p>
            <h2>The troops are gathering.</h2>
          </div>
          <Link href="/discover" className="text-link">
            Enlist in your next obsession <ArrowRight size={19} />
          </Link>
        </div>
        <p className="demo-note">
          <span className="demo-dot" /> DEMO SPACE · Sample communities and
          counts, not live trends.
        </p>
        <div className="artist-grid">
          <ArmyCard
            view={armyView(armies.find((a) => a.slug === "nova")!)}
            boardLabel="s/nova"
          />
          {[
            {
              slug: "brie",
              name: "Brie",
              category: "Cultured behaviour",
              description: "Soft centre. Strong following.",
              image: "/images/brie.jpg",
              alt: "Slices of Brie cheese on a dark slate board",
              accent: "orange",
            },
            {
              slug: "sneaks",
              name: "Sneakers",
              category: "Sole mates",
              description: "For the pairs you can't stop thinking about.",
              image: "/images/sneakers.jpg",
              alt: "A red sneaker against a bright red background",
              accent: "pink",
            },
          ].map((example, i) => (
            <div key={example.slug}>
              <Link
                href="/create"
                className={`artist-card accent-${example.accent}`}
                aria-label={`Start an Army like ${example.name}`}
              >
                <div className="card-photo">
                  <Image
                    src={example.image}
                    fill
                    sizes="(max-width: 600px) 92vw, (max-width: 900px) 45vw, 30vw"
                    alt={example.alt}
                  />
                  <span className="card-category">
                    {example.category} · Fan-run
                  </span>
                  <span className="card-number">0{i + 2}</span>
                  <span className="card-arrow">
                    <ArrowUpRight size={21} />
                  </span>
                </div>
                <div className="card-details">
                  <div>
                    <p className="featured-board-label">s/{example.slug}</p>
                    <h3>{example.name}</h3>
                    <p>{example.description}</p>
                    <p>Concept Army · Start one like this ↗</p>
                  </div>
                </div>
              </Link>
              {example.slug === "brie" && (
                <p className="featured-photo-credit">
                  Photo:{" "}
                  <a href="https://commons.wikimedia.org/wiki/File:Brie_01.jpg">
                    Coyau / Wikimedia Commons
                  </a>{" "}
                  ·{" "}
                  <a href="https://creativecommons.org/licenses/by-sa/3.0/">
                    CC BY-SA 3.0
                  </a>
                </p>
              )}
            </div>
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
              <strong>Keep the internet weird.</strong> From pop-stars to
              pop-tarts. If you love it, there&apos;s an Army for it.
            </span>
          </div>
          <div className="belonging-actions">
            <Link href="/create" className="button">
              <span>
                Build your Army <ArrowRight size={18} />
              </span>
            </Link>
            <Link href="/discover" className="text-link">
              Find your Army <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <ObsessionStrip />
    </main>
  );
}
