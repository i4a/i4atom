'use babel';

import React from 'react';

import CardInProgress from '../card/in-progress';

export default class ListInProgress extends React.Component {
  render() {
    return (
      <div className="i4atom-List i4atom-ListInProgress">
        <header>
          <span className="icon icon-pencil"></span>
          <span className="title">In progress</span>
        </header>
        {
          this.props.cards.length ? (
            <ul className="list-group">
              {this.props.cards.map((card) =>
                <CardInProgress i4atom={this.props.i4atom}
                                key={card.id}
                                data={card}
                                onAskedReview={this.props.onAskedReview}/>
              )}
            </ul>
          ) : (
            <div className="text-subtle padded">
              No work-in-progress cards in this board
            </div>
          )
        }
      </div>
    );
  }
}
