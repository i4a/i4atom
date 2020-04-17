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
        this.listElement = workspaceElement.querySelector('.i4atom-List')
        return this.listElement && this.listElement.innerText.includes(wipCardName)
      })

      runs(() => {
        expect(this.listElement).toExist()
        expect(this.listElement.innerText).toContain(wipCardName)

        let wipCard =
          Array
          .from(this.listElement.querySelectorAll('.i4atom-Card'))
          .find((card) => card.querySelector('.name').innerText == wipCardName)

        expect(wipCard).toExist()

        let wipCardButton = wipCard.querySelector('.pull-request button')

        wipCardButton.click()
      })

      waitsFor(() => {
        this.editorElement = workspaceElement.querySelector('atom-text-editor.editor.mini')
        return this.editorElement && this.editorElement.innerText.includes('Please review <https://github.com/thefrogs/thepond/pull/122> by <@pepe-github>')
      })

      runs(() => {
        atom.notifications.clear()

        let addPanel
        [addPanel] = atom.workspace.getModalPanels()
        const addDialog = addPanel.getItem()
        const miniEditor = addDialog.miniEditor

        miniEditor.setText('Please, review this awesome pull request <https://github.com/thefrogs/thepond/pull/122>')
        atom.commands.dispatch(addDialog.element, 'core:confirm')
      })

      waitsFor(() => atom.notifications.getNotifications().length)

      runs(() => {
        expect(atom.notifications.getNotifications()[0].getMessage()).toContain('Review request sent')

        expect(mocks.slack)
        .toHaveBeenCalledWith(
          'https://hooks.slack.com/services/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',
          { data: '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":"Please, review this awesome pull request <https://github.com/thefrogs/thepond/pull/122>"}}],"channel":"#dev-only","username":"Pepe, the frog","icon_emoji":":wide_eye_pepe:","parse":"full"}' }
        )
      })
    })
  })
})
