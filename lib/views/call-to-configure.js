'use babel';

import React from 'react';

export default class CallToConfigure extends React.Component {
  openConfiguration() {
    atom.workspace.open('atom://config/packages/i4atom');
  }

  render() {
    return (
      <div className="i4atom-CallToConfigure panned">
        <button className="btn btn-lg"
                onClick={this.openConfiguration}>
          Configure i4atom
        </button>
      </div>
    );
  }
}
