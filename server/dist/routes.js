"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecord = exports.resetTranscriptsForTesting = exports.loadFile = exports.list = exports.savePracticeSession = exports.save = void 0;
// <name, flashcard[]>
const files = new Map();
// const completions: unknown[] = [];
let practiceHistory = [];
/**
 * saves a file, if a file name is already used, old file is overwritten
 * @param req The request object which should have a body.name and a body.value field
 * @param res The response object
 */
const save = (req, res) => {
    const name = first(req.body.name);
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
    }
    else {
        files.set(name, req.body.value);
        res.send({ name: name, "saved": true });
    }
};
exports.save = save;
/**
 * handles requests for /api/savePracticeSession, returns a record of {"saved": true}
 */
const savePracticeSession = (req, res) => {
    if (!(0, exports.isRecord)(req.body.args)) {
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
};
exports.savePracticeSession = savePracticeSession;
/** Handles requests for /api/list by returning an array of names of available flashcard decks
 *  and the list of practice histories
 */
const list = (_req, res) => {
    const file_names = [];
    for (const key of files.keys()) {
        file_names.push(key);
    }
    res.send({ values: { fileNames: file_names, practiceHistory: practiceHistory } });
};
exports.list = list;
/** Handles requests for /load by returning requested file, if it exists */
const loadFile = (req, res) => {
    const name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send('required argument "name" was missing');
        return;
    }
    if (!files.has(name)) {
        res.status(404).send(`${name} not found in server`);
        return;
    }
    res.send({ name: name, value: files.get(name) });
};
exports.loadFile = loadFile;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param) => {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
/** Used in tests to set the transcripts map back to empty. */
const resetTranscriptsForTesting = () => {
    // Do not use this function except in tests!
    files.clear();
    practiceHistory = [];
};
exports.resetTranscriptsForTesting = resetTranscriptsForTesting;
/**
 * Determines whether the given value is a record.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
const isRecord = (val) => {
    return val !== null && typeof val === "object";
};
exports.isRecord = isRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRQSxzQkFBc0I7QUFDdEIsTUFBTSxLQUFLLEdBQXlCLElBQUksR0FBRyxFQUFtQixDQUFDO0FBQy9ELHFDQUFxQztBQUNyQyxJQUFJLGVBQWUsR0FBYyxFQUFFLENBQUM7QUFFcEM7Ozs7R0FJRztBQUNJLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDaEUsTUFBTSxJQUFJLEdBQXVCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzdELE9BQU87S0FDUjtJQUVELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzdCLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN2QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQzlELE9BQU87S0FDUjtJQUVELHlCQUF5QjtJQUN6Qix1RUFBdUU7SUFDdkUsWUFBWTtJQUNaLElBQUk7SUFDSixJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDekMsT0FBTztLQUNSO1NBQU07UUFDTCxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxJQUFJ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