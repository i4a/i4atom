'use babel'

import React from 'react'
import {shell, remote} from 'electron'
const {Menu, MenuItem} = remote

import ViewPullRequest from './pull-request'

export default class ViewCard extends React.Component {
  constructor(props) {
    super(props)

    this.setDone = this.setDone.bind(this)
  }

  render() {
    return (
      <li className="i4atom-Card list-item">
        <div className="name-container">
          <a href={this.props.card.url} className="name">
            {this.props.card.name}
          </a>
        </div>
        <div className="content">
          <div className="content-time">
            <a href={this.props.card.url} title="Time">
              <span className={'icon icon-clock ' + this.props.card.timeClass}></span>
            </a>
          </div>
          <div className="content-pull-requests">
            { this.props.card.pullRequests.length ? (
                this.props.card.pullRequests.map((pullRequest) =>
                  <ViewPullRequest key={pullRequest.id}
                                   pullRequest={pullRequest}/>
                )
              ) : (
                <div className="empty-pull-request text-subtle">No pull request</div>
              )
            }
          </div>
          <div className="content-set-done">
            <button className={`btn ${this.props.card.readyClass} i4atom-Button-setDone`}
                    onClick={this.setDone}>Done</button>
          </div>
        </div>
      </li>
    );
  }

  setDone () {
    this.props.card.setDone()
  }
}
