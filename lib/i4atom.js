'use babel';

import Trello from './trello'
import ViewContainer from './i4atom/view-container';
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
    this.trello = new Trello();
    this.viewContainer = new ViewContainer(state.viewState, this.trello);
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://i4atom') {
          return this.viewContainer;
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'i4atom:toggle': () => this.toggle()
      }),
      ...this.trello.setObservers()
    );
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.viewContainer.destroy();
  },

  serialize() {
    return {
      viewState: this.viewContainer.serialize()
    };
  },

  toggle() {
    console.log('I4atom was toggled!');
    atom.workspace.toggle('atom://i4atom');
  }
};
