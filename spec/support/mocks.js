'use babel'

import { atomConfiguration, atomPackageState, atomGetLoadedPackage, ActiveRepository, GitMock} from './mocks/atom'
import { githubQuery, githubMutate } from './mocks/github'
import trello from './mocks/trello'
import slack from './mocks/slack'

import { Package } from 'atom'

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
