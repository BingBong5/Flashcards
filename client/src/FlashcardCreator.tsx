import React, { Component, ChangeEvent } from 'react'; //ChangeEvent, MouseEvent
import { Flashcard, parseFlashcards } from './Deck';
import { isRecord } from './record';
// import { isRecord } from './record';


type FlashcardCreatorProps = {
  doBackClick: () => void,
};

type FlashcardCreatorState = {
  name: string;
  content: string;
  error: string;
};


// shows page for creating a new flashcard
export class FlashcardCreator extends Component<FlashcardCreatorProps, FlashcardCreatorState> {

  constructor(props: FlashcardCreatorProps) {
    super(props);

    this.state = {
      error: "",
      name: "",
      content: "",
    };
  }

  render = (): JSX.Element => {
    return (
      <div>
        <h1>Create</h1>
        <span>Name:</span>
        <input style={{ marginLeft: '5px', marginRight: '1px' }} type=" text" value={this.state.name} onChange={this.doNameChange}></input>
        <div>
          <label htmlFor="textbox">Options: (one per line, formatted as front|back)</label>
          <br />
          <textarea id="textbox" rows={8} cols={50} onChange={this.doContentChange} value={this.state.content}></textarea>
        </div>
        <button onClick={this.doSaveClick}>Save Deck</button>
        <button onClick={this.props.doBackClick}>Discard</button>
        {this.renderError()}
      </div>
    )
  };

  // renders an error, if there is one
  renderError = (): JSX.Element => {
    if (this.state.error === "") {
      return <div></div>
    } else {
      const style = {
        width: '300px', backgroundColor: 'rgb(246,194,192)',
        border: '1px solid rgb(137,66,61)', borderRadius: '5px', padding: '5px'
      };
      return (<div style={{ marginTop: '15px' }}>
        <span style={style}><b>Oopsies...</b> : {this.state.error}</span>
      </div>);
    }
  }

  // text from fileName input box
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ name: evt.target.value, error: "" });
  };

  // text from content input box
  doContentChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ content: evt.target.value, error: "" });
  }


  doSaveClick = (): void => {
    // verify that the name isn't empty
    if (this.state.name === "") {
      this.setState({ error: "Name should not be empty" });
      return;
    }
    // verify that the content isn't empty
    if (this.state.content === "") {
      this.setState({ error: "No Cards" });
      return;
    }

    // verify that the filename doesn't have trailing empty spaces,
    // could be problematic if two decks with same name, one with an extra space is saved.
    // disallow this.
    if (this.state.name !== this.state.name.trim()) {
      this.setState({ error: "No trailing spaces in Name please" });
      return;
    }

    // returns undefined if flashcards are malformatted
    const flashcards: Flashcard[] | undefined = parseFlashcards(this.state.content);

    // if malformatted, let usre know
    if (flashcards === undefined) {
      this.setState({ error: "flashcards are malformatted" });
      return;
    }

    const args = { name: this.state.name, value: flashcards };

    fetch("/api/save", {
      method: "POST", body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" }
    })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect to server"));
  }


  doAddResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doAddJson)
        .catch(() => this.doAddError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doAddError)
        .catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code from /api/add: ${resp.status}`);
    }
  }


  doAddJson = (data: unknown): void => {
    if (!isRecord(data) || typeof data.name !== "string" || typeof data.saved !== 'boolean') {
      console.error("bad data from /api/bid: not a record", data);
      return;
    }

    if (data.saved) {
      this.props.doBackClick();
    } else {
      this.setState({ error: "Filename already exists" });
    }
  }


  doAddError = (msg: string): void => {
    console.error(`Error fetching /api/add: ${msg}`);
  }
}

