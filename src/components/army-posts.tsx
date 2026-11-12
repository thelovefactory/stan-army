"use client";
import Link from "next/link";
import { ArmyView, armyPath } from "@/lib/data";
import { ProfileTheme } from "./profile-theme";
import { ArmyModule } from "./army-module";
import { LivingFanSpace } from "./living-fan-space";
export function ArmyPosts({ view }: { view: ArmyView }) {
  return (
    <ProfileTheme
      profileId={`army:${view.army.id}`}
      legacyProfileId={`artist:${view.artist.slug}`}
      kind="army"
      name={`${view.artist.name}’s Army`}
      officialParticipation
    >
      <main id="main" className="container army-posts-page living-army">
        <Link className="back-link" href={armyPath(view.army)}>
          ← Back to {view.artist.name}’s Army
        </Link>
        <header className="all-posts-heading">
          <p className="eyebrow">THE WHOLE CONVERSATION</p>
          <h1>All posts</h1>
          <p>
            The latest seven appear on the Army page. Find every post here,
            newest first.
          </p>
          <small>
            Local demo · your posts stay during navigation and reset on refresh
          </small>
        </header>
        <ArmyModule name="feed" fallback>
          <LivingFanSpace armyId={view.army.id} allPosts />
        </ArmyModule>
      </main>
    </ProfileTheme>
  );
}
