'use babel';

import React from 'react';

export default class Card extends React.Component {
  render() {
    return (
      <li>{this.props.data.name}</li>
    );
  }
}
