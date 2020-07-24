'use babel'

import { ChangelogPath } from '../github/pull-request'

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
  get underReview() {
    return this.pullRequest && !this.pullRequest.isWorkInProgress()
  }

  get ciStatusClass() {
    switch (this.pullRequest.ci.status) {
      case 'SUCCESS':
        return 'text-success'
        break;
      case 'PENDING':
        // On [ci skip], semaphore is PENDING but no url is provided
        return this.pullRequest.ci.url === '#' ? 'text-subtle' : 'text-warning'
        break;
      case 'FAILURE':
        return 'text-error'
        break;
      default:
        return 'text-info'
    }
  }

  get pullRequestStatusClass() {
    if (this.pullRequest.merged) {
      return 'text-merged'
    } else if (this.pullRequest.approved) {
      return 'text-success'
    } else if (this.pullRequest.changesRequested || this.pullRequest.reviewRequired) {
      return 'text-error'
    }

    return ''
  }
  get changelog () {
    return this.pullRequest.changelog
  }
  get changelogUrl () {
    return `atom://core/open/file?filename=${ChangelogPath}`
  }
  get changelogClass () {
    return this.changelog ? 'text-success' : 'text-error'
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

  askReview() {
    if (this.underReview) {
      return this._askReviewOnTrello()
    } else {
      return Promise.all([
        this.pullRequest.removeWip(),
        this._askReviewOnTrello()
      ])
    }
  }

  setDone () {
    return this.board.setDone(this.id)
  }

  checkout () {
    return this.pullRequest.checkout()
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

  _askReviewOnTrello() {
    return i4atom.slack.askReview(this.pullRequest.url, i4atom.github.login)
  }
}
