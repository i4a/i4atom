'use babel'

import React from 'react'

import { CompositeDisposable } from 'atom'

export default class ViewPullRequest extends React.Component {
  constructor(props) {
    super(props)

    this.checkout  = this.checkout.bind(this)
    this.askReview = this.askReview.bind(this)

    this.subscriptions = new CompositeDisposable()

    this.state = {
      isCheckedOut: this.props.pullRequest.isCheckedOut
    }
  }

  componentDidMount() {
    this.subscriptions.add(
      this.props.pullRequest.emitter.on(
        'did-change-is-checked-out',
        (value) => this.setState({'isCheckedOut': value})
      )
    )
  }

  componentWillUnmount () {
    this.props.pullRequest.dispose()
    this.subscriptions.dispose()
  }

  render () {
    return (
      <li className={'list-item i4atom-PullRequest pull-request-' + (this.props.pullRequest.closed ? 'closed' : 'open') }>
        <a href={this.props.pullRequest.url} title="Pull request">
          <span className={'icon icon-git-pull-request ' + this.props.pullRequest.statusClass}></span>
        </a>
        <a href={this.props.pullRequest.ci.url} title="Continous integration">
          <span className={'icon icon-bug ' + this.props.pullRequest.ciStatusClass}></span>
        </a>
        <a href={this.props.pullRequest.changelogUrl} title="Changelog">
          <span className={'icon icon-list-unordered ' + this.props.pullRequest.changelogClass}></span>
        </a>
        <span className="title">{this.props.pullRequest.title}</span>
        { this._showCheckoutButton() ?
            <button className="btn btn-sm checkout"
                    disabled={!this.props.pullRequest.isCurrentRepository}
                    title="git checkout the branch of this pull request"
                    onClick={this.checkout}>Checkout</button>
            :
            <span className="checked-out text-success">Checked out</span>
        }
        <button className="btn btn-sm ask-review"
                title="Send message to Slack with a link to this pull request"
                onClick={this.askReview}>Ask review</button>
      </li>
    )
  }

  askReview () {
    this.props.pullRequest.askReview()
  }

  checkout () {
    this.props.pullRequest.checkout()
  }

  _showCheckoutButton () {
    return !this.props.pullRequest.isCurrentRepository || !this.state.isCheckedOut
  }
}
