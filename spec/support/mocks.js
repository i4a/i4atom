'use babel'

import { atomConfiguration, atomPackageState, atomGetLoadedPackage, ActiveRepository, GitMock} from './mocks/atom'
import { githubQuery, githubMutate } from './mocks/github'

import fixture from './fixture'

const TrelloClient = require('trello')
const Restler = require('restler')

import { Package } from 'atom'

export function trello() {
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

export function slack() {
  spyOn(Restler, 'post').andCallFake((url, params) => {
    return {
      on: (result, callback) => {
        if (result == 'complete') {
          callback('', { statusCode: 200 })
        }
      }
    }
  })

  return Restler.post
}

export default () => {
  atomConfiguration()
  atomPackageState()
  atomGetLoadedPackage()
  githubQuery()

  return {
    git: GitMock,
    gitCheckoutSpy: spyOn(ActiveRepository, 'checkout').andCallThrough(),
    gitPushSpy: spyOn(ActiveRepository.git, 'push').andCallThrough(),
    githubMutate: githubMutate(),
    slack: slack(),
    trello: trello()
  }
}
