'use babel';

import {Emitter} from 'atom';

// https://github.com/norberteder/trello
const Api = require('trello');
const Shell = require('shell');

const InProgressListTitle = '✏️ In Progress';

// Based on https://github.com/sgengler/atom-trello
export default class Trello {
  isConfigured: false


  constructor() {
    this.setApi();
    this.emitter = new Emitter();
  }

  setApi() {
    this.key = atom.config.get('i4atom.trelloKey');
    this.token = atom.config.get('i4atom.trelloToken');

    if (!this.key || !this.token) {
      return false;
    }

    this.api = new Api(this.key, this.token);
    // TODO: remove this global constant
    api = this.api;
    this.isConfigured = true;

    return true;
  }

  setObservers() {
    return [
      atom.config.onDidChange('i4atom.trelloKey', ({newValue, oldValue}) => {
        if (newValue && !atom.config.get('i4atom.trelloToken')) {
          Shell.openExternal(`https://trello.com/1/connect?key=${newValue}&name=i4atom&response_type=token&scope=read,write&expiration=never`);
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
    if (!this.setApi()) {
      return;
    }

    this.welcome();
  }

  welcome() {
    if (this.setApi()) {
      this.getUser().then((data) => {
        if (typeof data === 'object') {
          atom.notifications.addSuccess(`Hi ${data.fullName}! Welcome to i4atom.`);
        } else {
          atom.notifications.addError('Failed to set Trello API, please check your credentials');
        }
      })
    }
  }

  getUser() {
    return this.api.makeRequest('get', '/1/members/me');
  }

  loadBoards() {
    this.api.getBoards('/me').then((info) => {
      this.emitter.emit('did-change-boards', info);
    });
  }

  loadCards(board) {
    // let in_progress = '583c26c667f6b542b7ec9f2d';
    this.api.getListsOnBoard(board)
        .then(lists => this.getInProgressListId(lists))
        .then(inProgressId => this.api.getCardsOnList(inProgressId))
        .then(cards => this.emitter.emit('did-change-cards', cards),
              error => this.emitter.emit('did-change-cards', null));
  }

  getInProgressListId(lists) {
    return new Promise((resolve, reject) => {
      let inProgressList = lists.find(list => list.name == InProgressListTitle);

      if (inProgressList) {
        resolve(inProgressList.id);
      } else {
        atom.notifications.addError(`This board has not ${InProgressListTitle} list`);

        reject();
      }
    });
  }
}
