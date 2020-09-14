'use babel'

/*
  Repository has proxy object for git methods
  https://github.com/atom/github/blob/master/lib/models/repository.js
*/

export default class Git {
  get repository () {
    return atom.packages.getLoadedPackage('github').mainModule.getActiveRepository()
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
