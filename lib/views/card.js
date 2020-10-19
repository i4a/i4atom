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
      pullRequests: this.props.card.pullRequests,
      time: this.props.card.time
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
          <ul className="list-group content-pull-requests">
            { this.state.pullRequests.map(pullRequest =>
                <ViewPullRequest key={pullRequest.id + Date.now()} // FIXME: make component aware of data changes
                                 pullRequest={pullRequest}/>
              )
            }
          </ul>
        }
        <div className="content">
          { this.state.time ?
            <a href={this.props.card.url}>
              <span className='icon icon-clock text-success' />
            </a>
            :
            <button className="btn btn-link i4atom-Button-setTime"
                    onClick={this.setTime}>
              <span className='icon icon-clock text-error' />
            </button>
          }
          <span className="space" />
          <ViewOpenPullRequest card={this.props.card} onOpen={this.onOpenPullRequest}/>
          <button className={`btn ${this.props.card.readyClass} i4atom-Button-setDone`}
                  onClick={this.setDone}>Done</button>
        </div>
      </li>
    )
  }

  onOpenPullRequest (pullRequest) {
    this.setState((state) => {
      let pullRequests = state.pullRequests

      pullRequests.push(pullRequest)

      return {pullRequests}
    })
  }

  async setTime () {
    const time = await this.props.card.setTime()

    this.setState({time})
  }

  setDone () {
    this.props.card.setDone()
  }
}
