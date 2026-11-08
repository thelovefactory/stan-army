"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Instagram, Settings2, X } from "lucide-react";
import { useProfileTheme } from "./profile-theme";
import { readableColor } from "@/lib/theme";
import {
  parseSocialConfig,
  socialAccount,
  socialStorageKey,
  socialPost,
  MAX_SOCIAL_POSTS,
} from "@/lib/social-channels";
import type { SocialAccount, SocialConfig } from "@/lib/social-channels";

const changeEvent = "stan-army:social-updated";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}
type XWidget = {
  ready: (callback: () => void) => void;
  widgets: {
    createTweet: (id: string, element: HTMLElement, options: Record<string, string | number | boolean>) => Promise<HTMLElement | undefined>;

  };
};
declare global {
  interface Window {
    twttr?: XWidget;
  }
}
let xScript: Promise<XWidget> | null = null;
function loadX() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr);
  if (xScript) return xScript;
  xScript = new Promise<XWidget>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    const timer = window.setTimeout(fail, 15000);
    function fail() {
      window.clearTimeout(timer);
      script.remove();
      xScript = null;
      reject(new Error("X preview unavailable"));
    }
    script.onerror = fail;
    script.onload = () => {
      if (!window.twttr) {
        fail();
        return;
      }
      window.twttr.ready(() => {
        window.clearTimeout(timer);
        if (window.twttr?.widgets) resolve(window.twttr);
        else fail();
      });
    };
    document.head.appendChild(script);
  });
  return xScript;
}
function XPreview({ dark, post }: { dark: boolean; post: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Loading X preview…");
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let stopped = false;
    const timer = window.setTimeout(() => {
      stopped = true;
      container.replaceChildren();
      setStatus(
        "Preview unavailable.",
      );
    }, 20000);
    loadX()
      .then(async (x) => {
        if (stopped) return;
        const options = { theme: dark ? "dark" : "light", dnt: true, conversation: "none" };
        const frame = await x.widgets.createTweet(post.split("/").at(-1)!, container, options);
        if (stopped) {
          container.replaceChildren();
          return;
        }
        window.clearTimeout(timer);
        setStatus(
          frame
            ? ""
            : "Preview unavailable.",
        );
      })
      .catch(() => {
        if (stopped) return;
        window.clearTimeout(timer);
        setStatus(
          "Preview unavailable.",
        );
      });
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      container.replaceChildren();
    };
  }, [dark, post]);
  return (
    <>
      <div ref={host} className="outside-widget" />
      {status && <p className="outside-hint" role="status">{status}</p>}
    </>
  );
}
function InstagramPreview({ account, post }: { account: SocialAccount; post: string }) {
  const [failed, setFailed] = useState(false);
  const [height, setHeight] = useState(560);
  const frame = useRef<HTMLIFrameElement>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    timer.current = window.setTimeout(() => setFailed(true), 15000);
    // Instagram's embed measurement is accepted only from this exact frame.
    function measure(event: MessageEvent) {
      if (event.origin !== "https://www.instagram.com" || event.source !== frame.current?.contentWindow) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const next = Number(data?.details?.height);
        if (data?.type === "MEASURE" && Number.isFinite(next) && next > 0) {
          setHeight(Math.min(1200, Math.max(320, next)));
        }
      } catch { /* Ignore unrelated provider messages. */ }
    }
    window.addEventListener("message", measure);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      window.removeEventListener("message", measure);
    };
  }, []);
  return failed ? (
    <p className="outside-hint" role="status">Preview unavailable.</p>
  ) : (
    <iframe ref={frame} className="outside-instagram"
      style={{ height }}
      title={`Instagram post preview: @${account.handle}`}
      src={`${post}embed/captioned/`}
      loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
      onLoad={() => { if (timer.current !== null) window.clearTimeout(timer.current); }}
      onError={() => setFailed(true)} />
  );
}
function Channel({
  account,
  loaded,
  onToggle,
}: {
  account: SocialAccount;
  loaded: boolean;
  onToggle: () => void;
}) {
  const { theme } = useProfileTheme();
  const name = account.platform === "instagram" ? "Instagram" : "X";
  const [index, setIndex] = useState(0);
  const posts = account.posts ?? [];
  const position = Math.min(index, Math.max(0, posts.length - 1));
  const post = posts[position];
  return (
    <article className="outside-channel" aria-label={`${name} channel @${account.handle}`}>
      <div className="outside-media">
        {!post ? (
          <div className="outside-empty">
            {account.platform === "instagram" ? <Instagram size={28} /> : <span aria-hidden="true">𝕏</span>}
            <p>No post previews yet.</p>
            <a href={account.url} target="_blank" rel="noreferrer">View on {name} <ArrowUpRight size={14} /></a>
          </div>
        ) : !loaded ? (
          <div className="outside-empty">
            <button type="button" className="outside-load" onClick={onToggle}>
              {account.platform === "instagram" ? <Instagram size={28} /> : <span aria-hidden="true">𝕏</span>}
              Load {name} post
            </button>
            <p className="outside-hint">Loads {name} content · may use cookies</p>
          </div>
        ) : account.platform === "x" ? (
          <XPreview key={post} post={post}
            dark={readableColor("#ffffff", theme.panels.color) === "#ffffff"} />
        ) : <InstagramPreview key={post} account={account} post={post} />}
      </div>
      {post && (
        <nav className="outside-tools" aria-label={`${name} preview navigation`}>
          <button type="button" aria-label="Previous post" title="Previous post"
            disabled={position === 0} onClick={() => setIndex(position - 1)}><ArrowLeft size={17} /></button>
          <span aria-live="polite">{position + 1} / {posts.length}</span>
          <button type="button" aria-label="Next post" title="Next post"
            disabled={position === posts.length - 1} onClick={() => setIndex(position + 1)}><ArrowRight size={17} /></button>
          <a className="outside-original" href={post} target="_blank" rel="noreferrer"
            aria-label={`Open original ${name} post`} title="Open original"><ArrowUpRight size={17} /></a>
          {loaded && <button type="button" className="outside-close" onClick={onToggle}
            aria-label="Close preview" title="Close preview"><X size={16} /></button>}
        </nav>
      )}
    </article>
  );
}

export function OutsideArmy({ armyId }: { armyId: string }) {
  const { theme, canEditCommunity } = useProfileTheme();
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(socialStorageKey(armyId));
      } catch {
        return null;
      }
    },
    () => null,
  );
  const config = useMemo(() => parseSocialConfig(raw, armyId), [raw, armyId]);
  const [url, setUrl] = useState("");
  const [postUrls, setPostUrls] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  function save(next: SocialConfig) {
    if (!canEditCommunity) return false;
    setNotice("");
    try {
      window.localStorage.setItem(
        socialStorageKey(armyId),
        JSON.stringify(next),
      );
      setActive(null);
      window.dispatchEvent(new Event(changeEvent));
      setError("");
      setNotice("Channels saved on this device.");
      return true;
    } catch {
      setError(
        "Couldn’t save: browser storage is unavailable or full. Existing channels are unchanged.",
      );
      return false;
    }
  }
  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!canEditCommunity) return;
    const account = socialAccount(url);
    if (!account) {
      setError(
        "Enter a public Instagram or X profile URL, without query parameters. Post links and other sites aren’t supported here.",
      );
      return;
    }
    const lines = postUrls.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const posts = lines.map((line) => socialPost(line, account));
    if (lines.length > MAX_SOCIAL_POSTS || posts.some((post) => !post)) {
      setError(`Add up to ${MAX_SOCIAL_POSTS} valid post links from the selected platform, one per line. X links must match the account. Remove tracking query parameters.`);
      return;
    }
    account.posts = [...new Set(posts as string[])];
    if (
      save({
        schemaVersion: 1,
        accounts: [
          ...config.accounts.filter((a) => a.platform !== account.platform),
          account,
        ],
      })
    ) {
      setUrl("");
      setPostUrls("");
    }
  }
  const accent = readableColor(
    theme.outsideArmy.accent ?? theme.colors.accent,
    theme.panels.color,
  );
  const selectedAccount = config.accounts.find((account) => account.url === selected) ?? config.accounts[0];
  if (!config.accounts.length && !canEditCommunity) return null;
  return (
    <section
      className={`panel outside-army outside-${theme.outsideArmy.treatment} ${canEditCommunity ? "outside-has-manager" : ""}`}
      style={{ "--outside-accent": accent } as CSSProperties}
      aria-labelledby={`outside-heading-${armyId}`}
    >
      <h2 className="sr-only" id={`outside-heading-${armyId}`}>Outside the Army</h2>
      <div className="outside-toolbar">
        {selectedAccount && <a className="outside-account" href={selectedAccount.url} target="_blank" rel="noreferrer">
          @{selectedAccount.handle}
        </a>}
        {!!config.accounts.length && (
          <div className="outside-tabs" role="group" aria-label="Social channels">
            {config.accounts.map((account) => (
              <button type="button" key={account.url}
                aria-label={account.platform === "instagram" ? "Instagram" : "X"}
                title={account.platform === "instagram" ? "Instagram" : "X"}
                aria-pressed={selectedAccount?.url === account.url}
                onClick={() => { setSelected(account.url); setActive(null); }}>
                {account.platform === "instagram" ? <Instagram size={17} /> : <span aria-hidden="true">𝕏</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="outside-channels">
        {selectedAccount && (
          <Channel key={selectedAccount.url} account={selectedAccount}
            loaded={active === selectedAccount.url}
            onToggle={() => setActive(active === selectedAccount.url ? null : selectedAccount.url)} />
        )}
      </div>
      {!config.accounts.length && (
        <p className="outside-hint">No outside channels added yet.</p>
      )}
      {canEditCommunity && (
        <details className="outside-manage">
          <summary aria-label="Manage channels" title="Manage channels">
            <Settings2 size={17} />
            <span className="sr-only">Manage channels</span>
          </summary>
          <p className="outside-hint">
            Demo settings saved on this device. One profile per platform; saving
            replaces its existing link.
          </p>
          <ul>
            {config.accounts.map((account) => (
              <li key={account.url}>
                <span>
                  {account.platform === "x" ? "X" : "Instagram"} · @
                  {account.handle}
                </span>
                <button type="button" className="outside-edit" aria-label={`Edit ${account.platform} previews`}
                  onClick={() => { setUrl(account.url); setPostUrls((account.posts ?? []).join("\n")); }}>Edit</button>
                <button
                  type="button"
                  aria-label={`Remove ${account.platform} account ${account.handle}`}
                  onClick={() =>
                    save({
                      schemaVersion: 1,
                      accounts: config.accounts.filter(
                        (a) => a.url !== account.url,
                      ),
                    })
                  }
                >
                  <X size={16} />
                  <span className="sr-only">Remove</span>
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={add}>
            <label htmlFor={`outside-url-${armyId}`}>
              Instagram or X profile URL
            </label>
            <input
              id={`outside-url-${armyId}`}
              type="url"
              required
              maxLength={240}
              value={url}
              placeholder="https://www.instagram.com/yourname/"
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
                setNotice("");
              }}
            />
            <label htmlFor={`outside-posts-${armyId}`}>Post links (optional, newest first)</label>
            <textarea id={`outside-posts-${armyId}`} rows={3} maxLength={3000}
              value={postUrls} onChange={(event) => setPostUrls(event.target.value)}
              placeholder="One public post URL per line" />
            <p className="outside-hint">Up to 12 selected previews. Instagram links must belong to this account. These do not update automatically. Leave blank to show a profile link without a post preview.</p>
            <button type="submit">Save channel</button>
          </form>
          <p className="outside-hint">
            Enable, hide or restyle this module in Customise.
          </p>
        </details>
      )}
      {error && (
        <p className="outside-status" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="outside-hint" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
