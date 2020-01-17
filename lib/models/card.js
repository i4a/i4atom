'use babel'

const CommentPrRegexp = /PR:\s*(\S+)/

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
    return this.pullRequest.merged ? 'text-success' : 'text-warning'
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

  _loadPullRequestUrl() {
    if (this.actions.some(comment => match = comment.data.text.match(CommentPrRegexp))) {
      this._pullRequestUrl = match[1]
    } else {
      this._pullRequestUrl = null
    }

    return this._pullRequestUrl
  }

  _askReviewOnTrello() {
    return i4atom.slack.askReview(this.pullRequest.url, i4atom.github.login)
  }
}
