export type Deck = {
  name: string;
  flashcards: Flashcard[]
}


export type Flashcard = {
  front: string;
  back: string;
}


/**
 * parses text and returns an array of Flashcards, or undefined if text 
 * is improperly formatted
 * @param text input text
 * @returns Flashcard[] if text is formatted
 * @returns undefined if text is poorly formatted, where text should be
 * separated by newline characters, formatted as:
 *        front|back
 */
export const parseFlashcards = (text: string): Flashcard[] | undefined => {
  //smallent flashcard is a|b, with length of 3
  if (text.length < 3) {
    return undefined;
  } else {
    return getFlashcards(text.split('\n'));
  }
}


/**
 * helper function for parseFlashcards()
 * parses string array into a Flashcard array, or returns undefined if
 * Array is of length 0, or any of the strings are malformatted
 * @param cards passed string array
 * @returns Flashcard[] if all strings are properly formatted as: front|back
 * @returns undefined if any of strings are malformatted
 */
export const getFlashcards = (cards: string[]): Flashcard[] | undefined => {
  // array is empty
  if (cards.length === 0) {
    return undefined;
  } else {
    const flashcards: Flashcard[] = [];
    for (const card of cards) {
      const index = card.indexOf('|');
      const lastIndex = card.lastIndexOf('|');
      // poorly formatted flashcard, | is not in string, or at front of string or at end of string
      if (card.length < 3 || index <= 0 || index === card.length - 1 || index !== lastIndex) {
        return undefined;
      } else {
        const front: string = card.substring(0, index).trim();
        const back: string = card.substring(index + 1, card.length).trim();

        flashcards.push({ front: front, back: back });
      }
    }
    return flashcards;
  }
}


/**
 * parses Json file into a Flashcard[], returns undefined if Json is malformatted
 * @param data passed Json which should be array of flashcards
 * @returns Flashcard[] if Json has required fields of a Flashcard[] (flashcards: Flashcard[])
 * @returns undefined if passed Json is malformatted
 */
export const flashcardsFromJson = (data: unknown): Flashcard[] => {
  if (!Array.isArray(data)) {
    throw new Error("flashcardsFromJson: passed data is not an array");
  } else {
    const flashcards: Flashcard[] = [];
    for (const card of data) {
      if (typeof card.front !== 'string' || typeof card.back !== 'string') {
        throw new Error(`flashcardFromJson: passed data is not valid flashcard ${card}`);
      } else {
        flashcards.push(card);
      }
    }
    return flashcards;
  }
}
