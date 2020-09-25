'use babel'

import PullRequest from './pull-request'

const CommentPullRequestRegexp = /PR:\s*(\S+)/g
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
  get pullRequests() { return this._pullRequests }
  get pullRequestUrls() {
    if (this._pullRequestUrls != undefined) {
      return this._pullRequestUrls
    }

    return this._loadPullRequestUrls()
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
    return this.time && this.pullRequests.length && this.pullRequests.every((pullRequest) => pullRequest.ready)
  }
  get readyClass () {
    return this.ready ? 'btn-primary' : 'btn-default'
  }

  async load () {
    return this._loadPullRequests()
  }

  setDone () {
    return this.board.setDone(this.id)
  }

  async _loadPullRequests () {
    await this.pullRequestUrls

    this._pullRequests = this.pullRequestUrls.map(url => new PullRequest(url))

    return Promise.all(this.pullRequests.map(pullRequest => pullRequest.load()))
  }

  _loadPullRequestUrls() {
    this._pullRequestUrls = this.actions.map(
      action => Array.from(action.data.text.matchAll(CommentPullRequestRegexp)).map(
        match => match[1]
      )).flat()

    return this._pullRequestUrls
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
