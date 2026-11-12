"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Bookmark,
  Check, ChevronDown, Heart, MessageCircle, MessageSquare, Music2,
  Pause, Pin, Play, Plus, Search, Send, Users, X,
} from "lucide-react";
import { armyBySlug } from "@/lib/data";
import { fanNotes, validateMark } from "@/lib/fan-space";
import type { FanNote } from "@/lib/fan-space";
import { boardById } from "@/lib/boards";
import { useDemo } from "./demo-provider";
import { useBoards } from "./boards-provider";
import { StanStarIcon } from "./stan-icons";
import s from "./nova-layout-study.module.css";

const view = armyBySlug("nova")!;
const board = boardById("s/nova")!;
const sampleChat = [
  { name: "lucid.lou", initials: "LL", text: "That last chorus has been living in my head all week.", time: "18:42" },
  { name: "jess.wav", initials: "JW", text: "Started with a playlist and a group chat. Look at us now. 🖤", time: "18:43" },
  { name: "milo.mp3", initials: "MM", text: "Anyone else listening with the lights off? A whole different feeling.", time: "18:45" },
];
type Section = "army" | "discussions" | "about";

function Avatar({ initials, tone = 0 }: { initials: string; tone?: number }) {
  return <span className={`${s.avatar} ${s[`tone${tone % 4}`]}`} aria-hidden="true">{initials}</span>;
}

function Post({ note }: { note: FanNote }) {
  const demo = useDemo();
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState("");
  const key = `study:${view.army.id}:${note.id}`;
  const joined = demo.enlisted.includes(view.army.id);
  const loved = demo.hearts.includes(key);
  const saved = demo.savedMemories.includes(key);
  const extra = demo.replies[key] ?? [];
  const art = note.image;
  return (
    <article className={`${s.post} ${note.style === "afterhours" ? s.nightPost : ""} ${note.id === "jess-first-note" ? s.notePost : ""}`}>
      <header className={s.postHeader}>
        <Avatar initials={note.initials} tone={note.initials.charCodeAt(0)} />
        <div><strong>@{note.handle}</strong><span>{note.local ? "Just now · local demo" : "Sample post"}</span></div>
        {note.id === "jess-first-note" && <span className={s.hostLabel}>Host</span>}
        <button className={s.iconButton} aria-label={`${saved ? "Unsave" : "Save"} post by ${note.handle}`} aria-pressed={saved} onClick={() => demo.keepMemory(key)}>
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </header>
      {art && <div className={s.postImage}>
        <Image src={art} alt="A crowd with raised hands at a concert" width={1000} height={660} sizes="(max-width: 800px) 100vw, 860px" />
        <span className={s.imageNote}>the blurry ones stay with you.</span>
      </div>}
      {note.id === "lex-print" && <div className={s.printImage}><div className={s.originalPrint} role="img" aria-label="Fan-made pink print: B-side people. Made with feelings, not a marketing plan.">
        <small>FOR THE PEOPLE WHO GET IT.</small><strong>B-SIDE<br /><em>PEOPLE.</em></strong><StanStarIcon size={70} /><span>MADE WITH FEELINGS, NOT A MARKETING PLAN.</span>
      </div></div>}
      <div className={s.postBody}>
        {note.id === "jess-first-note" && <span className={s.tinyLabel}><Pin size={12} /> THE NOTE THAT STARTED IT</span>}
        <p>{note.text}</p>
      </div>
      <footer className={s.postActions}>
        <button aria-label={`${loved ? "Unlike" : "Like"} post by ${note.handle}`} aria-pressed={loved} onClick={() => demo.heart(key)}>
          <Heart size={17} fill={loved ? "currentColor" : "none"} />{note.likes + Number(loved)}<span className={s.actionWord}> hearts</span>
        </button>
        <button aria-expanded={replying} onClick={() => setReplying(!replying)}><MessageCircle size={17} />{note.replies.length + extra.length}<span className={s.actionWord}>{note.replies.length + extra.length === 1 ? " reply" : " replies"}</span></button>
        <span>{note.local ? "Only visible to you" : "Sample conversation"}</span>
      </footer>
      {replying && <div className={s.replyArea}>
        {[...note.replies, ...extra].map((reply) => <p key={reply.id}><strong>@{reply.handle}</strong> {reply.text}</p>)}
        <form onSubmit={(event) => { event.preventDefault(); if (!joined || validateMark(draft)) return; demo.reply(key, draft); setDraft(""); }}>
          <label className="sr-only" htmlFor={`reply-${note.id}`}>Reply to {note.handle}</label>
          <input id={`reply-${note.id}`} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Say something back…" minLength={2} maxLength={500} required disabled={!joined} />
          {joined ? <button type="submit" className={s.iconButton} aria-label={`Send reply to ${note.handle}`} disabled={!!validateMark(draft)}><Send size={17} /></button>
            : <button type="button" className={s.textAction} onClick={() => demo.toggle(view.army.id)}>Join to reply</button>}
        </form>
      </div>}
    </article>
  );
}

function Composer({ joined, join }: { joined: boolean; join: () => void }) {
  const { leaveMark } = useDemo();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const field = useRef<HTMLTextAreaElement>(null);
  function expand() { setOpen(true); requestAnimationFrame(() => field.current?.focus()); }
  return <section className={s.composer} aria-label="Write an Army post">
    <div className={s.composerStart}><Avatar initials="YOU" tone={1} />
      {open ? <label htmlFor="study-post">A thought. A discovery. A little noise.</label>
        : <button onClick={expand}>What’s been living in your head?</button>}
      {open && <button className={s.iconButton} aria-label="Close composer" onClick={() => setOpen(false)}><X size={17} /></button>}
      {!open && <Plus size={20} aria-hidden="true" />}
    </div>
    {open && <form onSubmit={(event) => {
      event.preventDefault(); if (validateMark(draft) || !joined) return;
      leaveMark(view.army.id, draft, "note"); setDraft(""); setOpen(false);
      setStatus("Posted in this demo. It resets on refresh.");
    }}>
      <textarea ref={field} id="study-post" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Share something with your people…" required minLength={2} maxLength={500} rows={3} />
      <div className={s.composerEnd}><span>{draft.length}/500 · local demo</span>
        {joined ? <button type="submit" data-army-action className={s.primary} disabled={!!validateMark(draft)}>Post <ArrowUpRight size={16} /></button>
          : <button type="button" data-army-action className={s.primary} onClick={join}>Join to post <Plus size={16} /></button>}
      </div>
    </form>}
    {status && <p className={s.smallStatus} role="status">{status}</p>}
  </section>;
}

function Chat({ joined, join, windowed = false }: { joined: boolean; join: () => void; windowed?: boolean }) {
  const { messages, send } = useDemo();
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const log = useRef<HTMLDivElement>(null);
  return <section id="study-chat" data-window-body={windowed ? "chat" : undefined} className={s.chat} aria-label={windowed ? "Army Chat" : undefined} aria-labelledby={windowed ? undefined : "study-chat-heading"}>
    {!windowed && <><header className={s.chatHeader}><h2 id="study-chat-heading"><MessageCircle size={19} />Army Chat</h2><span className={s.smallTag}>DEMO ROOM</span></header>
    <p className={s.chatIntro}>Pull up a seat. You’re among your people.</p></>}
    <div className={s.chatLog} ref={log} role="log" aria-label="Sample Army conversation" aria-live="polite">
      <p className={s.chatDate}>SAMPLE CONVERSATION</p>
      {sampleChat.map((message, index) => <div className={s.chatMessage} key={message.name}>
        <Avatar initials={message.initials} tone={index} /><div><header data-chat-meta><strong>@{message.name}</strong><time>{message.time}</time></header><p>{message.text}</p></div>
      </div>)}
      {(messages[view.army.id] ?? []).map((message, index) => <div className={s.chatMessage} key={`${index}-${message.time}`}>
        <Avatar initials="YOU" tone={1} /><div><header data-chat-meta><strong>@you.demo</strong><time>{message.time}</time></header><p>{message.text}</p></div>
      </div>)}
    </div>
    {joined ? <form className={s.chatInput} onSubmit={(event) => {
      event.preventDefault(); if (!draft.trim()) return; send(view.army.id, draft.trim()); setDraft(""); setStatus("Sent locally. Only you can see this.");
      requestAnimationFrame(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; });
    }}>
      <label className="sr-only" htmlFor="study-chat-message">Message the Army</label>
      <input id="study-chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={280} placeholder="Say something to the Army…" required />
      <button data-army-action className={s.sendButton} type="submit" disabled={!draft.trim()} aria-label="Send chat message"><Send size={17} /></button>
    </form> : <button data-army-action className={`${s.primary} ${s.joinChat}`} onClick={join}>Join the conversation <ArrowRight size={17} /></button>}
    <p className={s.chatFoot} role="status">{status || "A shared room. Be kind. Stay human."}</p>
  </section>;
}

function Music() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  return <section className={s.music} data-window-body="music" aria-label="Army stereo">
    <div className={s.musicDisc}><Music2 size={23} /></div>
    <div className={s.musicCopy}><span className={s.tinyLabel}>ON THE ARMY STEREO</span><h3>Window seat</h3><p>Sample instrumental · original audio</p></div>
    <button className={s.musicButton} aria-label={playing ? "Pause music" : "Play music"} onClick={async () => {
      if (!audio.current) return;
      if (playing) audio.current.pause();
      else try { await audio.current.play(); setError(false); } catch { setError(true); }
    }}>{playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button>
    <audio ref={audio} src="/audio/window-seat.mp3" preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onError={() => { setError(true); setPlaying(false); }} onLoadedMetadata={() => setDuration(audio.current?.duration ?? 0)} onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)} />
    <label className="sr-only" htmlFor="study-music-seek">Seek music</label>
    <input className={s.musicSeek} id="study-music-seek" type="range" min={0} max={duration || 1} step={0.1} value={position} disabled={!duration}
      onChange={(event) => { if (audio.current) { audio.current.currentTime = Number(event.target.value); setPosition(Number(event.target.value)); } }} />
    {error && <a className={s.smallStatus} href="/audio/window-seat.mp3">Playback unavailable. Open audio ↗</a>}
  </section>;
}

function Discussions({ windowed = false }: { windowed?: boolean }) {
  const demo = useDemo();
  const joined = demo.enlisted.includes(view.army.id);
  const boards = useBoards();
  const threads = boards.threadsFor(board);
  const votes = boards.votesFor(board.id);
  const [sort, setSort] = useState("top");
  const [query, setQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const results = threads.filter((thread) => `${thread.title} ${thread.body}`.toLowerCase().includes(query.toLowerCase()));
  const ordered = sort === "top" ? [...results].sort((a, b) => b.score + (votes[b.id] ?? 0) - a.score - (votes[a.id] ?? 0)) : results;
  return <section className={s.discussions} data-window-body={windowed ? "board" : undefined} aria-labelledby="study-discussion-title">
    <header className={s.sectionHeader} data-board-header>
      {windowed ? <h2 id="study-discussion-title" className="sr-only">Nova discussions</h2> : <div><span className={s.tinyLabel}>GO A LITTLE DEEPER</span><h2 id="study-discussion-title">The conversations.</h2></div>}
      <button className={s.textAction} onClick={() => setComposing(!composing)} aria-expanded={composing}><Plus size={16} />Start a discussion</button>
    </header>
    <div className={s.boardActions} data-board-actions>
      <div className={s.sortGroup}><button aria-pressed={sort === "top"} onClick={() => setSort("top")}>Top</button><button aria-pressed={sort === "new"} onClick={() => setSort("new")}>New</button></div>
      <label className={s.search} data-board-search><Search size={16} /><span className="sr-only">Search discussions</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a conversation…" /></label>
      <button className={s.iconButton} aria-label="Save Nova board" aria-pressed={boards.favourites.includes(board.id)} onClick={() => boards.toggleFavourite(board.id)}><Bookmark size={18} fill={boards.favourites.includes(board.id) ? "currentColor" : "none"} /></button>
    </div>
    {boards.bookmarkStatus && <p className={s.smallStatus} role="status">{boards.bookmarkStatus}</p>}
    {composing && <form className={s.threadComposer} onSubmit={(event) => {
      event.preventDefault(); if (!joined || title.trim().length < 5 || body.trim().length < 2) return;
      boards.setThreadsFor(board, (current) => [{ id: crypto.randomUUID(), author: "you.demo", title: title.trim(), body: body.trim(), tag: "Discussion", score: 1, replies: [], local: true }, ...current]);
      setTitle(""); setBody(""); setComposing(false); setSort("new");
    }}>
      <label htmlFor="study-thread-title">Discussion title</label><input id="study-thread-title" value={title} onChange={(event) => setTitle(event.target.value)} minLength={5} maxLength={120} required placeholder="What’s on your mind?" />
      <label htmlFor="study-thread-body">Your opening thought</label><textarea id="study-thread-body" value={body} onChange={(event) => setBody(event.target.value)} minLength={2} maxLength={1000} required rows={3} />
      <div><span className={s.smallStatus}>Local demo · resets on refresh</span>{joined ? <button data-army-action className={s.primary} type="submit">Start discussion <ArrowUpRight size={16} /></button>
        : <button data-army-action className={s.primary} type="button" onClick={() => demo.toggle(view.army.id)}>Join to discuss <Plus size={16} /></button>}</div>
    </form>}
    {ordered.map((thread) => <article className={s.thread} key={thread.id}>
      <div className={s.votes}><button aria-label={`Upvote ${thread.title}`} aria-pressed={votes[thread.id] === 1} onClick={() => boards.vote(board.id, thread.id, 1)}><ArrowUp size={17} /></button><span>{thread.score + (votes[thread.id] ?? 0)}</span><button aria-label={`Downvote ${thread.title}`} aria-pressed={votes[thread.id] === -1} onClick={() => boards.vote(board.id, thread.id, -1)}><ArrowDown size={17} /></button></div>
      <div className={s.threadContent}><div className={s.threadMeta}><span>{thread.tag}</span><small>@{thread.author} · {thread.local ? "local demo" : "sample thread"}</small></div>
        <button className={s.threadTitle} aria-expanded={open === thread.id} onClick={() => setOpen(open === thread.id ? null : thread.id)}>{thread.title}</button>
        <p>{thread.body}</p><button className={s.replyLink} onClick={() => setOpen(open === thread.id ? null : thread.id)}><MessageSquare size={15} />{thread.replies.length} {thread.replies.length === 1 ? "reply" : "replies"} · Join in</button>
        {open === thread.id && <div className={s.threadReplies}>
          {thread.replies.map((item, index) => <p key={index}><strong>@{item.author}</strong> {item.text}</p>)}
          <form onSubmit={(event) => { event.preventDefault(); if (!joined || reply.trim().length < 2) return;
            boards.setThreadsFor(board, (current) => current.map((item) => item.id === thread.id ? { ...item, replies: [...item.replies, { author: "you.demo", text: reply.trim() }] } : item)); setReply("");
          }}><label className="sr-only" htmlFor={`study-thread-reply-${thread.id}`}>Reply to discussion</label><input id={`study-thread-reply-${thread.id}`} value={reply} onChange={(event) => setReply(event.target.value)} minLength={2} maxLength={500} required placeholder="Add your thought…" disabled={!joined} />{joined ? <button className={s.iconButton} type="submit" aria-label="Send discussion reply" disabled={reply.trim().length < 2}><Send size={17} /></button>
            : <button className={s.textAction} type="button" onClick={() => demo.toggle(view.army.id)}>Join to reply</button>}</form>
        </div>}
      </div>
    </article>)}
    {!ordered.length && <p className={s.empty}>No conversations match. Try another search.</p>}
    <Link className={s.boardLink} href="/s/nova">Open the full s/nova board <ArrowUpRight size={17} /></Link>
  </section>;
}

export function NovaLayoutStudy() {
  const demo = useDemo();
  const boards = useBoards();
  const joined = demo.enlisted.includes(view.army.id);
  const [section, setSection] = useState<Section>("army");
  const [sort, setSort] = useState("latest");
  const [share, setShare] = useState("");
  const navigation = useRef<HTMLElement>(null);
  const localNotes = demo.notes[view.army.id] ?? [];
  const feed = [fanNotes[1], fanNotes[0], fanNotes[2], fanNotes[3]];
  const sorted = sort === "loved" ? [...localNotes, ...feed].sort((a, b) => b.likes - a.likes) : [...localNotes, ...feed];
  function changeSection(next: Section) {
    setSection(next);
    requestAnimationFrame(() => navigation.current?.scrollIntoView({ block: "start", behavior: "instant" }));
  }
  const join = () => { if (!joined) demo.toggle(view.army.id); };
  return <main id="main" className={s.page}>
    <div className={s.wrap}>
      <div className={s.breadcrumb}><Link href="/discover"><ArrowLeft size={14} />Discover</Link><span>/</span><span>s/nova</span><Link className={s.compare} href="/armies/nova">Compare original <ArrowUpRight size={13} /></Link><span className={s.studyLabel}>LAYOUT STUDY · SAMPLE COMMUNITY</span></div>
      <section className={s.identity} aria-labelledby="study-army-name">
        <div className={s.cover} aria-hidden="true">
          <div className={s.coverType}><span>for the</span><strong>B-side<br /><i>people.</i></strong></div>
          <Image className={s.coverPortrait} src="/images/artist.jpg" alt="" width={560} height={420} priority />
          <div className={s.coverStamp}>FAN-RUN.<br />FEEL EVERYTHING.<span><StanStarIcon size={32} /></span></div>
          <div className={s.coverMargin}>NOVA REIGN / BUILT AROUND A FEELING</div>
        </div>
        <div className={s.identityContent}>
          <div className={s.armyAvatar}><Image src="/images/artist.jpg" alt="Nova Reign" width={78} height={78} /></div>
          <div className={s.identityCopy}><div className={s.identityEyebrow}>s/nova<span>FAN-RUN · ALTERNATIVE R&B</span></div><h1 id="study-army-name">Nova Reign’s Army<span><StanStarIcon size={31} /></span></h1><p>For the songs you rewind. And the people who understand why.</p><div className={s.host}><span>Hosted by <Link href="/fans/jess-wav">@jess.wav</Link></span><span><Users size={13} />{(view.army.count + Number(joined)).toLocaleString("en-GB")} demo stans</span></div></div>
          <div className={s.identityActions}><button className={s.primary} aria-pressed={joined} onClick={() => demo.toggle(view.army.id)}>{joined ? <Check size={17} /> : <Plus size={17} />}{joined ? "Joined" : "Join this Army"}</button><button className={s.shareButton} onClick={async () => {
            try { await navigator.clipboard.writeText(`${window.location.origin}/nova-preview`); setShare("Link copied"); } catch { setShare("Copy this page’s address to share."); }
          }}>Share <ArrowUpRight size={16} /></button><span className={s.shareStatus} role="status">{share || (joined ? "You’re in. Make yourself at home." : "Your people might be in here.")}</span></div>
        </div>
      </section>

      <nav className={s.communityNav} ref={navigation} aria-label="Army sections">
        {([['army', 'The Army'], ['discussions', 'Discussions'], ['about', 'About']] as const).map(([id, label]) => <button key={id} aria-pressed={section === id} onClick={() => changeSection(id)}>{label}{id === "discussions" && <span>{boards.threadsFor(board).length}</span>}</button>)}
        <a href="#study-chat" className={s.chatShortcut}><MessageCircle size={16} />Army Chat<ArrowUpRight size={13} /></a>
      </nav>

      <div className={s.columns}>
        <div className={s.mainColumn}>
          {section === "army" && <>
            <header className={s.feedHeading}><div><span className={s.tinyLabel}>FROM THE PEOPLE WHO GET IT</span><h2>In the Army.</h2></div><label className={s.feedSort}><span className="sr-only">Sort posts</span><select aria-label="Sort posts" value={sort} onChange={(event) => setSort(event.target.value)}><option value="latest">Latest posts</option><option value="loved">Most loved</option></select><ChevronDown size={14} /></label></header>
            {joined && <Composer joined={joined} join={join} />}
            {sorted.map((note, index) => <div className={s.feedItem} key={note.id}><Post note={note} />{!joined && index === 0 && <Composer joined={joined} join={join} />}</div>)}
            <div className={s.feedEnd}><span><StanStarIcon size={34} /></span><p>You’re all caught up.<br /><small>Good company. No endless scrolling.</small></p><Link href="/armies/nova/posts">View all posts <ArrowUpRight size={16} /></Link></div>
            <section className={s.discussionPreview}><header><span className={s.tinyLabel}>STILL THINKING ABOUT IT?</span><h2>Take it to the board.</h2></header>{boards.threadsFor(board).slice(0, 2).map((thread) => <button key={thread.id} onClick={() => changeSection("discussions")}><span><MessageSquare size={17} />{thread.title}</span><ArrowUpRight size={19} /></button>)}<button className={s.textAction} onClick={() => changeSection("discussions")}>All discussions <ArrowRight size={16} /></button></section>
          </>}
          {section === "discussions" && <Discussions />}
          {section === "about" && <section className={s.about} aria-labelledby="study-about-title"><span className={s.tinyLabel}>A LITTLE CORNER OF THE INTERNET</span><h2 id="study-about-title">Their music.<br /><em>Our people.</em></h2><p className={s.aboutLead}>{view.army.welcome}</p><div className={s.aboutHost}><Avatar initials="JW" tone={1} /><div><strong>@jess.wav</strong><span>Founding stan · community host</span></div></div><h3>Come as you are.</h3><p>Share a discovery. Ask a question. Make something. You don’t need the most obscure B-side or a ticket to every show to belong here.</p><h3>A few things we look after.</h3><ul><li>Be kind to the person behind the username.</li><li>Disagree about the music. Don’t attack each other.</li><li>Credit the things you share and respect people’s privacy.</li></ul><p className={s.smallStatus}>This is a sample community. Posts, messages and discussions are local demo interactions; they reset on refresh.</p></section>}
        </div>

        <aside className={s.sidebar} aria-label="Around the Army">
          <Chat joined={joined} join={join} />
          <Music />
          <section className={s.welcomeNote}><span className={s.tinyLabel}><Pin size={12} /> A NOTE FROM YOUR HOST</span><h2>You can sit<br /><em>with us.</em></h2><p>{view.army.welcome}</p><Link href="/fans/jess-wav"><Avatar initials="JW" tone={1} /><span>@jess.wav<small>Founding stan</small></span><ArrowUpRight size={15} /></Link></section>
          <section className={s.around}><span className={s.tinyLabel}>OUT IN THE WORLD</span><div className={s.event}><span className={s.date}><small>DEC</small><b>12</b></span><div><strong>Fan listening meetup</strong><p>Bristol, UK · illustrative event</p><small>Fan-organised · not bookable</small></div></div><a href="https://bandcamp.com" target="_blank" rel="noreferrer">Find your next favourite on Bandcamp <ArrowUpRight size={14} /></a></section>
        </aside>
      </div>
      <section className={s.invitation}><span className={s.invitationStar} aria-hidden="true"><StanStarIcon size={50} /></span><div><span className={s.tinyLabel}>MAKE SOME NOISE.</span><h2>There’s room for your obsession.</h2></div><Link href="/create">Start your own Army <ArrowUpRight size={18} /></Link></section>
      <p className={s.studyFoot}>An alternative layout using the existing Nova demo content. Your saved Army theme is unchanged. <Link href="/armies/nova">Back to the original ↗</Link></p>
    </div>
  </main>;
}

// Shared content, with opt-in window chrome suppression. The original study is unchanged.
export { Post as DesktopPost, Composer as DesktopComposer, Chat as DesktopChat, Music as DesktopMusic, Discussions as DesktopDiscussions };
