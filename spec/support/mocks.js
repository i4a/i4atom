'use babel'

import atomMock, { ActiveRepository, GitMock} from './mocks/atom'
import { githubQuery, githubMutate } from './mocks/github'
import trello from './mocks/trello'
import slack from './mocks/slack'

export default () => {
  atomMock()
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
