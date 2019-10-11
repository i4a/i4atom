'use babel';

import React from 'react';
import {shell, remote} from 'electron';
const {Menu, MenuItem} = remote;

export default class CardInProgress extends React.Component {
  constructor(props) {
    super(props);
    this.showActionsMenu = this.showActionsMenu.bind(this);
  }

  render() {
    return (
      <li className="i4atom-Card list-item">
        <span className="name">{this.props.data.name}</span>
        <span className="icon icon-ellipses" onClick={this.showActionsMenu} />
      </li>
    );
  }

  showActionsMenu() {
    const menu = new Menu();

    menu.append(new MenuItem({
      label: 'View on Trello',
      click: () => shell.openExternal(this.props.data.url)
    }));

    menu.popup(remote.getCurrentWindow());
  }
}
