'use babel';

import React from 'react';

import Card from './card';

export default class InProgressList extends React.Component {
  render() {
    return (
      <div>
        <header>
          <span className="icon icon-list-unordered"></span>
          <span className="i4atom-InProgressList-title">In progress</span>
        </header>
        <ul>
          {this.props.cards.map((card) =>
            <Card key={card.id} data={card} />
          )}
        </ul>
      </div>
    );
  }
}
