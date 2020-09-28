'use babel'

export default class Repository {
  static async current () {
    const [owner, repo] = await Promise.all([
      i4atom.git.getCurrentGitHubOwner(),
      i4atom.git.getCurrentGitHubRepo()
    ])

    return i4atom.github.query(this.repositoryQuery(owner, repo))
  }

  static repositoryQuery (owner, name) {
    return `
      repository(owner: "${owner}", name: "${name}") {
        id
        defaultBranchRef {
          prefix
          name
        }
      }
    `
  }
}
