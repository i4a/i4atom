'use babel'

import { CompositeDisposable, Emitter } from 'atom'

import Dialog from '../dialog'
import Repository from './repository'
import GithubPullRequest, { ChangelogPath } from '../github/pull-request'

const Delegates = {
  properties: [
    'id',
    'title',
    'approved',
    'branch',
    'changelog',
    'changesRequested',
    'merged',
    'reviewRequired',
    'ci',
    'ciSuccess',
    'sshUrl',
    'url'
  ],
  functions: [
    'isWorkInProgress',
    'removeWip'
  ]
}

const PullRequestEmitter = new Emitter()

export default class PullRequest {
  static async open (title, body) {
    const branchName = await i4atom.git.getCurrentBranchName()

    try {
      await i4atom.git.push()
    } catch (error) {
      console.error(error)
    }

    const dialog = new Dialog({
      initialText: title,
      prompt: `Open pull request using <pre>${branchName}</pre>`
    })

    const pullRequestTitle = await dialog.attach()

    const currentRepository = await Repository.current()

    githubPullRequest = await GithubPullRequest.open({
      branch: branchName,
      title: pullRequestTitle,
      body: body,
      repositoryId: currentRepository.id,
      baseBranch: currentRepository.baseBranch
    })

    return new PullRequest(githubPullRequest).load()
  }

  static async fromUrl (url) {
    const githubPullRequest = await GithubPullRequest.fromUrl(url)

    return new PullRequest(githubPullRequest).load()
  }

  constructor(githubPullRequest) {
    this.githubPullRequest = githubPullRequest

    this.subscriptions = new CompositeDisposable()

    this.updateIsCheckedOut = this.updateIsCheckedOut.bind(this)

    PullRequestEmitter.on('did-checkout', () => this.updateIsCheckedOut())

    this.subscriptions.add(
      i4atom.git.onDidUpdate(this.updateIsCheckedOut)
    )
  }

  get emitter () {
    this._emitter = this._emitter || new Emitter

    return this._emitter
  }

  get link()   { return `<a href="${this.url}">${this.title}</a>`}
  get ready () { return this.merged && this.ciSuccess && this.changelog }
  get isCurrentRepository () { return this._isCurrentRepository }
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
    await Promise.all([
      this.updateIsCurrentRepository(),
      this.updateIsCheckedOut()
    ])

    return this
  }

  dispose () {
    this.subscriptions.dispose()
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

  async checkout() {
    await i4atom.git.checkout(this.branch)

    PullRequestEmitter.emit('did-checkout')

    atom.notifications.addSuccess(`Switched to ${this.branch}`)
  }

  updateIsCurrentRepository() {
    return i4atom.git.getCurrentGitHubRemote().then((remote) => {
      this._isCurrentRepository = remote.url === this.sshUrl
    })
  }

  updateIsCheckedOut() {
    return i4atom.git.getCurrentBranchName().then((branchName) => {
      this._isCheckedOut = branchName === this.branch

      this.emitter.emit('did-change-is-checked-out', this.isCheckedOut)
    })
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
