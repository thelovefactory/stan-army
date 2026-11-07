"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const frames = ["sneakers", "cheese", "tv", "music"];

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
    >
      <div
        className="obsession-film"
        role="img"
        aria-label="Original photographic-style scenes of sneakers, Brie, TV, books, pets and pop-music obsessions."
      >
        {frames.map((frame, index) => (
          <div
            className="obsession-shot"
            key={frame}
            style={{
              animationDelay: `${-index}s`,
              zIndex: frames.length - index,
            }}
          >
            <Image
              src={`/brand/obsessions/${frame}.png`}
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
            Build your army <ChevronRight size={19} />
          </span>
        </Link>
      </div>
    </section>
  );
}
