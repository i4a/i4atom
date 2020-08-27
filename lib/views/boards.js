'use babel';

import React from 'react';
import { CompositeDisposable } from 'atom'

import Board from './board'

export default class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.subscriptions = new CompositeDisposable()

    this.state = {
      boards: []
    }
  }

  componentDidMount() {
    i4atom.trello.emitter.on(
      'did-change-boards',
      (boards) => {
        this.setState({'boards': boards});
      },
    );

    i4atom.trello.loadBoards()

    this.subscriptions.add(
      atom.workspace.onDidChangeActivePaneItem((item) => {
        if (item === undefined || !item.i4atomView) {
          return;
        }

        this.refreshBoards()
      })
    )
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  render() {
    return (
      <div className="i4atom-Boards">
        {this.state.boards.map((board) =>
          <Board board={board} />
        )}
      </div>
    );
  }

  refreshBoards () {
    this.state.boards.forEach(board => board.refresh())
  }
}
