'use babel'

const fs = require('fs').promises
import path from 'path'

import { Package } from 'atom'
const TrelloClient = require('trello')
import { ApolloClient } from 'apollo-client'

function fixture(name) {
  const nameWithPath =
    path.join(path.dirname(__filename), '..', 'fixtures', `${name}.json`)

  return fs.readFile(nameWithPath).then((data) => JSON.parse(data))
}

export function atomConfiguration() {
  const keys = ['i4atom.trelloKey', 'i4atom.trelloToken']
  const originalAtomGet = atom.config.get.bind(atom.config)

  spyOn(atom.config, 'get').andCallFake(key => {
    if (keys.includes(key)) {
      return 'configurationValue'
    } else {
      return originalAtomGet(key)
    }
  })
}

export function atomPackageState() {
  const originalAtomPackageState = atom.packages.getPackageState.bind(atom.packages)

  spyOn(atom.packages, 'getPackageState').andCallFake(name => {
    if (name === 'i4atom') {
      return { view: { board: '1' }}
    } else {
      return originalAtomGet(key)
    }
  })
}
export function githubToken() {
  const originalGetLoadedPackage = atom.packages.getLoadedPackage.bind(atom.packages)

  spyOn(atom.packages, 'getLoadedPackage').andCallFake(key => {
    if (key === 'github') {
      return {
        mainModule: {
          loginModel: {
            getToken: (uri) => 'githubToken'
          }
        }
      }
    } else {
      return originalGetLoadedPackage(key)
    }
  })
}

export function apolloClient() {
  spyOn(ApolloClient.prototype, 'query').andCallFake(request => {
    body = request.query.loc.source.body

    if (body == 'query { viewer { login } }') {
      return fixture('github/viewer')
    }

    match = body.match(/pullRequest\(number: (\d+)\)/)

    if (match) {
      return fixture(`github/pull/${match[1]}`)
    }

    console.log('In apolloClient mock:')
    console.log([method, path, options])
  })
}

export function trelloClient() {
  spyOn(TrelloClient.prototype, 'getBoards').andCallFake(request => {
    return fixture('trello/boards')
  })

  spyOn(TrelloClient.prototype, 'getListsOnBoard').andCallFake(request => {
    return fixture('trello/boards/1/lists')
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
          console.log('In trelloClient mock:')
          console.log([method, path, options])
      }
    } else {
      console.log('In trelloClient mock:')
      console.log([method, path, options])
    }
  })
}

export default () => {
  atomConfiguration()
  atomPackageState()
  githubToken()
  apolloClient()
  trelloClient()
}
