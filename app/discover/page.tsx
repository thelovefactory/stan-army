import { Discovery } from "@/components/discovery";
import { DemoNotice } from "@/components/chrome";
export const metadata = { title: "Discovery" };
export default function Discover() {
  return (
    <main id="main" className="container page-content">
      <DemoNotice />
      <div className="page-title">
        <p className="eyebrow mint">GO ON. FIND YOUR PEOPLE.</p>
        <h1>
          Good music.
          <br />
          Even better <span className="gradient-text">company.</span>
        </h1>
        <p>Your next favourite artist is someone’s best-kept secret.</p>
      </div>
      <Discovery />
    </main>
  );
}
