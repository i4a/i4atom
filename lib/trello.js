'use babel'

import {Emitter} from 'atom'

import Board from './models/board'
import Card  from './models/card'

// https://github.com/norberteder/trello
const Client = require('trello')
const Shell = require('shell')


// Based on https://github.com/sgengler/atom-trello
export default class Trello {
  isConfigured: false

  constructor() {
    this.setClient();
    this.emitter = new Emitter()
  }

  get user () { return this._user }

  setClient() {
    this.key = atom.config.get('i4atom.trelloKey');
    this.token = atom.config.get('i4atom.trelloToken');

    if (!this.key || !this.token) {
      return false;
    }

    this.client   = new Client(this.key, this.token);

    this._user = this.client.makeRequest('get', '/1/members/me');

    this.isConfigured = true;

    return true;
  }

  setObservers() {
    return [
      atom.config.onDidChange('i4atom.trelloKey', ({newValue, oldValue}) => {
        if (newValue && !atom.config.get('i4atom.trelloToken')) {
          Shell.openExternal(`https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=i4atom&key=${newValue}`)
        } else {
          this.onConfigured();
        }
      }),
      atom.config.onDidChange('i4atom.trelloToken', ({newValue, oldValue}) => {
        if (newValue) {
          this.onConfigured();
        }
      })
    ]
  }

  onConfigured() {
    if (!this.setClient()) {
      return;
    }

    this.welcome();
  }

  welcome() {
    if (this.setClient()) {
      this.user.then((data) => {
        if (typeof data === 'object') {
          atom.notifications.addSuccess(`Hi ${data.fullName}! Welcome to i4atom.`);
        } else {
          atom.notifications.addError('Failed to set Trello API, please check your credentials');
        }
      })
    }
  }

  loadBoards() {
    this.client.getBoards('me').then((info) => {
      let boards = info.map((data) => new Board(data))

      this.emitter.emit('did-change-boards', boards)
    });
  }

  getListsOnBoard(boardId) {
    return this.client.getListsOnBoard(boardId)
  }

  getCardsOnList(listId) {
    return this.client.makeRequest(
      'get',
      `/1/lists/${listId}/cards`,
      {
        fields: ['name', 'idMembers', 'url'],
        actions: 'commentCard'
      }
    ).then((info) => info.map((data) => new Card(data)))
  }

  moveCardToList(cardId, listId) {
    return this.client.updateCardList(cardId, listId)
  }
}
