"use client";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Music2, Play } from "lucide-react";
import { useProfileTheme } from "./profile-theme";
export const spotifyPlaylist =
  "https://open.spotify.com/playlist/0EO3CxjNLb1gFi9QuPT6YE";
export function SidebarPlaylist({ armySlug = "nova" }: { armySlug?: string }) {
  const [loaded, setLoaded] = useState(false);
  const { theme, clean } = useProfileTheme();
  return (
    <section
      className={`sidebar-playlist playlist-${clean ? "minimal" : theme.playerSkin}`}
      aria-labelledby="playlist-heading"
    >
      <header>
        <h2 id="playlist-heading">
          <Music2 size={18} /> On the Army stereo
        </h2>
        <span>SPOTIFY</span>
      </header>
      {loaded ? (
        <>
          <iframe
            title="Army Spotify playlist"
            src="https://open.spotify.com/embed/playlist/0EO3CxjNLb1gFi9QuPT6YE?theme=0"
            width="100%"
            height="152"
            allow="encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <button className="playlist-unload" onClick={() => setLoaded(false)}>
            Unload Spotify
          </button>
        </>
      ) : (
        <div className="playlist-placeholder">
          <span className="playlist-record" aria-hidden="true">
            ♫
          </span>
          <div>
            <b>The Army playlist</b>
            <p>Your music. Your own listen.</p>
            <button
              className="button button-mint"
              onClick={() => setLoaded(true)}
            >
              <Play size={15} /> Load Spotify
            </button>
          </div>
        </div>
      )}
      <footer>
        <a href={spotifyPlaylist} target="_blank" rel="noreferrer">
          Open in Spotify <ExternalLink size={12} />
        </a>
        <Link href={`/armies/${armySlug}/room`}>Full Army Player ↗</Link>
      </footer>
      <small>
        Spotify loads on click. Playback and availability are controlled by
        Spotify.
      </small>
    </section>
  );
}
