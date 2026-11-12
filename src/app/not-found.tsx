import Link from 'next/link';
export default function NotFound(){return <main id="main" className="container empty-state"><span>↗</span><h1>This army hasn’t formed yet.</h1><p>Let’s find you some people.</p><Link href="/discover" className="button button-blue">Back to discovery</Link></main>;}
