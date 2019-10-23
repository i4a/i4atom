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

  getPullRequestInformation(pullRequest) {
    return this.queryPullRequestInformation(pullRequest)
               .then(response => this.extractPullRequestInformation(response))
  }

  queryPullRequestInformation(pullRequest) {
    return this.query(this.buildPullRequestInformationQuery(pullRequest))
  }

  buildPullRequestInformationQuery(pullRequest) {
    [_, owner, repository, number] = pullRequest.match(PullRequestRegexp)

    return `
      repository(owner: "${owner}", name: "${repository}") {
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
      }
    `
  }

  extractPullRequestInformation(response) {
    pullRequest = response.data.repository.pullRequest
    globalPR = pullRequest

    return {
      url: pullRequest.url,
      merged: pullRequest.merged,
      ci: {
        status: pullRequest.commits.nodes[0].commit.status.state,
        url: pullRequest.commits.nodes[0].commit.status.contexts[0].targetUrl
      }
    }
  }
}
