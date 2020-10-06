'use babel'

import { ApolloClient } from 'apollo-client'

import fixture from '../fixture'

export function githubQuery() {
  spyOn(ApolloClient.prototype, 'query').andCallFake(request => {
    body = request.query.loc.source.body

    if (body == 'query { viewer { login } }') {
      return fixture('github/viewer')
    }

    match = body.match(/pullRequest\(number: (\d+)\)/)

    if (match) {
      return fixture(`github/pull/${match[1]}`)
    }

    if (body.match(/query {\s*repository\(owner: "i4a", name: "pepe"\)/)) {
      return fixture('github/repository')
    }

    console.log(`In githubQuery mock: ${body}`)
  })
}

export function githubMutate() {
  spyOn(ApolloClient.prototype, 'mutate').andCallFake(request => {
    body = request.mutation.loc.source.body

    if (body.match(/removeLabelsFromLabelable/)) {
      return Promise.resolve({data: {removeLabelsFromLabelable: {labelable: {labels: {nodes: [] }}}}})
    }

    if (body.match(/createPullRequest/)) {
      return Promise.resolve(fixture('github/pull/121-create'))
    }

    console.log('In githubMutate mock:')
    console.log(body)
  })

  return ApolloClient.prototype.mutate
}
