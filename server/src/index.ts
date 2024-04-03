import express, { Express } from "express";
import { save, list, loadFile, savePracticeSession } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post('/api/save', save);
app.post('/api/savePracticeSession', savePracticeSession);
app.get("/api/list", list);
app.get("/api/loadFile", loadFile);
app.listen(port, () => console.log(`Server listening on ${port}`));
