'use babel';

import React from 'react';

import Boards from './boards';
import Lists from './lists';

export default class View extends React.Component {
  constructor(props) {
    super(props)
    this.boardChanged = this.boardChanged.bind(this);

    this.trello = props.trello;

    this.state = {
      currentBoard: this.props.board
    };
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
        <Lists trello={this.trello}
               board={this.state.currentBoard} />
      </div>
    )
  }
}
