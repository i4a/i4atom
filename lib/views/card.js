'use babel';

import React from 'react'
import {shell, remote} from 'electron'
const {Menu, MenuItem} = remote

export default class Card extends React.Component {
  constructor(props) {
    super(props)

    this.showActionsMenu = this.showActionsMenu.bind(this);
    this.askReview       = this.askReview.bind(this);
    this.setDone         = this.setDone.bind(this);
  }

  render() {
    return (
      <li className="i4atom-Card list-item">
        <div className="name-container">
          <span className="name">{this.props.card.name}</span>
          <span className="icon icon-ellipses" onClick={this.showActionsMenu} />
        </div>
        <div className="content">
          { this.props.card.pullRequest ? (
              <div className="pull-request">
                <a href={this.props.card.pullRequest.url}>
                  <span className={'icon icon-git-pull-request ' + this.props.card.pullRequestStatusClass}></span>
                </a>
                <a href={this.props.card.pullRequest.ci.url}>
                  <span className={'icon icon-bug ' + this.props.card.ciStatusClass}></span>
                </a>
                <span className="space" />
                <button className="btn btn-default" onClick={this.askReview}>Ask review</button>
              </div>
            ) : (
              <div className="text-subtle">There is no pull request</div>
            )
          }
          <button className="btn btn-default i4atom-Button-setDone"
                  onClick={this.setDone}>Done</button>
        </div>
      </li>
    );
  }

  showActionsMenu() {
    const menu = new Menu();

    menu.append(new MenuItem({
      label: 'View on Trello',
      click: () => shell.openExternal(this.props.card.url)
    }));

    menu.popup(remote.getCurrentWindow());
  }

  askReview () {
    this.props.card.askReview()
  }

  setDone () {
    this.props.card.setDone()
  }
}
