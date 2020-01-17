'use babel'

import I4atom from '../../lib/i4atom.js'
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
      let cardName = 'Card with Pepe finished PR'

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
        this.listUnderReviewElement = workspaceElement.querySelector('.i4atom-ListUnderReview')
        return this.listUnderReviewElement
      })

      runs(() => {
        expect(this.listUnderReviewElement).toExist()
        expect(this.listUnderReviewElement.innerText).toContain(cardName)

        let card =
          Array
          .from(this.listUnderReviewElement.querySelectorAll('.i4atom-Card'))
          .find((card) => card.querySelector('.name').innerText == cardName)

        expect(card).toExist()

        let cardButton = card.querySelector('.pull-request button.i4atom-Button-setDone')

        cardButton.click()
      })

      waitsFor(() => {
        return !this.listUnderReviewElement.innerText.includes(cardName)
      })

      runs(() => {
        expect(mocks.trello.updateCardList)
        .toHaveBeenCalledWith('124', '13')
      })
    })
  })
})
