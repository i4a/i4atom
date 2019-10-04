'use babel';

import React from 'react';

import InProgressList from './in-progress-list';

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
        <InProgressList cards={this.state.cards} />
      </div>
    )
  }
}
