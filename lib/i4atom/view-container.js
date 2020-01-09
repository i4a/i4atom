'use babel';

import React from 'react';
import ReactDOM from 'react-dom';

import Board from './models/board'
import CallToConfigure from './call-to-configure';
import View from './view';

export default class ViewContainer {
  constructor(i4atom, serializedState = {}) {
    this._setState(serializedState)

    this.i4atom = i4atom
    this.trello = i4atom.trello
    this.i4atomView = true

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
    return { board: { data: this.state.board.data } }
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
    return 'light-bulb';
  }

  getDefaultLocation() {
    return 'right';
  }

  getView() {
    if (!this.trello.isConfigured) {
      return <CallToConfigure />
    }

    return <View i4atom={this.i4atom}
                 board={this.state.board}
                 onBoardChange={this.boardChanged} />
  }

  boardChanged(board) {
    this.state.board = board;
  }

  _setState(serializedState) {
    this.state = {}

    if (!serializedState.board) {
      return
    }

    this.state.board = new Board(serializedState.board.data)
  }
}
