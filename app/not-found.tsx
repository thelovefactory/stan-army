import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container empty-state">
      <p className="eyebrow mint">OFF THE RECORD</p>
      <h1>This room doesn’t exist. Yet.</h1>
      <p>There’s plenty of good company in discovery.</p>
      <Link className="button primary" href="/discover">
        Find Your Artist
      </Link>
    </main>
  );
}
