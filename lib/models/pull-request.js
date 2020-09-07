'use babel'

import { ChangelogPath } from '../github/pull-request'

const Delegates = {
  properties: [
    'approved',
    'branch',
    'changelog',
    'changesRequested',
    'merged',
    'reviewRequired',
    'ci',
    'ciSuccess',
    'url'
  ],
  functions: [
    'isWorkInProgress',
    'removeWip'
  ]
}

export default class PullRequest {
  constructor(pullRequestUrl) {
    this.pullRequestUrl = pullRequestUrl
  }

  get ready () { return this.merged && this.ciSuccess && this.changelog }
  get isCheckedOut () { return this._isCheckedOut }

  get underReview() {
    return !this.isWorkInProgress()
  }

  get ciStatusClass() {
    switch (this.ci.status) {
      case 'SUCCESS':
        return 'text-success'
        break;
      case 'PENDING':
        // On [ci skip], semaphore is PENDING but no url is provided
        return this.ci.url === '#' ? 'text-subtle' : 'text-warning'
        break;
      case 'FAILURE':
        return 'text-error'
        break;
      default:
        return 'text-info'
    }
  }

  get statusClass() {
    if (this.merged) {
      return 'text-merged'
    } else if (this.approved) {
      return 'text-success'
    } else if (this.changesRequested || this.reviewRequired) {
      return 'text-error'
    }

    return ''
  }

  get changelogUrl () {
    return `atom://core/open/file?filename=${ChangelogPath}`
  }
  get changelogClass () {
    return this.changelog ? 'text-success' : 'text-error'
  }

  async load () {
    this.githubPullRequest = await i4atom.github.getPullRequest(this.pullRequestUrl)

    await this.updateIsCheckedOut()

    return this
  }

  askReview() {
    if (this.underReview) {
      return this._askReviewOnSlack()
    } else {
      return Promise.all([
        this.removeWip(),
        this._askReviewOnSlack()
      ])
    }
  }

  checkout() {
    return i4atom.git.checkout(this.branch).then(() => {
      this._isCheckedOut = true

      atom.notifications.addSuccess(`Switched to ${this.branch}`)
    })
  }

  updateIsCheckedOut() {
    return i4atom.git.getCurrentBranch().then((branch) => this._isCheckedOut = branch.name === this.branch)
  }

  _askReviewOnSlack() {
    return i4atom.slack.askReview(this.url, i4atom.github.login)
  }
}

for (let i in Delegates.properties) {
  const delegate = Delegates.properties[i]

  Object.defineProperty(PullRequest.prototype, delegate, {
    get: function() { return this.githubPullRequest[delegate] }
  })
}

for (let i in Delegates.functions) {
  const func = Delegates.functions[i]

  PullRequest.prototype[func] = function(...args) {
    return this.githubPullRequest[func](...args)
  }
}
