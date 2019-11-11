'use babel'

import React from 'react'
import { CompositeDisposable } from 'atom'
import { gql } from 'graphql-tag'

import ListInProgress from './list/in-progress'
import ListUnderReview from './list/under-review'

const workInProgressLabel = 'wip'

export default class Lists extends React.Component {
  constructor(props) {
    super(props)

    this.trello = props.i4atom.trello
    this.github = props.i4atom.github

    this.subscriptions = new CompositeDisposable()

    this.trello.emitter.on(
      'did-change-cards',
      (cards) => {
        if (!cards) {
          this.props.onLoadedCards()

          return
        }

        this.addPullRequestInformation(cards)
            .then(cards => this.classifyCards(cards))
            .then(cards => this.setState({'cards': cards}))
            .then(() => this.props.onLoadedCards())
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
      return
    }

    this.props.onLoadingCards()
    this.trello.loadCards(this.props.board)
  }

  addPullRequestInformation(cards) {
    return Promise.all(
      cards.map((card) => {
        if (!card.pr) {
          return
        }

        return this.github.getPullRequestInformation(card.pr)
          .then((pullRequestInformation) => {
            card.pr = pullRequestInformation
          })
      })
    ).then(() => cards)
  }

  classifyCards(cards) {
    let classification = { inProgress: [], underReview: [] };

    cards.forEach(card => {
      let match;

      if (card.pr && !card.pr.labels.map(label => label.name).includes(workInProgressLabel)) {
        list = 'underReview';
      } else {
        list = 'inProgress';
      }

      classification[list].push(card);
    });

    return classification
  }

  renderLists() {
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
          <div>
            <ListInProgress i4atom={this.props.i4atom}
                            cards={this.state.cards.inProgress} />
            <ListUnderReview cards={this.state.cards.underReview} />
          </div>
        );
    }
  }
}
