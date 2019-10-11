'use babel';

import Trello from './trello'
import ViewContainer from './i4atom/view-container';
import { CompositeDisposable } from 'atom';

export default {
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
    this.trello = new Trello();
    this.viewContainer = new ViewContainer(state.view, this.trello);
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://i4atom') {
          return this.viewContainer;
        }
      }),

      // Register command that opens this view
      atom.commands.add('atom-workspace', {
        'i4atom:open': () => this.open()
      }),
      ...this.trello.setObservers()
    );
  },

  deactivate() {
    this.subscriptions.dispose();
    this.viewContainer.destroy();
  },

  serialize() {
    return {
      view: this.viewContainer.serialize()
    };
  },

  open() {
    atom.workspace.open('atom://i4atom');
  }
};
