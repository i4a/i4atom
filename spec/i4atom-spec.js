'use babel';

import I4atom from '../lib/i4atom.js';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('I4atom', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('i4atom');
  });

  describe('when the i4atom:open event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.i4atom')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'i4atom:open');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.i4atom')).toExist();

        let i4atomElement = workspaceElement.querySelector('.i4atom');
        expect(i4atomElement).toExist();

        let i4atomView = atom.workspace.getPaneItems()[0];
        expect(i4atomView.constructor.name).toBe('ViewContainer');

        let i4atomPane = atom.workspace.paneForItem(i4atomView);
        expect(i4atomPane.isActive()).toBe(true);
        expect(i4atomPane.isFocused()).toBe(true);
      });
    });

    it('shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.i4atom')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'i4atom:open');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let i4atomElement = workspaceElement.querySelector('.i4atom');
        expect(i4atomElement).toBeVisible();

        expect(i4atomElement.textContent).toBe('Configure i4atom');
      });
    });
  });
});
