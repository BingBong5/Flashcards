import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// <name, flashcard[]>
const files: Map<string, unknown> = new Map<string, unknown>();
let practiceHistory: unknown[] = [];

/**
 * saves a file, if a file name is not used, send:
 *      {name: nameOfFile, "saved": false};
 * otherwise send:
 *      {name: nameOfFile, "saved": ture};
 * 
 */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name: string | undefined = first(req.body.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }

  // if (files.has(name)) {
  //   res.status(400).send(`flashcard deck for ${name} already exists`);
  //   return;
  // }
  if (files.has(name)) {
    res.send({ name: name, "saved": false });
    return;
  } else {
    files.set(name, req.body.value);
    res.send({ name: name, "saved": true });
  }
}

/**
 * handles requests for /api/savePracticeSession, returns a record of {"saved": true}
 */
export const savePracticeSession = (req: SafeRequest, res: SafeResponse): void => {
  if (!isRecord(req.body.args)) {
    res.status(400).send('required argument "args" was missing');
    return;
  }

  const name = req.body.args.name;
  if (typeof name !== 'string') {
    res.status(400).send('required argument "name" was not a string');
    return;
  }

  const deckName = req.body.args.deckName;
  if (typeof deckName !== 'string') {
    res.status(400).send('required argument "deckName" was not a string');
    return;
  }

  const score = req.body.args.score;
  if (typeof score !== 'number') {
    res.status(400).send('required argument "score" was not a number');
    return;
  }

  practiceHistory.push({ name: name, deckName: deckName, score: score });
  res.send({ "saved": true });
}




/** Handles requests for /api/list by returning an array of names of available flashcard decks
 *  and the list of practice histories
 */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  const file_names: string[] = [];

  for (const key of files.keys()) {
    file_names.push(key);
  }

  res.send({ values: { fileNames: file_names, practiceHistory: practiceHistory } });
}


/** Handles requests for /load by returning requested file, if it exists */
export const loadFile = (req: SafeRequest, res: SafeResponse): void => {
  const name: string | undefined = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  if (!files.has(name)) {
    res.status(404).send(`${name} not found in server`);
    return;
  }

  res.send({ name: name, value: files.get(name) });
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string | undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};


/** Used in tests to set the transcripts map back to empty. */
export const resetTranscriptsForTesting = (): void => {
  // Do not use this function except in tests!
  files.clear();
  practiceHistory = [];
};

/**
 * Determines whether the given value is a record.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
};