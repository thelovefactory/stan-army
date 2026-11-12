"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import {
  artists,
  armyBySlug,
  armyPath,
  currentFan,
  OfficialRequest,
  validateOfficialRequest,
} from "@/lib/data";
export function OfficialAccess({ armySlug }: { armySlug: string }) {
  const view = armyBySlug(armySlug);
  const [request, setRequest] = useState<OfficialRequest>({
    artistId: view?.artist.id || "",
    kind: "artist",
    handle: currentFan.handle,
    evidenceUrl: "",
    details: "",
  });
  const [error, setError] = useState(""),
    [complete, setComplete] = useState(false);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const issue = validateOfficialRequest(request);
    if (issue) {
      setError(issue);
      return;
    }
    setComplete(true);
    setError("");
  }
  return (
    <main id="main" className="container official-access-page">
      <Link
        className="back-link"
        href={view ? armyPath(view.army) : "/discover"}
      >
        <ArrowLeft size={15} /> Back to the fan-run Army
      </Link>
      <div className="section-heading">
        <div>
          <p className="eyebrow">AN OFFICIAL VOICE. A FAN-RUN COMMUNITY.</p>
          <h1>
            Here as the artist?
            <br />
            <span>Let’s establish that.</span>
          </h1>
        </div>
        <ShieldCheck size={50} />
      </div>
      <div className="official-access-layout">
        <section className="panel official-explainer">
          <h2>
            Identity and ownership
            <br />
            are different things.
          </h2>
          <p>
            Verified artists and authorised representatives can publish in “From
            the Artist” and interact under their verified identity. That
            identity can follow them across the platform.
          </p>
          <p>
            Verification never transfers an Army, unlocks its theme editor or
            grants moderation. Its founding stan and community administrators
            continue to steward the space.
          </p>
          <p>
            Representative access needs evidence of authority, a defined artist
            scope and a review/revocation process. Paying for tools or an Army
            upgrade does not buy verification or control.
          </p>
          <div className="verification-steps">
            <span>01 · Request</span>
            <span>02 · Platform review</span>
            <span>03 · Scoped, revocable access</span>
          </div>
          <p className="input-help">
            This prototype simulates only the request form. No request is
            transmitted, no evidence is reviewed, and no status or permission is
            granted.
          </p>
        </section>
        <form className="panel wizard-form" onSubmit={submit} noValidate>
          <span className="demo-pill">LOCAL REQUEST PREVIEW</span>
          <h2>
            {complete ? "Request preview ready." : "Request official access"}
          </h2>
          {complete ? (
            <>
              <p className="wizard-description" role="status">
                <Check size={17} /> Nothing has been submitted. Your identity is
                not verified and your permissions have not changed.
              </p>
              <div className="identity-separation">
                <p>
                  <b>Artist:</b>{" "}
                  {artists.find((a) => a.id === request.artistId)?.name}
                </p>
                <p>
                  <b>Your fan account:</b> @{request.handle}
                </p>
                <p>
                  <b>Requested relationship:</b>{" "}
                  {request.kind === "artist"
                    ? "Official artist"
                    : "Official representative"}
                </p>
              </div>
              <button
                type="button"
                className="button"
                onClick={() => setComplete(false)}
              >
                Edit request preview
              </button>
            </>
          ) : (
            <div className="form-fields">
              <label htmlFor="official-artist">Artist identity</label>
              <select
                id="official-artist"
                value={request.artistId}
                onChange={(e) =>
                  setRequest((r) => ({ ...r, artistId: e.target.value }))
                }
              >
                <option value="">Choose an artist</option>
                {artists.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <label htmlFor="official-kind">Your relationship</label>
              <select
                id="official-kind"
                value={request.kind}
                onChange={(e) =>
                  setRequest((r) => ({
                    ...r,
                    kind: e.target.value as OfficialRequest["kind"],
                  }))
                }
              >
                <option value="artist">I am the artist</option>
                <option value="representative">
                  I am an authorised manager / label representative
                </option>
              </select>
              <label htmlFor="official-fan-handle">
                Your separate Stan Army handle
              </label>
              <input
                id="official-fan-handle"
                value={request.handle}
                onChange={(e) =>
                  setRequest((r) => ({
                    ...r,
                    handle: e.target.value.toLowerCase(),
                  }))
                }
                maxLength={30}
              />
              <label htmlFor="official-evidence">Public evidence link</label>
              <input
                id="official-evidence"
                type="url"
                value={request.evidenceUrl}
                onChange={(e) =>
                  setRequest((r) => ({ ...r, evidenceUrl: e.target.value }))
                }
                placeholder="https://…"
                maxLength={500}
              />
              <label htmlFor="official-details">
                Identity / representative authority
              </label>
              <textarea
                id="official-details"
                rows={5}
                value={request.details}
                onChange={(e) =>
                  setRequest((r) => ({ ...r, details: e.target.value }))
                }
                maxLength={1000}
                placeholder="Public context a platform reviewer could assess. No passwords, private documents or secrets."
              />
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button className="button button-blue" type="submit">
                Preview verification request
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
