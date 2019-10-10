'use babel';

import React from 'react';
import { CompositeDisposable } from 'atom';

import ListInProgress from './list/in-progress';
import ListUnderReview from './list/under-review';

export default class Lists extends React.Component {
  constructor(props) {
    super(props)


    this.trello = props.trello;
    this.subscriptions = new CompositeDisposable();

    this.trello.emitter.on(
      'did-change-cards',
      (cards) => {
        this.setState({'cards': cards});
      }
    );

    this.state = {cards: undefined};

    this.loadCards();
  }

  componentDidMount() {
    this.subscriptions.add(
      atom.workspace.onDidChangeActivePaneItem((item) => {
        if (item === undefined || !item.i4atomView) {
          return;
        }

        this.loadCards();
      })
    );
  }

  componentDidUpdate(previousProps) {
    if (this.props.board !== previousProps.board) {
      this.setState({cards: undefined});
      this.loadCards();
    }
  }

  componentWillUnmount() {
    this.subscriptions.dispose();
  }

  render() {
    return (
      <div className="i4atom-Lists">
        {this.renderLists()}
      </div>
    )

  }

  loadCards() {
    if (! this.props.board) {
      return;
    }

    this.trello.loadCards(this.props.board);
  }

  renderLists() {
    switch (this.state.cards) {
      case undefined:
        return (
          <div className="loading-container">
            <span className='loading loading-spinner-small inline-block'></span>
          </div>
        );
        break;
      case null:
        return (
          <div className='status-removed padded'>In progress list not found in this board</div>
        );
        break;
      default:
        return (
          <div>
            <ListInProgress cards={this.state.cards} />
            <ListUnderReview cards={this.state.cards} />
          </div>
        );
    }
  }
}
