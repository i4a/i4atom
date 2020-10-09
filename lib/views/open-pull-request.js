'use babel'

import React from 'react'

export default class OpenPullRequest extends React.Component {
  constructor(props) {
    super(props)

    this.openPullRequest = this.openPullRequest.bind(this)

    this.state = {
      pushing: false,
      opening: false
    }
  }

  render() {
    return (
      <button className="btn open-pull-request"
              disabled={this.state.opening}
              onClick={this.openPullRequest}>
        { this.state.pushing &&
          <span className="icon icon-arrow-up animate-up"></span>
        }
        Open pull request
      </button>
    )
  }

  async openPullRequest () {
    this.setState({pushing: true, opening: true})

    try {
      await i4atom.git.push()

      this.setState({pushing: false})

      let pullRequest = await this.props.card.openPullRequest()

      this.props.onOpen(pullRequest)
    } catch (error) {
      atom.notifications.addError(error.message)

      throw(error)
    } finally {
      this.setState({pushing: false, opening: false})
    }
  }
}
