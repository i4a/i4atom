'use babel';

import I4atom from '../../lib/i4atom.js';
import basicMocks from '../support/basic-mocks'

describe('I4atom', () => {
  let mocks, workspaceElement, activationPromise

  beforeEach(() => {
    mocks = basicMocks()
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('i4atom')
  })

  describe('ask review button', () => {
    it('works', () => {
      let wipCardName = 'Card with Pepe with WIP PR'
      let slack

      jasmine.attachToDOM(workspaceElement)

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'i4atom:open')

      waitsForPromise(() => {
        return activationPromise
      });

      runs(() => {
        // Now we can test for view visibility
        let i4atomElement = workspaceElement.querySelector('.i4atom')
        expect(i4atomElement).toBeVisible()
      })

      waitsFor(() => {
        this.listInProgressElement = workspaceElement.querySelector('.i4atom-ListInProgress')
        return this.listInProgressElement
      })

      runs(() => {
        expect(this.listInProgressElement).toExist()
        expect(this.listInProgressElement.innerText).toContain(wipCardName)

        let wipCard =
          Array
          .from(this.listInProgressElement.querySelectorAll('.i4atom-Card'))
          .find((card) => card.querySelector('.name').innerText == wipCardName)

        expect(wipCard).toExist()

        let wipCardButton = wipCard.querySelector('.pull-request button')

        wipCardButton.click()
      })

      runs(() => {
        expect(mocks.slack)
        .toHaveBeenCalledWith(
          'https://hooks.slack.com/services/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',
          { data: '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":"Please review <https://github.com/thefrogs/thepond/pull/122> by <@pepe-github>"}}],"channel":"#dev-only","username":"Pepe, the frog","icon_emoji":":wide_eye_pepe:","parse":"full"}' }
        )
      })

      waitsFor(() => {
        this.listInUnderReviewElement = workspaceElement.querySelector('.i4atom-ListUnderReview')
        return this.listInUnderReviewElement.innerText.includes(wipCardName)
      })

      runs(() => {
        this.listInProgressElement = workspaceElement.querySelector('.i4atom-ListInProgress')
        expect(this.listInProgressElement.innerText).not.toContain(wipCardName)

        expect(this.listInUnderReviewElement.innerText).toContain(wipCardName)

        let underReviewCard =
          Array
          .from(this.listInUnderReviewElement.querySelectorAll('.i4atom-Card'))
          .find((card) => card.querySelector('.name').innerText == wipCardName)

        let underReviewCardButton = underReviewCard.querySelector('.pull-request button')

        underReviewCardButton.click()

        // TODO: this is working because it was called before
        // We need to reset it or upgrade jasmine to check calling times
        expect(mocks.slack)
        .toHaveBeenCalledWith(
          'https://hooks.slack.com/services/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',
          { data: '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":"Please review <https://github.com/thefrogs/thepond/pull/122> by <@pepe-github>"}}],"channel":"#dev-only","username":"Pepe, the frog","icon_emoji":":wide_eye_pepe:","parse":"full"}' }
        )
      })
    })
  })
})
