'use babel'

const PullRequestRegexp = /https:\/\/github\.com\/(.+)\/(.+)\/pull\/(\d+)/

export default class GithubPullRequest {
  constructor(github, url) {
    this.github = github
    this.url = url
  }

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
    this.ci = {
        status: lastCommitStatus ? lastCommitStatus.state : 'PENDING',
        url: lastCommitStatus ? lastCommitStatus.contexts[0].targetUrl : '#'
    }

    this.labels = data.labels.nodes
  }
}
