'use babel';

import React from 'react';

import Card from './card';

export default class WorkingList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.cards.map((card) =>
          <Card key={card.id} data={card} />
        )}
      </ul>
    );
  }
}
