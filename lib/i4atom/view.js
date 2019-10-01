'use babel';

import React from 'react';

export default class View extends React.Component {
  openConfiguration() {
    atom.workspace.open('atom://config/packages/i4atom');
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this.openConfiguration}>
        Configure i4atom
      </button>
    )
  }
}
