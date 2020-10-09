'use babel'

import React from 'react'

export default class OpenPullRequest extends React.Component {
  constructor(props) {
    super(props)

    this.openPullRequest = this.openPullRequest.bind(this)
  }

  render() {
    return (
      <button className="btn open-pull-request"
              onClick={this.openPullRequest}>
        Open pull request
      </button>
    )
  }

  openPullRequest () {
    this.props.card.openPullRequest().then(pullRequest => {
      this.props.onOpen(pullRequest)
    })
  }
}
