'use babel';

import React from 'react';

import Boards from './boards';
import ListInProgress from './list/in-progress';
import ListUnderReview from './list/under-review';

export default class View extends React.Component {
  constructor(props) {
    super(props)
    this.boardChanged = this.boardChanged.bind(this);

    this.trello = props.trello;

    this.trello.emitter.on(
      'did-change-cards',
      (cards) => {
        this.setState({'cards': cards});
      }
    );

    this.state = {
      cards: [],
      currentBoard: this.props.board
    };

    this.trello.loadCards();
  }

  boardChanged(board) {
    this.setState({currentBoard: board});

    this.props.onBoardChange(board);
  }

  render() {
    return (
      <div>
        <Boards trello={this.trello}
                selected={this.state.currentBoard}
                onBoardChange={this.boardChanged} />
        <ListInProgress cards={this.state.cards} />
        <ListUnderReview cards={this.state.cards} />
      </div>
    )
  }
}
