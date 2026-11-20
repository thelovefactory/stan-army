"use client";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { artists } from "@/lib/artists";
import { filterArtists } from "@/lib/demo.mjs";
import { ArtistCard } from "./artist-card";
export function Discovery() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All sounds");
  const [collection, setCollection] = useState("Our Favourites");
  const filtered = filterArtists(artists, query, genre, collection);
  return (
    <>
      <div className="discovery-controls">
        <div className="tabs" aria-label="Artist collections">
          {["Our Favourites", "New Artists", "Most Stanned"].map((c) => (
            <button
              className={c === collection ? "active" : ""}
              key={c}
              onClick={() => setCollection(c)}
              aria-pressed={c === collection}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <label className="search-field">
            <Search size={19} />
            <input
              aria-label="Search artists"
              placeholder="Find your sound, artist, city…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="select-field">
            <SlidersHorizontal size={17} />
            <select
              aria-label="Filter by genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {["All sounds", ...artists.map((a) => a.genre)].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="results-heading">
        <p>
          {collection === "Our Favourites"
            ? "Picked with love. Never paid placement."
            : collection === "Most Stanned"
              ? "Big love from the demo community."
              : "New faces. Fresh sounds. Get in early."}
        </p>
        <span aria-live="polite">{filtered.length} demo artists</span>
      </div>
      {filtered.length ? (
        <div className="artist-grid discovery-grid">
          {filtered.map((a) => (
            <ArtistCard key={a.handle} artist={a} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No artists found. Yet.</h2>
          <p>Try another sound or a different city.</p>
          <button
            className="button outline"
            onClick={() => {
              setQuery("");
              setGenre("All sounds");
              setCollection("New Artists");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
