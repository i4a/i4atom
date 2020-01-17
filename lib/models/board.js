'use babel'

import {Emitter} from 'atom'

const InProgressListTitle = '✏️ In Progress';
const BoardEmitter = new Emitter()

export default class Board {
  static get emitter() { return BoardEmitter }

  constructor(data) {
    this.data = data
  }

  get id   () { return this.data.id }
  get name () { return this.data.name }
  get lists () {
    if (this._lists) {
      return this._lists
    }

    return this._loadLists()
  }

  get inProgressListId () {
    if (this._inProgressListId) {
      return this._inProgressListId
    }

    return this._loadInProgressListId()
  }

  load () {
    this._loadCards()
  }

  refresh () {
    this._loadCards()
  }

  _loadCards () {
    this.inProgressListId
        .then((inProgressListId) => i4atom.trello.getCardsOnList(inProgressListId))
        .then(cards => this._filterUserCards(cards))
        .then(cards => this._setBoard(cards))
        .then(cards => this._addPullRequestInformation(cards))
        .then(cards => BoardEmitter.emit('did-change-cards', cards),
              error => BoardEmitter.emit('did-change-cards', null))
  }

  _loadLists () {
    this._lists = i4atom.trello.getListsOnBoard(this.id)

    return this._lists
  }

  _loadInProgressListId() {
    this._inProgressListId = this.lists.then((lists) => {
      return new Promise((resolve, reject) => {
        let inProgressList = lists.find(list => list.name == InProgressListTitle)

        if (inProgressList) {
          resolve(inProgressList.id)
        } else {
          atom.notifications.addError(`This board has not ${InProgressListTitle} list`)

          reject()
        }
      })
    })
    globalInProgress = this._inProgressListId

    return this._inProgressListId
  }

  _filterUserCards(cards) {
    return i4atom.trello.user.then((user) => cards.filter(card => card.idMembers.includes(user.id)));
  }

  _setBoard(cards) {
    cards.forEach(card => card.board = this)

    return cards
  }

  _addPullRequestInformation(cards) {
    return Promise.all(
      cards.map((card) => {
        if (!card.pullRequestUrl) {
          return
        }

        return i4atom.github.getPullRequest(card.pullRequestUrl)
          .then((pullRequest) => {
            card.pullRequest = pullRequest
          })
      })
    ).then(() => cards)
  }
}
