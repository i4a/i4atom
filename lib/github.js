'use babel';

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

const apiUri = 'https://api.github.com'
const apiEndpoint = `${apiUri}/graphql`

const tokenPromise = atom.packages.getLoadedPackage('github').mainModule.loginModel.getToken(apiUri)

const httpLink = createHttpLink({
  uri: apiEndpoint
})

const PullRequestRegexp = /https:\/\/github\.com\/(.+)\/(.+)\/pull\/(\d+)/

export default class Github {
  constructor() {
    this.setClient()
  }

  setClient() {
    tokenPromise.then((token) => {
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
    })
  }

  query(query) {
    return this.client.query({query: gql`query { ${query} }`})
  }

  getPullRequestInformation(pullRequests) {
    if (!pullRequests.length) {
      return new Promise((resolve, reject) => resolve([]))
    }

    return this.queryPullRequestInformation(pullRequests)
               .then(data => this.preparePullRequestInformation(data))
  }

  queryPullRequestInformation(pullRequests) {
    return this.query(this.buildPullRequestInformationQuery(pullRequests))
  }

  buildPullRequestInformationQuery(pullRequests) {
    [_, owner, repository, _] = pullRequests[0].match(PullRequestRegexp)

    return `
      repository(owner: "${owner}", name: "${repository}") {
        ${pullRequests.map((pullRequest) => this.pullRequestQuery(pullRequest)).join()}
      }
    `
  }

  pullRequestQuery(pullRequest) {
    number = pullRequest.match(PullRequestRegexp)[3]

    return `
      pullRequest(number: ${number}) {
        url
        merged
        commits(last: 1) {
          nodes {
            commit {
              status {
                state
                contexts {
                  state
                  targetUrl
                  description
                  context
                }
              }
            }
          }
        }
      }
    `
  }

  preparePullRequestInformation(data) {
    globalData = data
    return data.data.repository.reduce((accumulator, pullRequest) => {
      status = pullRequest.commits.nodes[0].commit.status

      accumulator[pullRequest.url] = {
        url: pullRequest.url,
        merged: pullRequest.merged,
        status: status.state,
        ciUrl: status.contexts[0].targetUrl
      }
    }, {})
  }
}
