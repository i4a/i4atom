'use babel'

const TrelloClient = require('trello')

import fixture from '../fixture'

export default function trello() {
  spyOn(TrelloClient.prototype, 'getBoards').andCallFake(request => {
    return fixture('trello/boards')
  })

  spyOn(TrelloClient.prototype, 'getListsOnBoard').andCallFake(request => {
    return fixture('trello/boards/1/lists')
  })

  spyOn(TrelloClient.prototype, 'updateCardList').andCallFake(request => {
    return Promise.resolve()
  })

  spyOn(TrelloClient.prototype, 'addCommentToCard').andCallFake(request => {
    return Promise.resolve(fixture('trello/comments/create-pr'))
  })

  spyOn(TrelloClient.prototype, 'makeRequest').andCallFake((method, path, options) => {
    if (method == 'get') {
      switch (path) {
        case '/1/members/me':
          return fixture('trello/me')
          break
        case '/1/lists/12/cards':
          return fixture('trello/lists/12/cards')
          break
        default:
          console.log('In trello mock:')
          console.log([method, path, options])
      }
    } else {
      console.log('In trello mock:')
      console.log([method, path, options])
    }
  })

  return TrelloClient.prototype
}
