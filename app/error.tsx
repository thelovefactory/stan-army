"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container empty-state">
      <h1>A little interference.</h1>
      <p>Something went wrong loading this space.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
