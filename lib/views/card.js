'use babel'

import React from 'react'
import {shell, remote} from 'electron'
const {Menu, MenuItem} = remote

import Dialog from '../dialog'
import ViewPullRequest from './pull-request'

export default class ViewCard extends React.Component {
  constructor(props) {
    super(props)

    this.openPullRequest = this.openPullRequest.bind(this)
    this.setTime         = this.setTime.bind(this)
    this.setDone         = this.setDone.bind(this)

    this.state = {
      pullRequests: this.props.card.pullRequests
    }
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
            <a title="Time" {...this.timeAttributes()}>
              <span className={'icon icon-clock ' + this.props.card.timeClass}></span>
            </a>
          </div>
          <div className="content-pull-requests">
            { !!this.state.pullRequests.length &&
                this.state.pullRequests.map(pullRequest =>
                  <ViewPullRequest key={pullRequest.id}
                                   pullRequest={pullRequest}/>
                )
            }
            <div className="empty-pull-request">
              <button className="btn open-pull-request"
                      onClick={this.openPullRequest}>Open pull request</button>
            </div>
          </div>
          <div className="content-set-done">
            <button className={`btn ${this.props.card.readyClass} i4atom-Button-setDone`}
                    onClick={this.setDone}>Done</button>
          </div>
        </div>
      </li>
    );
  }

  timeAttributes () {
    let attributes = {}

    if (this.props.card.time) {
      attributes.href = this.props.card.url
    } else {
      attributes.onClick = this.setTime
    }

    return attributes
  }

  openPullRequest () {
    this.props.card.openPullRequest().then(pullRequest => {
      let pullRequests = this.state.pullRequests

      pullRequests.push(pullRequest)

      this.setState({pullRequests})
    })
  }

  setTime () {
    this.props.card.setTime()
  }

  setDone () {
    this.props.card.setDone()
  }
}
