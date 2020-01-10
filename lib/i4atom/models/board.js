'use babel'

const InProgressListTitle = '✏️ In Progress';

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

  get inProgressListId () {
    if (this._inProgressListId) {
      return this._inProgressListId
    }

    return this._loadInProgressListId()
  }

  get cards () {
    return this.inProgressListId
               .then((inProgressListId) => i4atom.trello.getCardsOnList(inProgressListId))
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

    return this._inProgressListId
  }
}
