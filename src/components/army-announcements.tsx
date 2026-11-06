"use client";
import { useState } from "react";
import Link from "next/link";
import { Pin, Megaphone, ArrowUpRight } from "lucide-react";
import { ArmyView } from "@/lib/data";
import { useProfileTheme } from "./profile-theme";
export function ArmyAnnouncements({ view }: { view: ArmyView }) {
  const { army, artist, founder } = view;
  const { canEditCommunity, canPostOfficial, role } = useProfileTheme();
  const [community, setCommunity] = useState<{ text: string; by: string }[]>(
      [],
    ),
    [official, setOfficial] = useState<{ text: string; by: string }[]>([]);
  const [communityDraft, setCommunityDraft] = useState(""),
    [officialDraft, setOfficialDraft] = useState("");
  const [notice, setNotice] = useState("");
  function post(e: React.FormEvent, kind: "army" | "artist") {
    e.preventDefault();
    const allowed = kind === "army" ? canEditCommunity : canPostOfficial;
    const text = (kind === "army" ? communityDraft : officialDraft).trim();
    if (!allowed || !text) return;
    if (kind === "army") {
      setCommunity((p) => [
        ...p,
        { text, by: role === "admin" ? "COMMUNITY ADMIN" : "FOUNDING STAN" },
      ]);
      setCommunityDraft("");
    } else {
      setOfficial((p) => [
        ...p,
        {
          text,
          by:
            role === "official-representative"
              ? "OFFICIAL REPRESENTATIVE"
              : "OFFICIAL ARTIST",
        },
      ]);
      setOfficialDraft("");
    }
    setNotice(
      "Added locally to the " +
        (kind === "army" ? "community" : "official demo") +
        " announcement area. Refresh clears it.",
    );
  }
  return (
    <div className="announcement-system">
      <div className="announcement-columns">
        <section className="panel voice-panel">
          <div className="panel-title">
            <h2>
              <Pin size={18} /> From the Army
            </h2>
            <span className="demo-pill">FAN ADMINISTRATORS</span>
          </div>
          <p className="voice-byline">
            Pinned by founding stan @{founder.handle}
          </p>
          <h3>
            A room for the people
            <br />
            who feel it too.
          </h3>
          <p>{army.welcome}</p>
          <p className="voice-signature">— {founder.name}, founding stan ♡</p>
          {community.map((post, i) => (
            <div className="local-announcement" key={i}>
              <span>{post.by} · LOCAL DEMO</span>
              <p>{post.text}</p>
            </div>
          ))}
          {canEditCommunity && (
            <form onSubmit={(e) => post(e, "army")}>
              <label htmlFor="community-announcement">
                Add a community announcement
              </label>
              <textarea
                id="community-announcement"
                value={communityDraft}
                onChange={(e) => setCommunityDraft(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <button className="button" disabled={!communityDraft.trim()}>
                Post to the Army · demo
              </button>
            </form>
          )}
          <p className="voice-permission">
            Community design, organisation and moderation stay with fan
            stewards.
          </p>
        </section>
        <section className="panel voice-panel official-voice">
          <div className="panel-title">
            <h2>
              <Megaphone size={18} /> From the Artist
            </h2>
            <span className="demo-pill">SEPARATE OFFICIAL VOICE</span>
          </div>
          {artist.id === "artist-nova" ? (
            <>
              <p className="voice-byline">
                @{artist.officialHandle} · OFFICIAL ARTIST · Fictional verified
                demo
              </p>
              <h3>
                You made a home
                <br />
                for these songs.
              </h3>
              <p>
                Jess and everyone in this Army: thank you for showing up for
                each other. I’m here to share the music. This community is yours
                to run.
              </p>
            </>
          ) : (
            <p>
              No official participation in this demo Army yet. The fans don’t
              need to wait for the artist to start their community.
            </p>
          )}
          {official.map((post, i) => (
            <div className="local-announcement" key={i}>
              <span>{post.by} · FICTIONAL DEMO</span>
              <p>{post.text}</p>
            </div>
          ))}
          {canPostOfficial && (
            <form onSubmit={(e) => post(e, "artist")}>
              <label htmlFor="official-announcement">
                Add an official announcement · simulated verified role
              </label>
              <textarea
                id="official-announcement"
                value={officialDraft}
                onChange={(e) => setOfficialDraft(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <button className="button" disabled={!officialDraft.trim()}>
                Post official announcement · demo
              </button>
            </form>
          )}
          <p className="voice-permission">
            Verification permits an official voice. It grants no Army ownership,
            theme editing or moderation.
          </p>
          <Link
            href={`/official-access?army=${army.slug}`}
            className="text-link"
          >
            Are you the artist? Request official access{" "}
            <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
      <p role="status" className="announcement-status">
        {notice ||
          "Announcements are demo content. Switch the clearly labelled demo role above to explore the separate publishing permissions."}
      </p>
    </div>
  );
}
