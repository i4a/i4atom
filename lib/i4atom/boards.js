'use babel';

import React from 'react';

export default class Boards extends React.Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
  }

  change(event) {
    this.props.onBoardChange(event.target.value)
  }

  render() {
    return (
      <div className="i4atom-Boards padded">
        <select class='input-select'
                onChange={this.change}>
          {this.props.boards.map((board) =>
            <option value={board.id}>{board.name}</option>
          )}
        </select>
      </div>
    );
  }
}
