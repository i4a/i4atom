'use babel';

import React from 'react';

import Boards from './boards';
import Lists from './lists';

export default class View extends React.Component {
  constructor(props) {
    super(props)
    this.boardChanged = this.boardChanged.bind(this);
    this.reloading    = this.reloading.bind(this);
    this.reloaded     = this.reloaded.bind(this);

    this.trello = props.trello;
    this.github = props.github;

    this.state = {
      currentBoard: this.props.board
    };
  }

  boardChanged(board) {
    this.setState({currentBoard: board});

    this.props.onBoardChange(board);
  }

  reloading() {
    this.setState({reloading: true})
  }

  reloaded() {
    this.setState({reloading: false})
  }

  render() {
    return (
      <div>
        <div className="i4atom-view-header">
          <Boards trello={this.trello}
                  selected={this.state.currentBoard}
                  onBoardChange={this.boardChanged} />
          { this.state.reloading &&
            <span className='loading loading-spinner-tiny inline-block'></span>
          }
        </div>
        <Lists trello={this.trello}
               github={this.github}
               board={this.state.currentBoard}
               onLoadingCards={this.reloading}
               onLoadedCards={this.reloaded} />
      </div>
    )
  }
}
