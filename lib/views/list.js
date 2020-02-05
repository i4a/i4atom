'use babel'

import React from 'react'
import { CompositeDisposable } from 'atom'
import { gql } from 'graphql-tag'

import Board from '../models/board'

import Card from './card';

export default class List extends React.Component {
  constructor(props) {
    super(props)

    this.subscriptions = new CompositeDisposable()

    Board.emitter.on(
      'did-change-cards',
      (cards) => {
        this.setState({'cards': cards})

        this.props.onLoadedCards()
      }
    )

    this.state = {cards: undefined}

    this.loadBoard()
  }

  componentDidMount() {
    this.subscriptions.add(
      atom.workspace.onDidChangeActivePaneItem((item) => {
        if (item === undefined || !item.i4atomView) {
          return;
        }

        this.refreshBoard()
      })
    )
  }

  componentDidUpdate(previousProps) {
    if (this.props.board !== previousProps.board) {
      this.setState({cards: undefined});
      this.loadBoard()
    }
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  render() {
    return (
      <div className="i4atom-List">
        {this.renderList()}
      </div>
    )
  }

  loadBoard() {
    if (! this.props.board) {
      return
    }

    this.props.onLoadingBoard()
    this.props.board.load()
  }

  refreshBoard() {
    if (! this.props.board) {
      return
    }

    this.props.onLoadingBoard()
    this.props.board.refresh()
  }

  renderList() {
    switch (this.state.cards) {
      case undefined:
        return (
          <div className="loading-container">
            <span className='loading loading-spinner-small inline-block'></span>
          </div>
        );
      case null:
        return (
          <div className='status-removed padded'>In progress list not found in this board</div>
        );
      default:
        return (
          <div className="i4atom-List">
            <header>
              <span className="icon icon-pencil"></span>
              <span className="title">In progress</span>
            </header>
            {
              this.state.cards.length ? (
                <ul className="list-group">
                  {this.state.cards.map((card) =>
                    <Card key={card.id}
                          card={card}/>
                  )}
                </ul>
              ) : (
                <div className="text-subtle padded">
                  No cards in this board
                </div>
              )
            }
          </div>
        )
    }
  }
}
