'use babel'

const Restler = require('restler')

export default function slack() {
  spyOn(Restler, 'post').andCallFake((url, params) => {
    return {
      on: (result, callback) => {
        if (result == 'complete') {
          callback('', { statusCode: 200 })
        }
      }
    }
  })

  return Restler.post
}
