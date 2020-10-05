'use babel'

import GithubRepository from '../github/repository'

export default class Repository {
  static async current () {
    const githubRepository = await GithubRepository.current()

    return new Repository(githubRepository.data)
  }

  constructor(data) {
    this._data = data.repository
  }

  get id () { return this._data.id }
  get baseBranch () { return this._data.defaultBranchRef.name }
  get sshUrl () { return this._data.sshUrl }
}
