'use babel';

import React from 'react';
import {shell, remote} from 'electron';
const {Menu, MenuItem} = remote;

export default class CardUnderReview extends React.Component {
  constructor(props) {
    super(props)

    this.github = props.i4atom.github
    this.slack = props.i4atom.slack

    this.showActionsMenu = this.showActionsMenu.bind(this)
    this.askReview       = this.askReview.bind(this);
  }

  render() {
    return (
      <li className="i4atom-Card name-container">
        <div className="name-container">
          <span className="name">{this.props.data.name}</span>
          <span className="icon icon-ellipses" onClick={this.showActionsMenu} />
        </div>
        <div className="pull-request">
          <a href={this.props.data.pr.url}>
            <span className={'icon icon-git-pull-request ' + this.pullRequestStatusClass()}></span>
          </a>
          <a href={this.props.data.pr.ci.url}>
            <span className={'icon icon-bug ' + this.ciStatusClass()}></span>
          </a>
          <span className="space" />
          <button className="btn btn-default" onClick={this.askReview}>Ask review</button>
        </div>
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

  ciStatusClass() {
    switch (this.props.data.pr.ci.status) {
      case 'SUCCESS':
        return 'text-success'
        break;
      case 'PENDING':
        // On [ci skip], semaphore is PENDING but no url is provided
        return this.props.data.pr.ci.url === '#' ? 'text-subtle' : 'text-warning'
        break;
      case 'FAILURE':
        return 'text-error'
        break;
      default:
        return 'text-info'
    }
  }

  pullRequestStatusClass() {
    return this.props.data.pr.merged ? 'text-success' : 'text-warning'
  }

  askReview () {
    this.slack.askReview(this.props.data.pr.url, this.github.login)
  }
}
