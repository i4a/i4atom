'use babel'

import GithubRepository from '../apis/github/repository'

export default class Repository {
  static async current () {
    const githubRepository = await GithubRepository.current()

    return new Repository(githubRepository.data.repository)
  }

  constructor(data) {
    this._data = data
  }

  get id () { return this._data.id }
  get baseBranch () { return this._data.defaultBranchRef.name }
  get sshUrl () { return this._data.sshUrl }
}
