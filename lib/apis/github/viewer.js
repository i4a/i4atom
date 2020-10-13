'use babel'

export default class GithubViewer {
  constructor(github) {
    this.github = github
  }

  async data() {
    let response = await this.github.query('viewer { login }')

    return response.data.viewer
  }
}
