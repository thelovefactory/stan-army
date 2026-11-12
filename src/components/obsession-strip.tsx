"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const frames = [
  { id: "sneakers", focus: "50% 46%", mobileFocus: "54% 50%" },
  { id: "cheese", focus: "50% 32%", mobileFocus: "44% 50%" },
  { id: "tv", focus: "50% 40%", mobileFocus: "58% 50%" },
  { id: "music", focus: "50% 12%", mobileFocus: "76% 38%", mobileScale: 1.6 },
  { id: "community", focus: "50% 45%", mobileFocus: "66% 50%" },
];

export function ObsessionStrip() {
  const banner = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    if (banner.current) observer.observe(banner.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={banner}
      className="container obsession-cta"
      aria-labelledby="obsession-heading"
      data-started={started}
      style={{ "--obsession-cycle": `${frames.length}s` } as CSSProperties}
    >
      <div
        className="obsession-film"
        role="img"
        aria-label="Original photographic-style scenes of sneakers, Brie, TV, books, pets, pop-music obsessions and friends finding their people."
      >
        {frames.map((frame, index) => (
          <div
            className="obsession-shot"
            key={frame.id}
            style={
              {
                animationDelay: `${index - frames.length}s`,
                "--frame-focus": frame.focus,
                "--frame-mobile-focus": frame.mobileFocus,
                "--frame-mobile-scale": frame.mobileScale ?? 1,
                zIndex: frames.length - index,
              } as CSSProperties
            }
          >
            <Image
              src={`/brand/obsessions/${frame.id}.png`}
              alt=""
              fill
              sizes="(max-width: 600px) 94vw, (max-width: 1400px) 90vw, 1240px"
            />
          </div>
        ))}
      </div>
      <div className="obsession-overlay">
        <h2 id="obsession-heading">MAKE SOME NOISE.</h2>
        <Link href="/create" className="button button-blue">
          <span>
            Rally the troops <ArrowRight size={19} />
          </span>
        </Link>
      </div>
    </section>
  );
}
