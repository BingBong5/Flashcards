import React, { Component } from "react";
import { FlashcardList } from "./FlashcardList";
import { FlashcardCreator } from './FlashcardCreator';
import { FlashcardPractice } from './FlashcardPractice'
import './css/style.css';

const DEBUG: boolean = true;


type Page = { kind: 'list' } | { kind: 'practice', name: string } | { kind: 'create' };


type FlashcardAppState = { page: Page; }


/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);
    this.state = { page: { kind: "list" } };
  }

  render = (): JSX.Element => {
    if (DEBUG) console.log("rendering");
    if (this.state.page.kind === "list") {
      return <FlashcardList onNewClick={this.doNewClick} onPracticeClick={this.doPracticeClick} />;
    } else if (this.state.page.kind === "create") {
      return <FlashcardCreator doBackClick={this.doBackClick} />;
    } else {
      return <FlashcardPractice onBackClick={this.doBackClick} name={this.state.page.name} />;
    }
  };


  // render "list" page
  doBackClick = (): void => {
    if (DEBUG) console.debug("set state to list");
    this.setState({ page: { kind: "list" } })
  }

  // render "create" page
  doNewClick = (): void => {
    if (DEBUG) console.debug("set state to create");
    this.setState({ page: { kind: "create" } });
  }

  //render "practice" page
  doPracticeClick = (name: string): void => {
    this.setState({ page: { kind: "practice", name: name } });
  }
}