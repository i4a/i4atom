'use babel';

import React from 'react';
import ReactDOM from 'react-dom';

import View from './view';

export default class ViewContainer {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('i4atom');

    ReactDOM.render(
      <View />,
      this.element
    )
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

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
}
