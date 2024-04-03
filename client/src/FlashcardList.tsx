import React, { Component, MouseEvent } from 'react'; //ChangeEvent, MouseEvent
import { isRecord } from './record';
import { PracticeHistory, parsePracticeHistory } from './PracticeHistory';


type FlashcardListProps = {
  onNewClick: () => void,
  onPracticeClick: (name: string) => void;
};

type FlashcardListState = {
  deckNames: string[] | undefined;
  practiceHistory: PracticeHistory[] | undefined;
};


// shows main page with list of decknames and practice history
export class FlashcardList extends Component<FlashcardListProps, FlashcardListState> {

  constructor(props: FlashcardListProps) {
    super(props);

    this.state = {
      deckNames: undefined,
      practiceHistory: undefined,
    };
  }


  render = (): JSX.Element => {
    return (
      <div>
        <h1>List</h1>
        {this.renderFlashcards()}
        <button type="button" onClick={this.doNewClick}>create new deck</button>
        <h1>Scores</h1>
        {this.renderPracticeHistory()}
      </div>
    )
  };


  renderFlashcards = (): JSX.Element => {
    if (this.state.deckNames === undefined) {
      return <div>Loading decks...</div>;
    } else {
      const list: JSX.Element[] = [];
      for (const name of this.state.deckNames) {
        list.push
          (
            // file names are unique so ok to use as key
            <li key={name}>
              <a href="#" onClick={(evt) => this.doPracticeClick(evt, name)}>{name}</a>
            </li >
          )
      }
      return <ul>{list}</ul>;
    }
  }


  renderPracticeHistory = (): JSX.Element => {
    if (this.state.practiceHistory === undefined) {
      return <div></div>
    } else {
      const table: JSX.Element[] = [];
      for (const [idx, practiceHistory] of this.state.practiceHistory.entries()) {
        table.push(
          <tr key={idx}>
            <th>
              {practiceHistory.name}
            </th>
            <th>
              {practiceHistory.deckName}:
            </th>
            <th>
              {practiceHistory.score}
            </th>
          </tr>
        )
      }
      return <table><tbody>{table}</tbody></table>;
    }
  }


  // tell parent page to render "create new flashcard" page
  doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onNewClick();
  };


  componentDidMount = (): void => {
    this.doRefreshClick();
  }


  doRefreshClick = (): void => {
    // get list of flashcard deck names, and practice history from server
    fetch("/api/list")
      .then(this.doListResp)
      .catch(() => this.doListError("failed to connect to server"));
  };


  doListResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doListJson)
        .catch(() => this.doListError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doListError)
        .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/list: ${resp.status}`);
    }
  };


  doListJson = (data: unknown): void => {
    // validate data
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    } else if (!isRecord(data.values)) {
      console.error("bad data from /api/list: not a record", data.values);
      return;
    } else if (!Array.isArray(data.values.fileNames)) {
      console.error("bad data from /api/list, passed array is not valid", data.values.filenames);
      return;
    } else if (!Array.isArray(data.values.practiceHistory)) {
      console.error("bad data from /api/list, passed array is not valid", data.values.practiceHistory);
      return;
    }

    // verify that each deckname is a string
    const newDeckNames: string[] = [];
    for (const val of data.values.fileNames) {
      if (typeof val !== 'string' || val.length === 0) {
        console.error('/api/list, returned filename array is not of type string');
        return;
      }
      newDeckNames.push(val);
    }

    // verify that each data is a valid practicehistory ({ name: string, deckName: string, score: number })
    const newPracticeHistory: PracticeHistory[] = [];
    for (const val of data.values.practiceHistory) {
      const item: PracticeHistory | undefined = parsePracticeHistory(val);
      if (item === undefined) {
        console.error('/api/list, returned practiceHistory array is not of type PracticeHistory');
      } else {
        newPracticeHistory.push(item);
      }
    }

    this.setState({ deckNames: newDeckNames, practiceHistory: newPracticeHistory });
  };


  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

  doPracticeClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onPracticeClick(name);
  };
}





