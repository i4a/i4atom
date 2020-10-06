'use babel'

const fs = require('fs').promises
import path from 'path'

const TrelloClient = require('trello')
const Restler = require('restler')

import { Package } from 'atom'
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
      return { view: { board: { data: { id: '1', name: 'Support' }}}}
    } else {
      return originalAtomGet(key)
    }
  })
}

let gitMock = {
  currentBranch: 'wip-branch',
  updateCallbacks: [],
  checkout (branch) {
    this.currentBranch = branch

    this.updateCallbacks.forEach((callback) => callback())
  }
}

const disposableSubscription = {
  dispose () {}
}

const GithubRemote = {
  url: 'git@github.com:i4a/pepe.git',
  getNameOr (name) { return name },
  async getOwner () { return 'i4a' },
  async getRepo () { return 'pepe' }
}

const ActiveRepository = {
  async getCurrentBranch () {
    return { name: gitMock.currentBranch }
  },
  async getRemoteForBranch (_branch) {
    return GithubRemote
  },
  async getCurrentGitHubRemote () {
    return GithubRemote
  },
  async checkout (branch) {
    gitMock.currentBranch = branch
  },
  git: {
    async push (remote, branch) { return },
  },
  onDidUpdate (callback) {
    gitMock.updateCallbacks.push(callback)

    return disposableSubscription
  }
}

export function atomGetLoadedPackage() {
  const originalGetLoadedPackage = atom.packages.getLoadedPackage.bind(atom.packages)

  spyOn(atom.packages, 'getLoadedPackage').andCallFake(key => {
    if (key === 'github') {
      return {
        mainModule: {
          loginModel: {
            getToken: (uri) => 'githubToken'
          },
          getActiveRepository: () => ActiveRepository
        }
      }
    } else {
      return originalGetLoadedPackage(key)
    }
  })
}

export function githubQuery() {
  spyOn(ApolloClient.prototype, 'query').andCallFake(request => {
    body = request.query.loc.source.body

    if (body == 'query { viewer { login } }') {
      return fixture('github/viewer')
    }

    match = body.match(/pullRequest\(number: (\d+)\)/)

    if (match) {
      return fixture(`github/pull/${match[1]}`)
    }

    if (body.match(/query {\s*repository\(owner: "i4a", name: "pepe"\)/)) {
      return fixture('github/repository')
    }

    console.log(`In githubQuery mock: ${body}`)
  })
}

export function githubMutate() {
  spyOn(ApolloClient.prototype, 'mutate').andCallFake(request => {
    body = request.mutation.loc.source.body

    if (body.match(/removeLabelsFromLabelable/)) {
      return Promise.resolve({data: {removeLabelsFromLabelable: {labelable: {labels: {nodes: [] }}}}})
    }

    if (body.match(/createPullRequest/)) {
      return Promise.resolve(fixture('github/pull/121-create'))
    }

    console.log('In githubMutate mock:')
    console.log(body)
  })

  return ApolloClient.prototype.mutate
}

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
    git: gitMock,
    gitCheckoutSpy: spyOn(ActiveRepository, 'checkout').andCallThrough(),
    gitPushSpy: spyOn(ActiveRepository.git, 'push').andCallThrough(),
    githubMutate: githubMutate(),
    slack: slack(),
    trello: trello()
  }
}
