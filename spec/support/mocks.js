'use babel'

import atomMock, {ActiveRepository, GitMock, SlackWebhookUri} from './mocks/atom'
import { githubQuery, githubMutate } from './mocks/github'
import trello from './mocks/trello'
import slack from './mocks/slack'

export default () => {
  atomMock()
  githubQuery()

  return {
    SlackWebhookUri,
    git: GitMock,
    gitCheckoutSpy: spyOn(ActiveRepository, 'checkout').andCallThrough(),
    gitPushSpy: spyOn(ActiveRepository.git, 'push').andCallThrough(),
    githubMutate: githubMutate(),
    slack: slack(),
    trello: trello()
  }
}
