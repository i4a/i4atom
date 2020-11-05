'use babel'

import Dialog from '../helpers/dialog'

const rest = require ('restler')

const channel = '#dev-only'
const username = 'Pepe, the frog'
const iconEmoji = ':wide_eye_pepe:'
const messagePrompt = `Message to ${channel}`

export default class Slack {
  async url () {
    const configuredUrl = atom.config.get('i4atom.slackWebhook')

    if (configuredUrl) {
      return configuredUrl
    }

    atom.notifications.addWarning('You need to configure Slack webhook first')
    atom.workspace.open('atom://config/packages/i4atom');

    throw('Slack webhook not configured')
  }

  async askReview(pullRequestUrl, login) {
    const message = await this._getReviewMessage(pullRequestUrl, login)

    return this._sendSlackMessage(message)
  }

  async _sendSlackMessage(message) {
    let configuredUrl = await this.url()

    return new Promise((resolve, reject) => {
      rest.post(configuredUrl, {
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
