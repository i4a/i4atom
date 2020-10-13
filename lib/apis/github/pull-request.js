'use babel'

import Repository from '../../models/repository'

const PullRequestRegexp = /https:\/\/github\.com\/(.+)\/(.+)\/pull\/(\d+)/
const workInProgressLabel = 'wip'
export const ChangelogPath = 'CHANGELOG.md'
const PullRequestQuery = `
  id
  title
  url
  merged
  number
  reviewDecision
  headRefName
  commits(last: 1) {
    nodes {
      commit {
        status {
          state
          contexts {
            state
            targetUrl
            description
            context
          }
        }
      }
    }
  }
  files(first: 10) {
    nodes {
      path
    }
  }
  labels(first: 10){
    nodes {
      id
      name
    }
  }
`

class GithubPullRequestOpener {
  constructor (data) {
    this._data = data
  }

  mutation () {
    return `createPullRequest(input: {baseRefName: "${this._data.baseBranch}", headRefName: "${this._data.branch}", body: "${this._data.body}", title: "${this._data.title}", repositoryId: "${this._data.repositoryId}"}) {
      pullRequest {
        ${PullRequestQuery}
      }
    }`
  }

  async data () {
    const response = await i4atom.github.mutate(this.mutation())

    return {
      repository: {
        sshUrl: Repository.current().sshUrl
      },
      pullRequest: response.data.createPullRequest.pullRequest
    }
  }
}


class GithubPullRequestFromUrl {
  constructor (url) {
    this.url = url
  }

  query() {
    let [_, owner, repository, number] = this.url.match(PullRequestRegexp)

    return `
      repository(owner: "${owner}", name: "${repository}") {
        sshUrl
        pullRequest(number: ${number}) {
          ${PullRequestQuery}
        }
      }
    `
  }

  async data() {
    const response = await i4atom.github.query(this.query())

    return {
      repository: response.data.repository,
      pullRequest: response.data.repository.pullRequest
    }
  }
}

export default class GithubPullRequest {
  static async open (data) {
    const githubPullRequestData = await new GithubPullRequestOpener(data).data()

    return new GithubPullRequest(githubPullRequestData)
  }

  static async fromUrl(url) {
    const githubPullRequestData = await new GithubPullRequestFromUrl(url).data()

    return new GithubPullRequest(githubPullRequestData)
  }

  constructor(data) {
    this._data = data
  }

  get pullRequestData () { return this._data.pullRequest }
  get id () { return this.pullRequestData.id }
  get title () { return this.pullRequestData.title }
  get url () { return this.pullRequestData.url }
  get merged () { return this.pullRequestData.merged }
  get reviewDecision () { return this.pullRequestData.reviewDecision }
  get sshUrl () { return this._data.repository.sshUrl }
  get lastCommitStatus () { return this.pullRequestData.commits.nodes[0].commit.status }
  get ci () { return {
      status: this.lastCommitStatus ? this.lastCommitStatus.state : 'PENDING',
      url: this.lastCommitStatus ? this.lastCommitStatus.contexts[0].targetUrl : '#'
    }
  }
  get changelog () { return this.pullRequestData.files.nodes.some((file) => file.path == ChangelogPath) }
  get branch () { return this.pullRequestData.headRefName }
  get labels () { return this.pullRequestData.labels.nodes }
  set labels (nodes) { this.pullRequestData.labels.nodes = nodes }

  get approved () { return this.reviewDecision === 'APPROVED' }
  get changesRequested () { return this.reviewDecision === 'CHANGES_REQUESTED' }
  get reviewRequired () { return this.reviewDecision === 'REVIEW_REQUIRED' }
  get ciSuccess () { return this.ci.status === 'SUCCESS' }

  removeWip() {
    return i4atom.github.mutate(this.removeWipMutation())
               .then((response) => this.labels = response.data.removeLabelsFromLabelable.labelable.labels.nodes)
  }

  removeWipMutation() {
    return `removeLabelsFromLabelable(input: {labelableId: "${this.id}", labelIds: ["${this.workInProgressLabelId()}"]}) {
       labelable {
         labels(first: 10) {
           nodes {
             id
             name
           }
         }
       }
     }`
  }

  isWorkInProgress() {
    return this.labels.map(label => label.name).includes(workInProgressLabel)
  }

  workInProgressLabelId() {
    return this.labels.find(label => label.name === workInProgressLabel).id
  }
}
