'use babel';

export default class I4atomView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('i4atom');

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The I4atom package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'i4a';
  }

  getIconName() {
    return 'squirrel';
  }

  getDefaultLocation() {
    return 'right';
  }
}
