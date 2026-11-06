"use client";
import { useState } from "react";
import { Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { artists, filterArmies } from "@/lib/data";
import { ArmyCard } from "./artist-card";
import { DemoNote } from "./shell";
export function Discovery() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All genres");
  const [city, setCity] = useState("Everywhere");
  const [collection, setCollection] = useState("New armies");
  const results = filterArmies({ search, genre, city, collection });
  function clear() {
    setSearch("");
    setGenre("All genres");
    setCity("Everywhere");
    setCollection("New armies");
  }
  return (
    <main id="main" className="container discovery-page">
      <div className="discovery-heading">
        <div>
          <p className="eyebrow">
            <span className="mint-dot" /> THE NEXT GOOD THING IS OUT THERE.
          </p>
          <h1>
            Find your sound.
            <br />
            <span>Find your people.</span>
          </h1>
        </div>
        <div className="discovery-sticker">
          BE EARLY.
          <br />
          BE LOUD.
          <br />
          <span>BE A STAN. ↗</span>
        </div>
      </div>
      <div className="discovery-toolbar">
        <div className="collection-tabs" aria-label="Artist collections">
          {["New armies", "Most stanned", "Our favourites"].map((t) => (
            <button
              key={t}
              aria-pressed={collection === t}
              className={collection === t ? "active" : ""}
              onClick={() => setCollection(t)}
            >
              {t}
              {t === "Our favourites" && <span>✳</span>}
            </button>
          ))}
        </div>
        <p>
          Organic discovery · Future paid placements will be labelled
          separately.
        </p>
      </div>
      <div className="filter-bar">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">Search artists</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Artist, sound, city…"
          />
        </label>
        <label>
          <span className="sr-only">Filter by genre</span>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {["All genres", ...new Set(artists.map((a) => a.genre))].map(
              (g) => (
                <option key={g}>{g}</option>
              ),
            )}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by location</span>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            {["Everywhere", ...new Set(artists.map((a) => a.city))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <button className="filter-reset" onClick={clear}>
          <SlidersHorizontal size={16} /> Reset filters
        </button>
      </div>
      <div className="results-meta">
        <p role="status">
          {results.length} {results.length === 1 ? "army" : "armies"} to
          discover
        </p>
        <DemoNote compact />
      </div>
      {results.length ? (
        <div className="artist-grid discovery-grid">
          {results.map((a, i) => (
            <ArmyCard key={a.army.id} view={a} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>↗</span>
          <h2>
            {search.trim()
              ? `No Army found for “${search.trim()}”. Yet.`
              : "No armies match these filters."}
          </h2>
          <p>
            Every Army starts with one fan. Could that be you? This search
            covers demo communities only.
          </p>
          <Link
            className="button button-blue"
            href={
              search.trim()
                ? `/create?artist=${encodeURIComponent(search.trim())}`
                : "/create"
            }
          >
            Start their Army <ArrowUpRight size={17} />
          </Link>
          <button className="button" onClick={clear}>
            Clear all filters
          </button>
        </div>
      )}
      <div className="discovery-bottom">
        <div>
          <p className="eyebrow">
            THE FANS BUILD IT. THE ARTIST IS WHO WE RALLY AROUND.
          </p>
          <h2>Can’t find your artist? Start their Army.</h2>
        </div>
        <Link href="/create" className="button">
          Create your army <ArrowUpRight size={18} />
        </Link>
      </div>
    </main>
  );
}
