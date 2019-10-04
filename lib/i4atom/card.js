'use babel';

import React from 'react';

export default class Card extends React.Component {
  render() {
    return (
      <li className="list-item">{this.props.data.name}</li>
    );
  }
}
