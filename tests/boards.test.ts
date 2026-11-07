import test from "node:test";
import assert from "node:assert/strict";
import { armies } from "../src/lib/data";
import {
  boards,
  boardById,
  boardPath,
  initialBoardThreads,
  parseMyBoards,
} from "../src/lib/boards";
test("each Army has its own artist board while communities are independent", () => {
  for (const army of armies) {
    const board = boardById(`s/${army.slug}`)!;
    assert.ok(board);
    assert.equal(board.armySlug, army.slug);
    assert.equal(boardPath(board), `/s/${army.slug}`);
  }
  for (const slug of ["popmusic", "disco", "2000s", "musicvideos"]) {
    const board = boardById(`com/${slug}`)!;
    assert.equal(board.kind, "com");
    assert.equal(board.armySlug, undefined);
  }
  assert.equal(new Set(boards.map((b) => b.id)).size, boards.length);
  assert.equal(boardById("s/../nova"), undefined);
  assert.equal(initialBoardThreads(boardById("s/nova")!)[0].id, "bridge");
  assert.notEqual(
    initialBoardThreads(boardById("com/disco")!)[0].title,
    initialBoardThreads(boardById("com/popmusic")!)[0].title,
  );
});
test("My Boards restore accepts only known IDs and removes duplicates", () => {
  assert.deepEqual(
    parseMyBoards(
      '["s/nova","com/disco","s/nova","javascript:bad",4,"__proto__"]',
    ),
    ["s/nova", "com/disco"],
  );
  for (const raw of ["{", "null", "{}", '"s/nova"'])
    assert.deepEqual(parseMyBoards(raw), []);
});
