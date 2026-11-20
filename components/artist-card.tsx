import Link from "next/link";
import { ArrowUpRight, Headphones } from "lucide-react";
import type { Artist } from "@/lib/artists";
export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/army/${artist.handle}`}
      className="artist-card"
      style={{ "--artist-accent": artist.accent } as React.CSSProperties}
    >
      <div className="card-photo">
        <img
          src={artist.image}
          alt={`Editorial photo representing fictional artist ${artist.name}`}
          loading="lazy"
        />
        <span className="photo-label">DEMO ARTIST</span>
        <span className="card-open">
          <ArrowUpRight size={22} />
        </span>
      </div>
      <div className="card-details">
        <div>
          <h3>{artist.name}</h3>
          <p>
            {artist.genre} <span> / </span> {artist.city}
          </p>
        </div>
        <span className="stan-count">
          <Headphones size={14} />
          {artist.stans.toLocaleString("en-GB")}
        </span>
      </div>
    </Link>
  );
}
