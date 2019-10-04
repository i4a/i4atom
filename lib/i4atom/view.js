'use babel';

import React from 'react';

import WorkingList from './working-list';

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
        <h1>Working list</h1>
        <WorkingList cards={this.state.cards} />
      </div>
    )
  }
}
