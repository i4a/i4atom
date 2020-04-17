'use babel'

const PullRequestRegexp = /https:\/\/github\.com\/(.+)\/(.+)\/pull\/(\d+)/
const workInProgressLabel = 'wip'
export const ChangelogPath = 'CHANGELOG.md'

export default class GithubPullRequest {
  constructor(github, url) {
    this.github = github
    this.url = url
  }

  get approved () { return this.reviewDecision === 'APPROVED' }
  get changesRequested () { return this.reviewDecision === 'CHANGES_REQUESTED' }
  get reviewRequired () { return this.reviewDecision === 'REVIEW_REQUIRED' }
  get ciSuccess () { return this.ci.status === 'SUCCESS' }
  get ready () { return this.merged && this.ciSuccess && this.changelog }

  async data() {
    let response = await this.query()

    this.extractInformation(response)

    return this
  }

  query() {
    return this.github.query(this.buildQuery())
  }

  buildQuery() {
    let [_, owner, repository, number] = this.url.match(PullRequestRegexp)

    return `
      repository(owner: "${owner}", name: "${repository}") {
        pullRequest(number: ${number}) {
          id
          url
          merged
          reviewDecision
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
        }
      }
    `
  }

  extractInformation(response) {
    let data = response.data.repository.pullRequest
    let lastCommitStatus  = data.commits.nodes[0].commit.status

    this.id = data.id
    this.merged = data.merged,
    this.reviewDecision = data.reviewDecision
    this.ci = {
        status: lastCommitStatus ? lastCommitStatus.state : 'PENDING',
        url: lastCommitStatus ? lastCommitStatus.contexts[0].targetUrl : '#'
    }
    this.changelog = data.files.nodes.some((file) => file.path == ChangelogPath)

    this.labels = data.labels.nodes
  }

  removeWip() {
    return this.github.mutate(this.removeWipMutation())
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
