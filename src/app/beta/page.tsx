import "./beta.css";
import type { Metadata } from "next";
import { BetaForm } from "@/components/beta-form";
import {
  CommunityTicker,
  WelcomeCollage,
  WelcomeCommunity,
} from "@/components/welcome-brand";

export const metadata: Metadata = {
  title: "Register for beta",
  description:
    "We’re bringing back the glory days of communal internet. Help shape the future of stan.army.",
};
export default function BetaPage() {
  return (
    <main id="main" className="landing-page beta-page">
      <section
        className="container landing-hero beta-hero"
        aria-labelledby="beta-heading"
      >
        <div className="hero-copy">
          <p className="eyebrow beta-eyebrow">THE FIRST STANS GET A SAY.</p>
          <h1 id="beta-heading">
            Stan for
            <br />
            <span className="love-word">something.</span>
          </h1>
          <div className="hero-description">
            <p>Unapologetically loud. Slightly obsessive. Utterly yours.</p>
          </div>
          <div className="beta-invitation">
            <p>We’re bringing back the glory days of communal internet.</p>
            <p>
              Help shape the future of <strong>stan.army.</strong>
            </p>
          </div>
          <BetaForm />
          <WelcomeCommunity />
        </div>
        <WelcomeCollage />
      </section>
      <CommunityTicker />
    </main>
  );
}
