'use babel';

import React from 'react';
import { CompositeDisposable } from 'atom';

import Boards from './boards';
import ListInProgress from './list/in-progress';
import ListUnderReview from './list/under-review';

export default class View extends React.Component {
  constructor(props) {
    super(props)
    this.boardChanged = this.boardChanged.bind(this);

    this.trello = props.trello;
    this.subscriptions = new CompositeDisposable();

    this.trello.emitter.on(
      'did-change-cards',
      (cards) => {
        this.setState({'cards': cards});
      }
    );

    this.state = {
      currentBoard: this.props.board
    };

    this.refresh();
  }

  componentDidMount() {
    this.subscriptions.add(
      atom.workspace.onDidChangeActivePaneItem((item) => {
        if (item === undefined || !item.i4atomView) {
          return;
        }

        this.refresh();
      })
    );
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  boardChanged(board) {
    this.setState({currentBoard: board});

    this.setState({cards: undefined});

    this.trello.loadCards(board);


    this.props.onBoardChange(board);
  }

  refresh(board) {
    if (! this.state.currentBoard) {
      return;
    }

    this.trello.loadCards(this.state.currentBoard);
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
