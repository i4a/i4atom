'use babel';

import I4atom from '../../lib/i4atom.js';
import Mocks from '../support/mocks'

describe('I4atom', () => {
  let mocks, workspaceElement, activationPromise

  beforeEach(() => {
    mocks = Mocks()
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('i4atom')
  })

  describe('checkout button', () => {
    it('works', () => {
      let wipCardName = 'Card with Pepe with WIP PR'

      jasmine.attachToDOM(workspaceElement)

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'i4atom:open')

      waitsForPromise(() => {
        return activationPromise
      });

      waitsFor(() => {
        // Now we can test for view visibility
        this.i4atomElement = workspaceElement.querySelector('.i4atom')
        return this.i4atomElement
      })

      runs(() => {
        expect(this.i4atomElement).toBeVisible()
      })

      waitsFor(() => {
        this.listElement = workspaceElement.querySelector('.i4atom-Cards')
        return this.listElement && this.listElement.innerText.includes(wipCardName)
      })

      let wipCard

      runs(() => {
        expect(this.listElement).toExist()
        expect(this.listElement.innerText).toContain(wipCardName)

        wipCard =
          Array
          .from(this.listElement.querySelectorAll('.i4atom-Card'))
          .find((card) => card.querySelector('.name').innerText == wipCardName)

        expect(wipCard).toExist()

        let checkoutButton = wipCard.querySelector('.pull-request button.checkout')

        checkoutButton.click()

        expect(mocks.gitCheckoutSpy).toHaveBeenCalledWith('branch-for-122')
      })

      waitsFor(() => {
        return !wipCard.querySelector('.pull-request button.checkout')
      })

      runs(() => {
        checkedOutMessage = wipCard.querySelector('span.checked-out')
        expect(checkedOutMessage).toExist()
        
        mocks.git.checkout('wip-branch')
      })

      waitsFor(() => {
        return wipCard.querySelector('.pull-request button.checkout')
      })
    })
  })
})
