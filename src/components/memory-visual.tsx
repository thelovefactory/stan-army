import Image from "next/image";
import { memoryById } from "@/lib/fan-space";
export function MemoryVisual({ memoryId }: { memoryId: string }) {
  const m = memoryById(memoryId);
  if (!m) return null;
  return (
    <div
      className={`memory-visual memory-${m.visual} memory-id-${m.id}`}
      role="img"
      aria-label={m.title}
    >
      {m.visual === "photo" ? (
        <Image
          src={m.image!}
          fill
          sizes="(max-width:600px) 90vw,40vw"
          alt={m.title + " — licensed stock demo photograph"}
        />
      ) : m.visual === "print" ? (
        <>
          <span className="print-corner">FOR THE PEOPLE WHO GET IT.</span>
          <strong>
            {m.id === "heart-print" ? (
              <>
                you can
                <br />
                sit with
                <br />
                <em>us.</em>
              </>
            ) : (
              <>
                B-SIDE
                <br />
                <em>PEOPLE.</em>
              </>
            )}
          </strong>
          <span className="print-spark">✳</span>
          <small>MADE WITH FEELINGS, NOT A MARKETING PLAN.</small>
        </>
      ) : m.visual === "ticket" ? (
        <div className="keepsake-ticket">
          <span>KEEP THIS FEELING.</span>
          <b>
            THE NIGHT
            <br />
            WE FOUND
            <br />
            OUR PEOPLE.
          </b>
          <small>FAN MEMORY · FICTIONAL TICKET · NOT VALID FOR ENTRY</small>
          <i aria-hidden="true">|||| ||| || |||| ||| ||</i>
        </div>
      ) : (
        <div className="keepsake-cassette">
          <span>LAST BUS HOME · SIDE A</span>
          <div>
            <b>◉</b>
            <i />
            <b>◉</b>
          </div>
          <small>A MIXTAPE WITH NO SKIPS.</small>
        </div>
      )}
    </div>
  );
}
