'use babel';

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const apiUri = 'https://api.github.com'
const apiEndpoint = `${apiUri}/graphql`

const tokenPromise = atom.packages.getLoadedPackage('github').mainModule.loginModel.getToken(apiUri)

const httpLink = createHttpLink({
  uri: apiEndpoint
})

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
}
