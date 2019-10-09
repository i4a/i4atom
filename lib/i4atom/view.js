'use babel';

import React from 'react';

import ListInProgress from './list/in-progress';
import ListUnderReview from './list/under-review';

export default class View extends React.Component {
  constructor(props) {
    super(props)

    this.trello = props.trello;

    this.trello.emitter.on(
      'did-change-cards',
      () => {
        this.setState({'cards': this.trello.cards});
      }
    );

    this.state = {
      cards: this.trello.cards
    };
  }

  render() {
    return (
      <div>
        <ListInProgress cards={this.state.cards} />
        <ListUnderReview cards={this.state.cards} />
      </div>
    )
  }
}
