'use babel'

import PullRequest from './pull-request'

const CommentPullRequestRegexp = /PR:\s*(\S+)/
const CommentTimeRegexp = /Time:\s*(\S+)/

export default class Card {
  constructor(data) {
    this.data = data
  }

  get id()         { return this.data.id }
  get name()       { return this.data.name }
  get url()        { return this.data.url }
  get idMembers()  { return this.data.idMembers }
  get actions()    { return this.data.actions }
  get board()      { return this._board }
  set board(board) { this._board = board }
  get pullRequest()            { return this._pullRequest }
  set pullRequest(pullRequest) { this._pullRequest = pullRequest }
  get pullRequestUrl() {
    if (this._pullRequestUrl != undefined) {
      return this._pullRequestUrl
    }

    return this._loadPullRequestUrl()
  }
  get time() {
    if (this._time != undefined) {
      return this._time
    }

    return this._loadTime()
  }
  get timeClass () {
    return this.time ? 'text-success' : 'text-error'
  }
  get ready () {
    return this.time && this.pullRequest && this.pullRequest.ready
  }
  get readyClass () {
    return this.ready ? 'btn-primary' : 'btn-default'
  }

  async load () {
    return this._loadPullRequest()
  }

  dispose () {
    if (this.pullRequest) {
      this.pullRequest.dispose()
    }
  }

  setDone () {
    return this.board.setDone(this.id)
  }

  async _loadPullRequest () {
    if (!this.pullRequestUrl) {
      return
    }

    this.pullRequest = new PullRequest(this.pullRequestUrl)

    return this.pullRequest.load()
  }

  _loadPullRequestUrl() {
    this._pullRequestUrl = this._actionsMatch(CommentPullRequestRegexp)

    return this._pullRequestUrl
  }

  _loadTime () {
    this._time = this._actionsMatch(CommentTimeRegexp)

    return this._time
  }

  _actionsMatch (regexp) {
    if (this.actions.some(comment => match = comment.data.text.match(regexp))) {
      return match[1]
    }

    return null
  }
}
