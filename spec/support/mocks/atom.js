'use babel'

export function atomConfiguration() {
  const keys = ['i4atom.trelloKey', 'i4atom.trelloToken']
  const originalAtomGet = atom.config.get.bind(atom.config)

  spyOn(atom.config, 'get').andCallFake(key => {
    if (keys.includes(key)) {
      return 'configurationValue'
    } else {
      return originalAtomGet(key)
    }
  })
}

export function atomPackageState() {
  const originalAtomPackageState = atom.packages.getPackageState.bind(atom.packages)

  spyOn(atom.packages, 'getPackageState').andCallFake(name => {
    if (name === 'i4atom') {
      return { view: { board: { data: { id: '1', name: 'Support' }}}}
    } else {
      return originalAtomGet(key)
    }
  })
}

export const GitMock = {
  currentBranch: 'wip-branch',
  updateCallbacks: [],
  checkout (branch) {
    this.currentBranch = branch

    this.updateCallbacks.forEach((callback) => callback())
  }
}

const disposableSubscription = {
  dispose () {}
}

const GithubRemote = {
  url: 'git@github.com:i4a/pepe.git',
  getNameOr (name) { return name },
  async getOwner () { return 'i4a' },
  async getRepo () { return 'pepe' }
}

export const ActiveRepository = {
  async getCurrentBranch () {
    return { name: GitMock.currentBranch }
  },
  async getRemoteForBranch (_branch) {
    return GithubRemote
  },
  async getCurrentGitHubRemote () {
    return GithubRemote
  },
  async checkout (branch) {
    GitMock.currentBranch = branch
  },
  git: {
    async push (remote, branch) { return },
  },
  onDidUpdate (callback) {
    GitMock.updateCallbacks.push(callback)

    return disposableSubscription
  }
}

export function atomGetLoadedPackage() {
  const originalGetLoadedPackage = atom.packages.getLoadedPackage.bind(atom.packages)

  spyOn(atom.packages, 'getLoadedPackage').andCallFake(key => {
    if (key === 'github') {
      return {
        mainModule: {
          loginModel: {
            getToken: (uri) => 'githubToken'
          },
          getActiveRepository: () => ActiveRepository
        }
      }
    } else {
      return originalGetLoadedPackage(key)
    }
  })
}
