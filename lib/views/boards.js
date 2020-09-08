'use babel';

import React from 'react';
import { CompositeDisposable } from 'atom'

import Board from '../models/board'
import ViewBoard from './board'

export default class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.subscriptions = new CompositeDisposable()

    this.state = {
      boards: []
    }
  }

  componentDidMount() {
    Board.emitter.on(
      'did-change-boards',
      (boards) => {
        this.setState({'boards': boards})
      },
    )

    Board.load()

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
    this.subscriptions.dispose()
  }

  render() {
    return (
      <div className="i4atom-Boards">
        {this.state.boards.map((board) =>
          <ViewBoard board={board} key={board.id} />
        )}
      </div>
    );
  }

  refreshBoards () {
    this.state.boards.forEach(board => board.refresh())
  }
}
