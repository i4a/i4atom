'use babel';

import React from 'react';
import {shell, remote} from 'electron';
const {Menu, MenuItem} = remote;

export default class CardUnderReview extends React.Component {
  constructor(props) {
    super(props);
    this.showActionsMenu = this.showActionsMenu.bind(this);
  }

  render() {
    return (
      <li className="i4atom-Card list-item">
        <span className="name">{this.props.data.name}</span>
        <a href={this.props.data.pr}><span className="icon icon-git-pull-request"></span></a>
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
