"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties } from "react";
import { ArrowUpRight, Globe2, Instagram, Settings2, X } from "lucide-react";
import { useProfileTheme } from "./profile-theme";
import { readableColor } from "@/lib/theme";
import {
  parseSocialConfig,
  socialAccount,
  socialStorageKey,
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
    createTimeline: (
      source: { sourceType: "profile"; screenName: string },
      element: HTMLElement,
      options: Record<string, string | number | boolean>,
    ) => Promise<HTMLElement | undefined>;
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
function XPreview({ handle, dark }: { handle: string; dark: boolean }) {
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
        "X hasn’t provided a preview. Open the profile instead, or close and try again.",
      );
    }, 20000);
    loadX()
      .then(async (x) => {
        if (stopped) return;
        const frame = await x.widgets.createTimeline(
          { sourceType: "profile", screenName: handle },
          container,
          {
            height: 280,
            theme: dark ? "dark" : "light",
            chrome: "noheader nofooter noborders",
            dnt: true,
            ariaPolite: "polite",
          },
        );
        if (stopped) {
          container.replaceChildren();
          return;
        }
        window.clearTimeout(timer);
        setStatus(
          frame
            ? "Provider preview. Availability and post order are controlled by X."
            : "X hasn’t provided a preview. Open the profile instead.",
        );
      })
      .catch(() => {
        if (stopped) return;
        window.clearTimeout(timer);
        setStatus(
          "X preview unavailable. Open the profile instead, or close and try again.",
        );
      });
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      container.replaceChildren();
    };
  }, [handle, dark]);
  return (
    <>
      <div ref={host} className="outside-widget" />
      <p className="outside-hint" role="status">
        {status}
      </p>
    </>
  );
}
function InstagramPreview({ account }: { account: SocialAccount }) {
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    timer.current = window.setTimeout(() => setFailed(true), 15000);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);
  // The official profile iframe works for the supplied account even though
  // Meta's oEmbed endpoint rejects that same URL. Do not use oEmbed as a gate.
  // An iframe load event does not prove that its cross-origin posts are visible.
  return failed ? (
    <p className="outside-hint" role="status">
      Instagram hasn’t provided a preview. Open the profile instead, or close
      and try again.
    </p>
  ) : (
    <iframe
      className="outside-instagram"
      title={`Instagram profile preview: @${account.handle}`}
      src={`${account.url}embed/`}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={() => {
        if (timer.current !== null) window.clearTimeout(timer.current);
      }}
      onError={() => setFailed(true)}
    />
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
  return (
    <article
      className="outside-channel"
      aria-label={`${name} channel @${account.handle}`}
    >
      <div className="outside-source">
        <span>
          {account.platform === "instagram" ? (
            <Instagram size={16} />
          ) : (
            <span aria-hidden="true">𝕏</span>
          )}
          <b>{name}</b>
        </span>
        <a href={account.url} target="_blank" rel="noreferrer">
          @{account.handle}
          <ArrowUpRight size={14} />
        </a>
      </div>
      {!loaded ? (
        <button type="button" className="outside-load" onClick={onToggle}>
          Load {name} preview
        </button>
      ) : (
        <>
          {account.platform === "x" ? (
            <XPreview
              handle={account.handle}
              dark={readableColor("#ffffff", theme.panels.color) === "#ffffff"}
            />
          ) : (
            <>
              <InstagramPreview account={account} />
              <p className="outside-hint">
                Instagram controls this preview. If it’s unavailable or asks you
                to sign in, use the profile link above.
              </p>
            </>
          )}
          <button type="button" className="outside-close" onClick={onToggle}>
            Close {name} preview
          </button>
        </>
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
    if (
      save({
        schemaVersion: 1,
        accounts: [
          ...config.accounts.filter((a) => a.platform !== account.platform),
          account,
        ],
      })
    )
      setUrl("");
  }
  const accent = readableColor(
    theme.outsideArmy.accent ?? theme.colors.accent,
    theme.panels.color,
  );
  return (
    <section
      className={`panel outside-army outside-${theme.outsideArmy.treatment}`}
      style={{ "--outside-accent": accent } as CSSProperties}
      aria-labelledby={`outside-heading-${armyId}`}
    >
      <header className="outside-header">
        <h2 id={`outside-heading-${armyId}`}>
          <Globe2 size={18} />
          Outside the Army
        </h2>
        <span>PUBLIC PREVIEWS</span>
      </header>
      <p className="outside-intro">A little window into elsewhere.</p>
      <div className="outside-channels">
        {config.accounts.map((account) => (
          <Channel
            key={account.url}
            account={account}
            loaded={active === account.url}
            onToggle={() =>
              setActive(active === account.url ? null : account.url)
            }
          />
        ))}
      </div>
      {!config.accounts.length && (
        <p className="outside-hint">No outside channels added yet.</p>
      )}
      <p className="outside-hint">
        Loads from Instagram or X only when you click. Providers may use cookies
        or require sign-in. Profile links aren’t verified affiliations.
      </p>
      {canEditCommunity && (
        <details className="outside-manage">
          <summary>
            <Settings2 size={15} />
            Manage channels
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
