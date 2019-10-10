'use babel';

import React from 'react';

import Boards from './boards';
import ListInProgress from './list/in-progress';
import ListUnderReview from './list/under-review';

export default class View extends React.Component {
  constructor(props) {
    super(props)

    this.trello = props.trello;

    this.trello.emitter.on(
      'did-change-boards',
      () => {
        this.setState({'boards': this.trello.boards});
      },
    );

    this.trello.emitter.on(
      'did-change-cards',
      () => {
        this.setState({'cards': this.trello.cards});
      }
    );

    this.state = {
      boards: this.trello.boards,
      cards: this.trello.cards
    };
  }

  boardChanged(board) {
    console.log(`changed: ${board}`);
  }

  render() {
    return (
      <div>
        <Boards boards={this.state.boards}
                onBoardChange={this.boardChanged} />
        <ListInProgress cards={this.state.cards} />
        <ListUnderReview cards={this.state.cards} />
      </div>
    )
  }
}
