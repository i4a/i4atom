'use babel'

import I4atom from '../../lib/i4atom.js'
import Mocks from '../support/mocks'

describe('I4atom', () => {
  let mocks, workspaceElement, activationPromise

  beforeEach(() => {
    mocks = Mocks()
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('i4atom')
  })

  describe('set time button', () => {
    it('works', () => {
      let cardName = 'Card with Pepe without PR'

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
        this.listElement = workspaceElement.querySelector('.i4atom-Cards')
        return this.listElement && this.listElement.innerText.includes(cardName)
      })

      let card

      runs(() => {
        expect(this.listElement).toExist()
        expect(this.listElement.innerText).toContain(cardName)

        card =
          Array
          .from(this.listElement.querySelectorAll('.i4atom-Card'))
          .find((card) => card.querySelector('.name').innerText == cardName)

        expect(card).toExist()

        let cardButton = card.querySelector('button.i4atom-Button-setTime')

        cardButton.click()
      })

      waitsFor(() => {
        this.editorElement = workspaceElement.querySelector('atom-text-editor.editor.mini')
        return this.editorElement
      })

      runs(() => {
        atom.notifications.clear()

        let addPanel
        [addPanel] = atom.workspace.getModalPanels()
        const addDialog = addPanel.getItem()
        const miniEditor = addDialog.miniEditor

        miniEditor.setText('6 hours')
        atom.commands.dispatch(addDialog.element, 'core:confirm')
      })

      waitsFor(() => atom.notifications.getNotifications().length)

      runs(() => {
        expect(atom.notifications.getNotifications()[0].getMessage()).toContain('6 hours')

        expect(mocks.trello.addCommentToCard)
        .toHaveBeenCalledWith(
          '121',
          'Time: 6 hours'
        )

        timeLink = card.querySelector('span.icon-clock.text-success')

        expect(timeLink).toExist()
      })
    })
  })
})
