'use babel'

// Adapted from atom/tree-view
// https://github.com/atom/tree-view/blob/c3a00f4ab120c13eb255c1631a5e893e5c666ed3/lib/dialog.coffee

import { TextEditor, CompositeDisposable, Disposable, Emitter, Range, Point } from 'atom'

export default class Dialog {
  constructor(param = {}) {
    const {prompt, initialText, select, iconClass} = param

    this.emitter = new Emitter()
    this.disposables = new CompositeDisposable()

    this.element = document.createElement('div')
    this.element.classList.add('i4atom-dialog')

    this.promptText = document.createElement('label')
    this.promptText.classList.add('icon')
    if (iconClass) { this.promptText.classList.add(iconClass) }

    this.promptText.innerHTML = prompt
    this.element.appendChild(this.promptText)

    this.miniEditor = new TextEditor({mini: true});

    const blurHandler = () => {
      if (document.hasFocus()) { return this.close() }
    }

    this.miniEditor.element.addEventListener('blur', blurHandler)

    this.disposables.add(new Disposable(() => this.miniEditor.element.removeEventListener('blur', blurHandler)))
    this.disposables.add(this.miniEditor.onDidChange(() => this.showError()))

    this.element.appendChild(this.miniEditor.element)

    this.errorMessage = document.createElement('div')
    this.errorMessage.classList.add('error-message')
    this.element.appendChild(this.errorMessage)

    atom.commands.add(this.element,
      {
        'core:confirm': () => this._confirm(),
        'core:cancel': () => this._cancel()
      }
    )

    this.miniEditor.setText(initialText)

    if (select) {
      this.miniEditor.setSelectedBufferRange(Range(Point(0, 0), Point(0, initialText.length)))
    }
  }

  attach() {
    return new Promise((resolve, reject) => {
      this._promiseResolve = resolve
      this._promiseReject = reject

      this.panel = atom.workspace.addModalPanel({item: this})
      this.miniEditor.element.focus()

      this.miniEditor.scrollToCursorPosition()
    })
  }

  close() {
    const { panel } = this

    this.panel = null

    if (panel != null) {
      panel.destroy()
    }

    this.emitter.dispose()
    this.disposables.dispose()
    this.miniEditor.destroy()

    const activePane = atom.workspace.getCenter().getActivePane()

    if (!activePane.isDestroyed()) { return activePane.activate() }
  }

  showError(message) {
    if (message == null) { message = '' }

    this.errorMessage.textContent = message

    if (message) {
      this.element.classList.add('error');

      return window.setTimeout((() => this.element.classList.remove('error')), 300);
    }
  }

  _confirm() {
    const text = this.miniEditor.getText()

    this.close()
    this._promiseResolve(text)
  }
  _cancel() {
    this.close()
    this._promiseReject()
  }

}
