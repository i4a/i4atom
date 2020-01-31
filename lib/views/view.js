'use babel'

import React from 'react'

import Boards from './boards'
import List from './list'

export default class View extends React.Component {
  constructor(props) {
    super(props)
    this.boardChanged = this.boardChanged.bind(this)
    this.reloading    = this.reloading.bind(this)
    this.reloaded     = this.reloaded.bind(this)

    this.state = {
      currentBoard: this.props.board
    };
  }

  boardChanged(board) {
    this.setState({currentBoard: board})

    this.props.onBoardChange(board)
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
          <Boards selected={this.state.currentBoard}
                  onBoardChange={this.boardChanged} />
          { this.state.reloading &&
            <span className='loading loading-spinner-tiny inline-block'></span>
          }
        </div>
        <List board={this.state.currentBoard}
               onLoadingBoard={this.reloading}
               onLoadedCards={this.reloaded} />
      </div>
    )
  }
}
