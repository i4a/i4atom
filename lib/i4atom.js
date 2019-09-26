'use babel';

import Trello from './trello'
import I4atomView from './i4atom-view';
import { CompositeDisposable } from 'atom';

export default {

  i4atomView: null,
  modalPanel: null,
  subscriptions: null,

  config: {
    trelloKey: {
      title: 'Trello Developer Key',
      description: 'Get your key at https://trello.com/1/appKey/generate',
      type: 'string',
      default: ''
    },
    trelloToken: {
      title: 'Token',
      description: 'First only add your developer key above. You will be redirected to get your token. Then, paste below it.',
      type: 'string',
      default: ''
    }
  },

  activate(state) {
    this.i4atomView = new I4atomView(state.i4atomViewState);

    this.trello = new Trello();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://i4atom') {
          return new I4atomView(state.i4atomViewState);
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'i4atom:toggle': () => this.toggle()
      }),
      ...this.trello.setConfigObserver()
    );
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.i4atomView.destroy();
  },

  serialize() {
    return {
      i4atomViewState: this.i4atomView.serialize()
    };
  },

  toggle() {
    console.log('I4atom was toggled!');
    atom.workspace.toggle('atom://i4atom');
  }
};
