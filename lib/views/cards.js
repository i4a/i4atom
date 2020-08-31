'use babel'

import React from 'react'
import { CompositeDisposable } from 'atom'
import { gql } from 'graphql-tag'

import Card from './card';

export default class ViewCards extends React.Component {
  constructor(props) {
    super(props)

    this.props.board.emitter.on(
      'did-change-cards',
      (cards) => {
        this.setState({'cards': cards})

        // this.props.onLoadedCards()
      }
    )

    this.state = {cards: undefined}

    // this.loadBoardCards()
  }

  render() {
    return (
      <div className="i4atom-List">
        {this.renderList()}
      </div>
    )
  }

  // loadBoardCards() {
  //   this.props.onLoadingBoard()
  //   this.props.board.load()
  // }
  //
  // refreshBoard() {
  //   if (! this.props.board) {
  //     return
  //   }
  //
  //   this.props.onLoadingBoard()
  //   this.props.board.refresh()
  // }

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
          <div className="i4atom-Cards">
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
