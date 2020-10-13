'use babel'

import Dialog from '../helpers/dialog'
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
  get link()       { return `<a href="${this.url}">${this.name}</a>`}
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

  async openPullRequest () {
    let pullRequest

    try {
      pullRequest = await PullRequest.open(this.url)

      await i4atom.trello.addComment(this.id, `PR: ${pullRequest.url}`)
    } catch (error) {
      atom.notifications.addError(error.message)

      throw(error)
    }

    atom.notifications.addSuccess(`${pullRequest.link} opened and added to ${this.link}`)

    return pullRequest
  }

  setDone () {
    return this.board.setDone(this.id)
  }

  async setTime () {
    const dialog = new Dialog({
      initialText: '',
      prompt: `Time expended in ${this.name}`
    })

    const time = await dialog.attach()

    try {
      await i4atom.trello.addComment(this.id, `Time: ${time}`)
    } catch (error) {
      atom.notifications.addError(error.message)

      throw(error)
    }

    atom.notifications.addSuccess(`${time} added to ${this.link}`)

  }

  async _loadPullRequests () {
    await this.pullRequestUrls

    this._pullRequests = await Promise.all(this.pullRequestUrls.map(url => PullRequest.fromUrl(url)))

    return this._pullRequests
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
