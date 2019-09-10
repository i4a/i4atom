'use babel';

import I4atomView from './i4atom-view';
import { CompositeDisposable } from 'atom';

export default {

  i4atomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.i4atomView = new I4atomView(state.i4atomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.i4atomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'i4atom:toggle': () => this.toggle()
    }));
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
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
