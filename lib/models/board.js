'use babel'

import {Emitter} from 'atom'

const InProgressListRegex = /✏️ In Progress/
const TestingListRegex    = /🐛 Testing/
const BoardEmitter = new Emitter()

export default class Board {
  static get emitter () { return BoardEmitter }

  static load () {
    i4atom.trello.loadBoards().then((info) => {
      let boards = info.map((data) => new Board(data))

      Promise.all(
        boards.map(board => board.inProgressListId.catch(e => false))
      ).then(_inProgressListIds => {
        let boardsWithInProgressList = boards.filter(board => board.withProgressList)

        BoardEmitter.emit('did-change-boards', boardsWithInProgressList)
      })
    })
  }

  constructor(data) {
    this.data = data
  }

  get id   () { return this.data.id }
  get name () { return this.data.name }
  get url  () { return this.data.url }
  get emitter () {
    this._emitter = this._emitter || new Emitter

    return this._emitter
  }

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

  get withProgressList () {
    return this._withProgressList
  }

  get testingListId () {
    if (this._testingListId) {
      return this._testingListId
    }

    return this._loadTestingListId()
  }

  load () {
    this.emitter.emit('did-change-loading', true)

    Promise.all([
      this._loadCards(),
      this._loadTestingListId()
    ]).then(() => {
      this.emitter.emit('did-change-loading', false)
    }).catch(error => console.log(error))
  }

  refresh () {
    this.emitter.emit('did-change-loading', true)

    this._loadCards().then(() =>
      this.emitter.emit('did-change-loading', false)
    )
  }

  async setDone (cardId) {
    let testingListId = await this.testingListId

    await i4atom.trello.moveCardToList(cardId, testingListId)

    this._removeCard(cardId)

    this.emitter.emit('did-change-cards', this.cards)
  }

  _loadCards () {
    return this.inProgressListId
               .then((inProgressListId) => i4atom.trello.getCardsOnList(inProgressListId))
               .then(cards => this._filterUserCards(cards))
               .then(cards => this._setBoard(cards))
               .then(cards => this._loadEachCard(cards))
               .then(cards =>  {
                 this.cards = cards
                 this.emitter.emit('did-change-cards', cards)
               },
               error => {
                 console.error(error)
                 this.emitter.emit('did-change-cards', null)
               })
  }

  _loadLists () {
    this._lists = i4atom.trello.getListsOnBoard(this.id)

    return this._lists
  }

  _loadInProgressListId() {
    this._withProgressList = false

    this._inProgressListId = this._loadListId(InProgressListRegex)
                                 .then(id => {
                                   this._withProgressList = true

                                   return id
                                 })

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

  _loadEachCard(cards) {
    return Promise.all(
      cards.map(card => card.load())
    ).then(() => cards)
  }

  _removeCard(cardId) {
    let card = this.cards.find((card) => card.id === cardId)

    this.cards = this.cards.filter((card) => card.id != cardId)
  }
}
