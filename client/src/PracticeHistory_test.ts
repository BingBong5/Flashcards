import * as assert from 'assert';
import { parsePracticeHistory } from './PracticeHistory';


describe('PracticeHistory', function () {

  it('parsePracticeHistory', function () {
    //first branch, passed data isn't record
    assert.deepStrictEqual(parsePracticeHistory(0), undefined);
    assert.deepStrictEqual(parsePracticeHistory("hello"), undefined);
    //second branch, passed data does not have name field of type string
    assert.deepStrictEqual(parsePracticeHistory({ name: false }), undefined);
    assert.deepStrictEqual(parsePracticeHistory({ name: "" }), undefined);
    //third branch, passed data does not have a deckName field of type string
    assert.deepStrictEqual(parsePracticeHistory({ name: "a" }), undefined);
    assert.deepStrictEqual(parsePracticeHistory({ name: "b", deckName: 5 }), undefined);
    //fourth branch, passed data does not have a score field of type number
    assert.deepStrictEqual(parsePracticeHistory({ name: "55", deckName: "c" }), undefined);
    assert.deepStrictEqual(parsePracticeHistory({ name: "s", deckName: "d", score: false }), undefined);
    //fifth branch, valid data!
    assert.deepStrictEqual(parsePracticeHistory({ name: "s", deckName: "d", score: 44 }),
      { name: "s", deckName: "d", score: 44 });
    assert.deepStrictEqual(parsePracticeHistory({ name: "d", deckName: "3", score: 78 }),
      { name: "d", deckName: "3", score: 78 });
  })
});