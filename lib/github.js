'use babel';

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import GithubViewer            from './github/viewer'
import GithubPullRequest from './github/pull-request'

const apiUri = 'https://api.github.com'
const apiEndpoint = `${apiUri}/graphql`

const tokenPromise = atom.packages.getLoadedPackage('github').mainModule.loginModel.getToken(apiUri)

const httpLink = createHttpLink({
  uri: apiEndpoint
})

export default class Github {
  constructor() {
    this.initalize()
  }

  async initalize() {
    let token = await tokenPromise
    await this.setClient(token)
    this.setViewer()
  }

  async setClient(token) {
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`
        }
      }
    })

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    })

    this.client = client
  }

  query(query) {
    return this.client.query({query: gql`query { ${query} }`, fetchPolicy: 'network-only'})
  }

  async setViewer() {
    let data = await new GithubViewer(this).data()

    this.login = data.login
  }

  getPullRequestInformation(pullRequest) {
    return new GithubPullRequest(this, pullRequest).data()
  }
}
