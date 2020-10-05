'use babel'

/*
  Repository has proxy object for git methods
  https://github.com/atom/github/blob/master/lib/models/repository.js
*/

export default class Git {
  get repository () {
    return atom.packages.getLoadedPackage('github').mainModule.getActiveRepository()
  }

  async getCurrentBranchName () {
    const branch = await this.getCurrentBranch()

    return branch.name
  }

  async getCurrentGitHubOwner () {
    const githubRemote = await this.getCurrentGitHubRemote()

    return githubRemote.getOwner()
  }

  async getCurrentGitHubRepo () {
    const githubRemote = await this.getCurrentGitHubRemote()

    return githubRemote.getRepo()
  }

  async getRemoteForCurrentBranch () {
    const branchName = await this.getCurrentBranchName()

    return this.repository.getRemoteForBranch(branchName)
  }

  async push () {
    const branchName = await this.getCurrentBranchName()
    const remote = await this.getRemoteForCurrentBranch()
    const remoteName = remote.getNameOr('origin')

    return this.repository.git.push(remoteName, branchName)
  }
}

const delegates = [
  'getCurrentBranch',
  'getCurrentGitHubRemote',
  'checkout',
  'onDidUpdate'
]

for (let i = 0; i < delegates.length; i++) {
  const delegate = delegates[i]

  Git.prototype[delegate] = function(...args) {
    return this.repository[delegate](...args)
  }
}
