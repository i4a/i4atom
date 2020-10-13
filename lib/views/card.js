'use babel'

import React from 'react'
import {shell, remote} from 'electron'
const {Menu, MenuItem} = remote

import Dialog from '../helpers/dialog'
import ViewPullRequest from './pull-request'
import ViewOpenPullRequest from './open-pull-request'

export default class ViewCard extends React.Component {
  constructor(props) {
    super(props)

    this.onOpenPullRequest = this.onOpenPullRequest.bind(this)
    this.setTime           = this.setTime.bind(this)
    this.setDone           = this.setDone.bind(this)

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
        { !!this.state.pullRequests.length &&
          <div className="content-pull-requests">
            { this.state.pullRequests.map(pullRequest =>
                <ViewPullRequest key={pullRequest.id}
                                 pullRequest={pullRequest}/>
              )
            }
          </div>
        }
        <div className="content">
          <a title="Time" {...this.timeAttributes()}>
            <span className={'icon icon-clock ' + this.props.card.timeClass}></span>
          </a>
          <span className="space" />
          <ViewOpenPullRequest card={this.props.card} onOpen={this.onOpenPullRequest}/>
          <button className={`btn ${this.props.card.readyClass} i4atom-Button-setDone`}
                  onClick={this.setDone}>Done</button>
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

  onOpenPullRequest (pullRequest) {
    let pullRequests = this.state.pullRequests

    pullRequests.push(pullRequest)

    this.setState({pullRequests})
  }

  setTime () {
    this.props.card.setTime()
  }

  setDone () {
    this.props.card.setDone()
  }
}
