import React, { Component, MouseEvent, ChangeEvent } from 'react'; //ChangeEvent, MouseEvent
import { Flashcard, flashcardsFromJson } from './Deck';
import "./css/FlashcardPractice.css";
import { isRecord } from './record';
import { PracticeHistory } from './PracticeHistory';
// import { isRecord } from './record';

type Card = { kind: "front" } | { kind: "back" };

type FlashcardPracticeProps = {
  onBackClick: () => void,
  name: string;
};

type FlashcardPracticeState = {
  flashcards: Flashcard[];
  card: Card;
  userName: string,

  index: number;
  numCorrect: number;
  numIncorrect: number;

  error: string;
  backClickTries: number;
};


// Shows a flashcard deck for practicing
export class FlashcardPractice extends Component<FlashcardPracticeProps, FlashcardPracticeState> {

  constructor(props: FlashcardPracticeProps) {
    super(props);

    this.state = {
      flashcards: [],
      card: { kind: "front" },
      userName: "",

      index: 0,
      numCorrect: 0,
      numIncorrect: 0,

      error: "",
      backClickTries: 0,
    };
  }


  render = (): JSX.Element => {
    // this could have been it's own component I guess...
    if (this.state.index !== 0 && this.state.index === this.state.flashcards.length) {
      return (
        <div>
          <h1>{this.props.name}</h1>
          <h2>Correct: {this.state.numCorrect} | Incorrect: {this.state.numIncorrect}</h2>
          <p>End of Quiz</p>
          <span>
            <label>Name: </label>
            <input onChange={this.doUserNameChange} value={this.state.userName}></input>
            <button onClick={this.doSubmitPracticeSessionClick}>Finish</button>
          </span>
          {this.renderError()}
        </div>
      );
    } else {
      return (
        <div>
          <h1>{this.props.name}</h1>
          <h2>Correct: {this.state.numCorrect} | Incorrect: {this.state.numIncorrect}</h2>
          {this.renderCurrentCard()}
          <button type="button" onClick={this.doFlipClick}>Flip</button>
          <button type="button" onClick={this.doCorrectClick}>Correct</button>
          <button type="button" onClick={this.doIncorrectClick}>Incorrect</button>
          <button type="button" style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }} onClick={this.doBackClick}>go Back</button>
          {this.renderError()}
        </div>
      )
    }
  };

  // render front or back if this.state.card == "front" or "back"
  renderCurrentCard = (): JSX.Element => {
    if (this.state.flashcards.length === 0) {
      return <p></p>;
    } else {
      if (this.state.card.kind === "front") {
        return (
          <div className="flashcard flashcard-front">
            {this.state.flashcards[this.state.index].front}
          </div>
        );
      } else {
        return (
          <div className="flashcard flashcard-back">
            {this.state.flashcards[this.state.index].back}
          </div>
        );
      }
    }
  }


  renderError = (): JSX.Element => {
    if (this.state.error === "") {
      return <div></div>
    } else {
      const style = {
        width: '300px', backgroundColor: 'rgb(246,194,192)',
        border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px'
      };
      return (<div style={{ marginTop: '15px' }}>
        <span style={style}><b>Warning</b> : {this.state.error}</span>
      </div>);
    }
  }


  componentDidMount = (): void => {
    this.doRefreshClick(this.props.name);
  }


  doRefreshClick = (name: string): void => {
    const url = "/api/loadFile?name=" + name;
    fetch(url).then((val) => this.doLoadResp(val))
      .catch(() => this.doLoadError("failed to connect to server"))
  }

  // handles response for doLoadClick
  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doLoadJson)
        .catch(() => this.doLoadError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
        .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`${res.headers}`);
    }
  }

  // handles json from doLoadRespff
  doLoadJson = (val: unknown): void => {
    if (!isRecord(val) || typeof val.name !== 'string') {
      console.error("bad data from /api/loadFile: not a record", val);
      return;
    }
    const flashcards: Flashcard[] = flashcardsFromJson(val.value);
    this.setState({ flashcards: flashcards, error: "" });
  }

  // handles errors from doLoadClick, doLoadResp or doLoadJson
  doLoadError = (msg: string): void => {
    console.error(msg);
  }

  // changes this.state.card.kind, to render front or back card
  doFlipClick = (_: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.card.kind === "front") {
      this.setState({ card: { kind: "back" }, error: "" });
    } else {
      this.setState({ card: { kind: "front" }, error: "" });
    }
  }

  // increments the card number we're on, and sets the this.state.card.kind to front, to render the front of the next card
  doCorrectClick = (_: MouseEvent<HTMLButtonElement>): void => {
    this.setState({ index: this.state.index + 1, numCorrect: this.state.numCorrect + 1, error: "", card: { kind: "front" } });
  }


  // increments the card number we're on, and sets the this.state.card.kind to front, to render the front of the next card
  doIncorrectClick = (_: MouseEvent<HTMLButtonElement>): void => {
    this.setState({ index: this.state.index + 1, numIncorrect: this.state.numIncorrect + 1, error: "", card: { kind: "front" } });
  }

  // tells parent component to render the "list" page
  doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.backClickTries === 0) {
      this.setState({ backClickTries: 1, error: "progress will be lost" })
    } else {
      this.props.onBackClick();
    }
  }


  doUserNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ userName: evt.target.value.trim(), error: "" });
  }


  doSubmitPracticeSessionClick = (_: MouseEvent<HTMLButtonElement>): void => {
    // only allow names without trailing spaces
    if (this.state.userName !== this.state.userName.trim()) {
      this.setState({ error: "no trailing spaces in the name please!" });
      // don't allowe empty names
    } else if (this.state.userName === "") {
      this.setState({ error: "please enter a name" });
    } else {
      this.doUploadClick();
    }
  }


  doUploadClick = (): void => {
    const score: number = Math.floor((this.state.numCorrect / this.state.flashcards.length) * 100);
    const args: PracticeHistory = { name: this.state.userName, deckName: this.props.name, score: score };
    fetch("/api/savePracticeSession", {
      method: "POST", body: JSON.stringify({ args }),
      headers: { "Content-Type": "application/json" }
    })
      .then(this.doUploadResp)
      .catch(() => this.doUploadError("failed to connect to server"));
  }


  doUploadResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doUploadJson)
        .catch(() => this.doUploadError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doUploadError)
        .catch(() => this.doUploadError("400 response is not text"));
    } else {
      this.doUploadError(`bad status code from /api/savePracticeSession: ${resp.status}`);
    }
  }

  // once a flashcard set is saved, go back to the main page.
  doUploadJson = (data: unknown): void => {
    // double check that the deck was saved.
    if (!isRecord(data) || typeof data.saved !== "boolean" || !data.saved) {
      console.error("bad data from /api/savePracticeSession: not a record", data);
      return;
    }
    this.props.onBackClick();
  }


  doUploadError = (msg: string): void => {
    console.error(`Error fetching /api/savePracticeSession: ${msg}`);
  }
}




