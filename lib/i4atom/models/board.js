'use babel'

export default class Board {
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

  _loadLists () {
    this._lists = i4atom.trello.getListsOnBoard(this.id)

    return this._lists
  }
}
