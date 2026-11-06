import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArmyView, armyPath, armyAddress } from "@/lib/data";
export function ArmyCard({
  view,
  index = 0,
}: {
  view: ArmyView;
  index?: number;
}) {
  const { army, artist, founder } = view;
  return (
    <Link href={armyPath(army)} className={`artist-card accent-${army.accent}`}>
      <div className="card-photo">
        <Image
          src={artist.image}
          fill
          sizes="(max-width: 600px) 92vw, (max-width: 900px) 45vw, 30vw"
          alt={`Stock photo representing fictional artist ${artist.name}`}
        />
        <span className="card-category">{artist.genre} · Fan-run</span>
        <span className="card-number">0{index + 1}</span>
        <span className="card-arrow">
          <ArrowUpRight size={21} />
        </span>
      </div>
      <div className="card-details">
        <div>
          <h3>{artist.name}’s Army</h3>
          <p>
            {armyAddress(army)}
            <span> · Founded by @{founder.handle}</span>
          </p>
        </div>
        <span className="card-count">
          {army.count.toLocaleString("en-GB")}
          <small>demo stans</small>
        </span>
      </div>
    </Link>
  );
}
