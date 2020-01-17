'use babel'

import {Emitter} from 'atom'

const InProgressListRegex = /✏️ In Progress/
const TestingListRegex    = /🐛 Testing/
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

  get testingListId () {
    if (this._testingListId) {
      return this._testingListId
    }

    return this._loadTestingListId()
  }

  load () {
    this._loadCards()
    this._loadTestingListId()
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
    this._inProgressListId = this._loadListId(InProgressListRegex)

    return this._inProgressListId
  }

  _loadTestingListId() {
    this._testingListId = this._loadListId(TestingListRegex)

    return this._testingListId
  }

  _loadListId (nameRegex) {
    return this.lists.then((lists) => {
      return new Promise((resolve, reject) => {
        let list = lists.find(list => list.name.match(nameRegex))

        if (list) {
          resolve(list.id)
        } else {
          let name = nameRegex.toString().slice(1, -1)
          atom.notifications.addError(`This board has not ${name} list`)

          reject()
        }
      })
    })
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
