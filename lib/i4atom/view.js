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
      'did-change-boards',
      (boards) => {
        this.setState({'boards': boards});
      },
    );

    this.trello.emitter.on(
      'did-change-cards',
      (cards) => {
        this.setState({'cards': cards});
      }
    );

    this.state = {
      boards: [],
      cards: [],
      currentBoard: this.props.board
    };

    this.trello.loadBoards();
    this.trello.loadCards();
  }

  boardChanged(board) {
    this.setState({currentBoard: board});

    this.props.onBoardChange(board);
  }

  render() {
    return (
      <div>
        <Boards boards={this.state.boards}
                onBoardChange={this.boardChanged}
                selected={this.state.currentBoard} />
        <ListInProgress cards={this.state.cards} />
        <ListUnderReview cards={this.state.cards} />
      </div>
    )
  }
}
