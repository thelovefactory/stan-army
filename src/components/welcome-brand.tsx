import Image from "next/image";
import { StanStarIcon } from "./stan-icons";

export function WelcomeCollage() {
  return (
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
  );
}
export function WelcomeCommunity() {
  return (
    <div className="hero-community">
      <div className="avatar-stack">
        <Image src="/images/sienna.jpg" width={34} height={34} alt="" />
        <Image src="/images/atlas.jpg" width={34} height={34} alt="" />
        <span className="hero-community-mark" aria-hidden="true">
          <StanStarIcon size={22} />
        </span>
      </div>
      <p>
        Create and join communities
        <br />
        around the things you love.
      </p>
    </div>
  );
}
export function CommunityTicker() {
  return (
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
  );
}
