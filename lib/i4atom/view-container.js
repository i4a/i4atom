'use babel';

import React from 'react';
import ReactDOM from 'react-dom';

import View from './view';

export default class ViewContainer {
  constructor(serializedState = {}, trello) {
    this.state = serializedState;
    this.trello = trello;
    this.i4atomView = true;

    this.boardChanged = this.boardChanged.bind(this);

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('i4atom');

    ReactDOM.render(
      this.getView(),
      this.element
    )
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return this.state;
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'i4a';
  }

  getIconName() {
    return 'squirrel';
  }

  getDefaultLocation() {
    return 'right';
  }

  getView() {
    if (!this.trello.isConfigured) {
      return <CallToConfigure />
    }

    return <View trello={this.trello}
                 board={this.state.board}
                 onBoardChange={this.boardChanged} />
  }

  boardChanged(board) {
    this.state.board = board;
  }
}
