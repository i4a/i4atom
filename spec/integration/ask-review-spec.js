'use babel';

import I4atom from '../../lib/i4atom.js';
import mock from '../support/basic-mocks'

describe('I4atom', () => {
  let workspaceElement, activationPromise

  beforeEach(() => {
    mock()

    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('i4atom')
  })

  describe('ask review button', () => {
    it('works', () => {
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
        expect(workspaceElement.querySelector('.i4atom-ListInProgress')).toExist()
      })
    })
  })
})
