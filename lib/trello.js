'use babel';

const Api = require('trello')
const Shell = require('shell')

// Based on https://github.com/sgengler/atom-trello
export default class Trello {
  static setConfigObserver() {
    return [
      atom.config.onDidChange('i4atom.trello_key', ({newValue, oldValue}) => {
        if (newValue && !atom.config.get('i4atom.trello_token')) {
          return Shell.openExternal(`https://trello.com/1/connect?key=${newValue}&name=i4atom&response_type=token&scope=read,write&expiration=never`);
        } else {
          return this.sendWelcome();
        }
      }),
      atom.config.onDidChange('i4atom.trello_token', ({newValue, oldValue}) => {
        if (newValue) {
          return this.sendWelcome();
        }
      })
    ]
  }

  static sendWelcome() {
    console.log('success');
  }

  constructor() {
  }
}
