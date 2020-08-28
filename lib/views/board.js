'use babel';

import React from 'react'

import Cards from './cards'

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.board = props.board

    this.state = {
      loading: true
    }

    this.board.emitter.on('did-change-loading', (status) => this.setState({loading: status}))
  }

  render () {
    return (
      <div className="i4atom-Board block">
        <header>
          <span className="text-smaller text-subtle name">{this.props.board.name}</span>
          { this.state.loading &&
            <span className="loading loading-spinner-tiny inline-block"></span>
          }
        </header>
        <Cards board={this.props.board} />
      </div>
    )
  }
}
