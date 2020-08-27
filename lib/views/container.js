'use babel';

import React from 'react';
import ReactDOM from 'react-dom';

import Boards from './boards'
import CallToConfigure from './call-to-configure';

export default class ViewContainer {
  constructor(serializedState = {}) {
    this._setState(serializedState)

    this.i4atomView = true

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
    return {}
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
    if (!i4atom.trello.isConfigured) {
      return <CallToConfigure />
    }

    return <Boards />
  }

  _setState(_serializedState) {
  }
}
