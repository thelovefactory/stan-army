"use client";
import { useState, useRef } from "react";
import { Send, Pin, MessageCircle } from "lucide-react";
import { ArmyView } from "@/lib/data";
import { StanStarIcon } from "./stan-icons";
import { useDemo } from "./demo-provider";
const initialMessages = [
  {
    name: "lucid.lou",
    color: "mint",
    initials: "LL",
    time: "18:42",
    text: "That last chorus has been living in my head all week.",
  },
  {
    name: "jess.wav",
    color: "pink",
    initials: "JW",
    time: "18:43",
    text: "Started with a playlist and a group chat. Look at us now. 🖤",
  },
  {
    name: "milo.mp3",
    color: "blue",
    initials: "MM",
    time: "18:45",
    text: "Anyone else listening with the lights off? A whole different feeling.",
  },
];
export function ArmyChat({
  view,
  focused = false,
}: {
  view: ArmyView;
  focused?: boolean;
}) {
  const { army, founder } = view;
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const { messages, send } = useDemo();
  const end = useRef<HTMLDivElement>(null);
  const local = messages[army.id] || [];
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) {
      setNotice("Write a message before sending.");
      return;
    }
    send(army.id, draft.trim());
    setDraft("");
    setNotice("Added to your local demo conversation. Only you can see this.");
    requestAnimationFrame(() =>
      end.current?.scrollIntoView({ behavior: "instant", block: "nearest" }),
    );
  }
  return (
    <section
      className={`panel army-chat ${focused ? "focused-chat" : ""}`}
      aria-labelledby="chat-heading"
    >
      <div className="panel-title">
        <h2 id="chat-heading">
          <MessageCircle size={18} /> Army Chat{" "}
          <span className="mint-text">
            <StanStarIcon size={22} />
          </span>
        </h2>
        <span className="demo-pill">DEMO ROOM</span>
      </div>
      <p className="chat-intro">Pull up a seat. You’re among your people.</p>
      <div className="pinned-message">
        <Pin size={15} />
        <div>
          <span>
            PINNED BY {`@${founder.handle.toUpperCase()} · FOUNDING STAN`}
          </span>
          <p>
            Welcome to the army. Tell us the song that brought you here. Be
            kind, keep it music. 🖤
          </p>
        </div>
      </div>
      <div
        className="chat-messages"
        role="log"
        aria-label="Demo conversation"
        aria-live="polite"
      >
        <p className="chat-date">SAMPLE CONVERSATION · FICTIONAL FANS</p>
        {initialMessages.map((m) => (
          <div className="chat-message" key={m.name}>
            <span className={`fan-avatar fan-${m.color}`}>{m.initials}</span>
            <div>
              <div className="message-meta">
                <b className={`${m.color}-text`}>@{m.name}</b>
                <time>{m.time}</time>
              </div>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        <div className="chat-message artist-message">
          <span className="fan-avatar fan-orange">
            {founder.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <div className="message-meta">
              <b className="orange-text">@{founder.handle}</b>
              <span className="artist-label">FOUNDING STAN · DEMO</span>
              <time>18:46</time>
            </div>
            <p>
              Friday ritual: three favourite songs, one new friend. Who’s coming
              to the fan listening meetup? ✳
            </p>
          </div>
        </div>
        {local.map((m, i) => (
          <div className="chat-message" key={i}>
            <span className="fan-avatar fan-mint">YO</span>
            <div>
              <div className="message-meta">
                <b className="mint-text">@you.demo</b>
                <time>{m.time}</time>
              </div>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <form onSubmit={submit} className="chat-compose">
        <label htmlFor="chat-draft" className="sr-only">
          Your demo chat message
        </label>
        <input
          id="chat-draft"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setNotice("");
          }}
          placeholder="Say something to the army…"
          maxLength={280}
          autoComplete="off"
        />
        <button
          type="submit"
          aria-label="Send demo message"
          disabled={!draft.trim()}
        >
          <Send size={18} />
        </button>
      </form>
      <div className="chat-compose-meta">
        <span>{draft.length}/280 · Be kind. Stay human.</span>
        <span>LOCAL ONLY</span>
      </div>
      <p role="status" className="chat-status">
        {notice ||
          "Demo messages are visible only to you and reset on refresh."}
      </p>
    </section>
  );
}
