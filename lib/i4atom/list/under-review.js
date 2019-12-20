'use babel';

import React from 'react';

import CardUnderReview from '../card/under-review';

export default class ListUnderReview extends React.Component {
  render() {
    return (
      <div className="i4atom-List i4atom-ListUnderReview">
        <header>
          <span className="icon icon-eye"></span>
          <span className="title">Under review / specs</span>
        </header>
        {
          this.props.cards.length ? (
            <ul className="list-group">
              {this.props.cards.map((card) =>
                <CardUnderReview i4atom={this.props.i4atom}
                                 key={card.id}
                                 data={card} />
              )}
            </ul>
          ) : (
            <div className="text-subtle padded">
              No cards waiting for review or specs in this board
            </div>
          )
        }
      </div>
    );
  }
}
