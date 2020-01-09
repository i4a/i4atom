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
    let boardId = event.target.value
    let board = this.state.boards.find((board) => board.id == boardId)

    this.props.onBoardChange(board)
  }

  render() {
    let selected = this.props.selected
    let selectedId = selected ? selected.id : null

    return (
      <div className="i4atom-Boards padded">
        <select className='input-select'
                value={selectedId}
                onChange={this.change}>
          {this.state.boards.map((board) =>
            <option value={board.id} key={board.id}>{board.name}</option>
          )}
        </select>
      </div>
    );
  }
}
