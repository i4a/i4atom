'use babel'

import React from 'react'

export default class ViewPullRequest extends React.Component {
  constructor(props) {
    super(props)

    this.checkout  = this.checkout.bind(this)
    this.askReview = this.askReview.bind(this)
  }

  render () {
    return (
      <div className="pull-request">
        <a href={this.props.pullRequest.url}>
          <span className={'icon icon-git-pull-request ' + this.props.pullRequest.statusClass}></span>
        </a>
        <a href={this.props.pullRequest.ci.url}>
          <span className={'icon icon-bug ' + this.props.pullRequest.ciStatusClass}></span>
        </a>
        <a href={this.props.pullRequest.changelogUrl}>
          <span className={'icon icon-list-unordered ' + this.props.pullRequest.changelogClass}></span>
        </a>
        <span className="space" />
        { !this.props.pullRequest.isCheckedOut &&
          <button className="btn btn-default checkout" onClick={this.checkout}>Checkout</button>
        }
        <button className="btn btn-default ask-review" onClick={this.askReview}>Ask review</button>
      </div>
    )
  }

  askReview () {
    this.props.pullRequest.askReview()
  }

  checkout () {
    this.props.pullRequest.checkout()
  }
}
