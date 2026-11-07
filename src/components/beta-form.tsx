"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function BetaForm() {
  const [previewed, setPreviewed] = useState(false);
  return (
    <form
      className="beta-form"
      aria-label="Beta registration design preview"
      onSubmit={(event) => {
        event.preventDefault();
        setPreviewed(true);
      }}
    >
      <label htmlFor="beta-email">Your email address</label>
      <div className="beta-email-row">
        <input
          id="beta-email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@yourinbox.com"
          aria-describedby="beta-preview-note"
          onChange={() => setPreviewed(false)}
        />
        <button type="submit" className="button">
          <span>
            REGISTER FOR BETA <ArrowRight size={20} />
          </span>
        </button>
      </div>
      <p id="beta-preview-note" className="beta-preview-note" role="status">
        {previewed
          ? "Preview only. Your email hasn’t been sent or saved."
          : "Design preview — signups aren’t open yet. Nothing is sent or saved."}
      </p>
    </form>
  );
}
