'use babel';

import React from 'react';

export default class Boards extends React.Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);

    this.trello = props.i4atom.trello
    this.state = {
      boards: []
    }
  }

  componentDidMount() {
    this.trello.emitter.on(
      'did-change-boards',
      (boards) => {
        this.setState({'boards': boards});
      },
    );

    this.trello.loadBoards()
  }

  change(event) {
    this.props.onBoardChange(event.target.value)
  }

  render() {
    return (
      <div className="i4atom-Boards padded">
        <select className='input-select'
                value={this.props.selected}
                onChange={this.change}>
          {this.state.boards.map((board) =>
            <option value={board.id} key={board.id}>{board.name}</option>
          )}
        </select>
      </div>
    );
  }
}
