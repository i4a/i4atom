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

  describe('open pull request', () => {
    it('works', () => {
      const cardName = 'Card with Pepe without PR'
      const pullRequestTitle = `Pull request for ${cardName}`

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
        return this.listElement && this.listElement.innerText.includes(cardName)
      })

      let card

      runs(() => {
        card =
          Array
          .from(this.listElement.querySelectorAll('.i4atom-Card'))
          .find((card) => card.querySelector('.name').innerText == cardName)

        expect(card).toExist()

        let openPullRequestButton = card.querySelector('button.open-pull-request')

        openPullRequestButton.click()
      })

      waitsFor(() => {
        this.editorElement = workspaceElement.querySelector('atom-text-editor.editor.mini')
        return this.editorElement && this.editorElement.innerText.includes(cardName)
      })

      runs(() => {
        expect(mocks.gitPushSpy).toHaveBeenCalledWith('origin', 'wip-branch')

        atom.notifications.clear()

        let addPanel
        [addPanel] = atom.workspace.getModalPanels()
        const addDialog = addPanel.getItem()
        const miniEditor = addDialog.miniEditor

        miniEditor.setText(pullRequestTitle)
        atom.commands.dispatch(addDialog.element, 'core:confirm')
      })

      waitsFor(() => atom.notifications.getNotifications().length)

      runs(() => {
        expect(atom.notifications.getNotifications()[0].getMessage()).toContain('<a href="https://github.com/thefrogs/thepond/pull/121">Title of pull request for card 121</a> opened and added to <a href="https://trello.card/121">card</a>')

        expect(mocks.trello.addCommentToCard)
        .toHaveBeenCalledWith(
          '121',
          'PR: https://github.com/thefrogs/thepond/pull/121'
        )
      })

      waitsFor(() => {
        return card.querySelector('.pull-request button.ask-review')
      })
    })
  })
})
