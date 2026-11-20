import { CreateWizard } from "@/components/create-wizard";
import { DemoNotice } from "@/components/chrome";
export const metadata = { title: "Create Your Army" };
export default function Create() {
  return (
    <main id="main" className="container page-content">
      <DemoNotice />
      <div className="page-title compact">
        <p className="eyebrow peach">
          EVERY GREAT ARMY STARTS WITH ONE ARTIST.
        </p>
        <h1>
          Build your <span className="gradient-text">little universe.</span>
        </h1>
        <p>Make a space for your sound. Bring your people along.</p>
      </div>
      <CreateWizard />
    </main>
  );
}
