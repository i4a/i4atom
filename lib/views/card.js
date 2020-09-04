'use babel'

import React from 'react'
import {shell, remote} from 'electron'
const {Menu, MenuItem} = remote

import ViewPullRequest from './pull-request'

export default class ViewCard extends React.Component {
  constructor(props) {
    super(props)

    this.showActionsMenu = this.showActionsMenu.bind(this)
    this.setDone         = this.setDone.bind(this)
  }

  render() {
    return (
      <li className="i4atom-Card list-item">
        <div className="name-container">
          <a href={this.props.card.url} className="name">
            {this.props.card.name}
          </a>
          <span className="icon icon-ellipses" onClick={this.showActionsMenu} />
        </div>
        <div className="content">
          <a href={this.props.card.url}>
            <span className={'icon icon-clock ' + this.props.card.timeClass}></span>
          </a>
          { this.props.card.pullRequest ? (
              <ViewPullRequest pullRequest={this.props.card.pullRequest}/>
            ) : (
              <div className="empty-pull-request text-subtle">No pull request</div>
            )
          }
          <button className={`btn ${this.props.card.readyClass} i4atom-Button-setDone`}
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

  setDone () {
    this.props.card.setDone()
  }
}
