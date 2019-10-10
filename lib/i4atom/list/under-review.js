'use babel';

import React from 'react';

import CardUnderReview from '../card/under-review';

export default class ListUnderReview extends React.Component {
  render() {
    return (
      <div className="i4atom-List i4atom-UnderReviewList">
        <header>
          <span className="icon icon-bug"></span>
          <span className="title">Under review / specs</span>
        </header>
        {
          this.props.cards ? (
            <ul className="list-group">
              {this.props.cards.map((card) =>
                <CardUnderReview key={card.id} data={card} />
              )}
            </ul>
          ) : (
            <div className="loading-container">
              <span className='loading loading-spinner-small inline-block'></span>
            </div>
          )
        }
      </div>
    );
  }
}
