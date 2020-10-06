'use babel'

import { atomConfiguration, atomPackageState, atomGetLoadedPackage, ActiveRepository, GitMock} from './mocks/atom'
import { githubQuery, githubMutate } from './mocks/github'
import trello from './mocks/trello'

import { Package } from 'atom'

const Restler = require('restler')
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
