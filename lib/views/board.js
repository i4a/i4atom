'use babel';

import React from 'react'

import ViewCards from './cards'

export default class ViewBoard extends React.Component {
  constructor(props) {
    super(props);

    this.board = props.board

    this.state = {
      loading: true
    }

    this.board.emitter.on('did-change-loading', (status) => this.setState({loading: status}))
  }

  componentDidMount() {
    this.board.load()
  }

  render () {
    return (
      <div className="i4atom-Board block">
        <header>
          <a href={this.props.board.url} className="text-smaller name">
            {this.props.board.name}
          </a>
          { this.state.loading &&
            <span className="loading loading-spinner-tiny inline-block"></span>
          }
        </header>
        <ViewCards board={this.props.board} />
      </div>
    )
  }
}
