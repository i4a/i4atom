'use babel';

const Api = require('trello')
const Shell = require('shell')

// Based on https://github.com/sgengler/atom-trello
export default class Trello {
  constructor() {
    this.setApi()
  }

  setApi() {
    this.key = atom.config.get('i4atom.trelloKey');
    this.token = atom.config.get('i4atom.trelloToken');

    if (!this.key || !this.token) {
      return false;
    }

    this.api = new Api(this.key, this.token);

    return true;
  }

  setConfigObserver() {
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
}
