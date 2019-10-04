'use babel';

import React from 'react';
import ReactDOM from 'react-dom';

import View from './view';

export default class ViewContainer {
  constructor(serializedState, trello) {
    this.trello = trello;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('i4atom');

    ReactDOM.render(
      this.getView(),
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

  getView() {
    if (!this.trello.isConfigured) {
      return <CallToConfigure />
    }
    return <View trello={this.trello}/>
  }
}
