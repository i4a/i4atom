'use babel'

const rest = require ('restler')

const url = 'https://hooks.slack.com/services/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'
const channel = '#dev-only'
const username = 'Pepe, the frog'
const icon_emoji = ':wide_eye_pepe:'

export default class Slack {
  askReview(pullRequest, login) {
    rest.post(url, {
      data: this.askReviewJson(pullRequest, login)
    }).on('complete', (data, response) => {
      console.log(data)
      console.log(response)

      if (response.statusCode == 200) {
        atom.notifications.addSuccess('Review request sent')
      } else {
        atom.notifications.addError(response)
      }
    })
  }

  askReviewJson(pullRequest, login) {
    text = `Please review <${pullRequest}> by <@${login}>`

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
      icon_emoji: icon_emoji,
      parse: 'full'
    })
  }
}
