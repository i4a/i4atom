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
        <ul className="list-group">
          {this.props.cards.map((card) =>
            <CardInProgress key={card.id} data={card} />
          )}
        </ul>
      </div>
    );
  }
}
