'use babel';

import React from 'react';

export default class CardInProgress extends React.Component {
  render() {
    return (
      <li className="i4atom-Card list-item">
        <span className="name">{this.props.data.name}</span>
        <a href={this.props.data.url}><span className="icon icon-link"></span></a>
      </li>
    );
  }
}
