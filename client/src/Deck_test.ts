import * as assert from "assert";
import { parseFlashcards, getFlashcards, flashcardsFromJson } from './Deck';


describe('Deck', function () {
  it('parseFlashcards', function () {
    //first branch
    assert.deepStrictEqual(parseFlashcards("di"), undefined);
    assert.deepStrictEqual(parseFlashcards(""), undefined);

    //second branch
    assert.deepStrictEqual(parseFlashcards("apple|fruit"), [{ front: "apple", back: "fruit" }]);
    assert.deepStrictEqual(parseFlashcards("banana|alsofrruit"), [{ front: "banana", back: "alsofrruit" }]);
  });

  it('getFlashcards', function () {
    //0-1-many first branch 0 loops
    assert.deepStrictEqual(getFlashcards([]), undefined);

    //0-1-many second branch - 1 loop - return Flashcards[]
    assert.deepStrictEqual(getFlashcards(["apple|butt"]), [{ front: "apple", back: "butt" }]);
    assert.deepStrictEqual(getFlashcards(["booty|whole"]), [{ front: "booty", back: "whole" }]);

    //0-1-many second branch - 1 loop - return undefined
    assert.deepStrictEqual(getFlashcards(["apple|b|utt"]), undefined);
    assert.deepStrictEqual(getFlashcards(["tt"]), undefined);

    //0-1-many second branch - 2+ loops - return Flashcards[]
    assert.deepStrictEqual(getFlashcards(["dingle|dong", "shwing|clicng"]),
      [{ front: "dingle", back: "dong" }, { front: "shwing", back: "clicng" }]);
    assert.deepStrictEqual(getFlashcards(["a|b", "c|d", "e|f"]),
      [{ front: "a", back: "b" }, { front: "c", back: "d" }, { front: "e", back: "f" }]);

    //0-1-many second branch - 2+ loops - return undefined
    assert.deepStrictEqual(getFlashcards(["I'm|enjoyinglearningaboutreact", "po"]),
      undefined);
    assert.deepStrictEqual(getFlashcards(["1|2", "3|4", "knes||pe"]),
      undefined);
  })

  it('flashcardsFromJson', function () {
    //0-1-many 0 loops
    assert.throws(() => flashcardsFromJson(23), Error);
    assert.throws(() => flashcardsFromJson({ name: "bob" }), Error);

    //0-1-many 1 loop - error
    assert.throws(() => flashcardsFromJson([{ ding: 2 }]), Error);
    assert.throws(() => flashcardsFromJson([{ ok: "and?", dong: 2 }]), Error);

    //0-1-many 1 loop - Flashcard[] returned
    assert.deepStrictEqual(flashcardsFromJson([{ front: "happy", back: "boat" }]), [{ front: "happy", back: "boat" }])
    assert.deepStrictEqual(flashcardsFromJson([{ front: "apple", back: "frick" }]), [{ front: "apple", back: "frick" }])

    //0-1-many 2+ loops - error
    const records1 = [{ front: "hum", back: "dum" }, { front: "ok", back: "dokie" }, { frick: "this" }];
    assert.throws(() => flashcardsFromJson([{ front: "peace", back: "bewithyou" }, { this: "22" }]), Error);
    assert.throws(() => flashcardsFromJson(records1), Error);

    //0-1-many 2+loops - Flashcard[] returned
    assert.deepStrictEqual(flashcardsFromJson([{ front: "a", back: "b" }, { front: "c", back: 'd' }])
      , [{ front: "a", back: "b" }, { front: "c", back: "d" }])
    assert.deepStrictEqual(flashcardsFromJson([{ front: "1", back: "2" }, { front: "3", back: '4' }, { front: 'apple', back: 'dingle' }])
      , [{ front: "1", back: "2" }, { front: "3", back: "4" }, { front: "apple", back: "dingle" }])

  });


});