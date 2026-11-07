"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";

const frames = ["sneakers", "cheese", "tv", "music"];

export function ObsessionStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className="container obsession-cta"
      aria-labelledby="obsession-heading"
    >
      <h2 id="obsession-heading">MAKE SOME NOISE.</h2>
      <div
        className="obsession-film"
        data-paused={paused}
        role="img"
        aria-label="A fast photographic-style sequence of sneakers, pop music, Brie, TV, pets, books, headphones and cameras. Original illustrative scenes."
      >
        {frames.map((frame, index) => (
          <div
            className="obsession-shot"
            key={frame}
            style={{ animationDelay: `${-index * 1.4}s` }}
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
      <div className="obsession-controls">
        <button
          type="button"
          className="obsession-pause"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          aria-label={paused ? "Play photo animation" : "Pause photo animation"}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
          {paused ? "Play" : "Pause"}
        </button>
        <Link href="/create" className="button button-blue">
          Rally the troops <ArrowUpRight size={19} />
        </Link>
      </div>
    </section>
  );
}
