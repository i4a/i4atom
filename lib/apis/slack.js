'use babel'

import Dialog from '../helpers/dialog'

const rest = require ('restler')

// Test post without flooding slack channel
// const url = 'http://httpbin.org/post'
const url = 'https://hooks.slack.com/services/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'
const channel = '#dev-only'
const username = 'Pepe, the frog'
const iconEmoji = ':wide_eye_pepe:'
const messagePrompt = `Message to ${channel}`

export default class Slack {
  askReview(pullRequestUrl, login) {
    return this._getReviewMessage(pullRequestUrl, login).then((message) => this._sendSlackMessage(message))
  }

  _sendSlackMessage(message) {
    return new Promise((resolve, reject) => {
      rest.post(url, {
        data: this._askReviewJson(message)
      }).on('complete', (data, response) => {
        if (response.statusCode == 200) {
          atom.notifications.addSuccess('Review request sent')
          resolve()
        } else {
          atom.notifications.addError(response)
          reject()
        }
      })
    })
  }

  _askReviewJson(text) {
    return JSON.stringify({
      blocks: [
        {
           type: 'section',
           text: {
             type: 'mrkdwn',
             text: text
           }
        }
      ],
      channel: channel,
      username: username,
      icon_emoji: iconEmoji,
      parse: 'full'
    })
  }

 _getReviewMessage(pullRequest, login) {
    const initialText = `Please review <${pullRequest}> by <@${login}>`

    const dialog = new Dialog({
      initialText: initialText,
      prompt: messagePrompt
    })

    return dialog.attach()
  }
}
