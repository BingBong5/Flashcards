import { isRecord } from "./record";

export type PracticeHistory = { name: string, deckName: string, score: number };


/**
 * parses given data into a PracticeHistory if data is valid, or returns undefined if malformatted
 * @param data input data
 * @returns PracticeHistory if given data is valid
 * @returns undefined if given data is invalid, where validity is decided by the given data having a 
 *          "name", "deckname" and "score" field of type string, string and number.
 */
export const parsePracticeHistory = (data: unknown): PracticeHistory | undefined => {
  if (!isRecord(data)) {
    return undefined;
  } else if (typeof data.name !== 'string' || data.name.length === 0) {
    return undefined;
  } else if (typeof data.deckName !== 'string' || data.deckName.length === 0) {
    return undefined;
  } else if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) {
    return undefined;
  } else {
    return { name: data.name, deckName: data.deckName, score: data.score };
  }
}