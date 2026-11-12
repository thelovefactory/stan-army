"use client";
import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Board,
  Thread,
  initialBoardThreads,
  parseMyBoards,
  boardById,
} from "@/lib/boards";
const key = "stan-army:my-boards:v1";
function snapshot() {
  try {
    return localStorage.getItem(key) || "[]";
  } catch {
    return "[]";
  }
}
function subscribe(fn: () => void) {
  window.addEventListener("storage", fn);
  window.addEventListener("stan-boards", fn);
  return () => {
    window.removeEventListener("storage", fn);
    window.removeEventListener("stan-boards", fn);
  };
}
type State = {
  threadsFor: (board: Board) => Thread[];
  setThreadsFor: (
    board: Board,
    update: (threads: Thread[]) => Thread[],
  ) => void;
  votesFor: (id: string) => Record<string, number>;
  vote: (boardId: string, threadId: string, value: number) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  bookmarkStatus: string;
};
const Context = createContext<State | null>(null);
export function BoardsProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Record<string, Thread[]>>({});
  const [votes, setVotes] = useState<Record<string, Record<string, number>>>(
    {},
  );
  const [bookmarkStatus, setBookmarkStatus] = useState("");
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const favourites = parseMyBoards(raw);
  function toggleFavourite(id: string) {
    if (!boardById(id)) return;
    try {
      const current = parseMyBoards(snapshot());
      const added = !current.includes(id);
      localStorage.setItem(
        key,
        JSON.stringify(
          added ? [...current, id] : current.filter((x) => x !== id),
        ),
      );
      window.dispatchEvent(new Event("stan-boards"));
      setBookmarkStatus(
        added
          ? "Added to My Boards on this device."
          : "Removed from My Boards.",
      );
    } catch {
      setBookmarkStatus(
        "Could not save My Boards. Browser storage is unavailable or full.",
      );
    }
  }
  return (
    <Context.Provider
      value={{
        threadsFor: (b) => threads[b.id] || initialBoardThreads(b),
        setThreadsFor: (b, update) =>
          setThreads((c) => ({
            ...c,
            [b.id]: update(c[b.id] || initialBoardThreads(b)),
          })),
        votesFor: (id) => votes[id] || {},
        vote: (boardId, id, value) =>
          setVotes((c) => ({
            ...c,
            [boardId]: {
              ...c[boardId],
              [id]: c[boardId]?.[id] === value ? 0 : value,
            },
          })),
        favourites,
        toggleFavourite,
        bookmarkStatus,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useBoards() {
  const context = useContext(Context);
  if (!context) throw new Error("BoardsProvider missing");
  return context;
}
