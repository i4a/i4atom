'use babel';

export default class ViewContainer {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('i4atom');

    // Create message element
    const message = document.createElement('div');
    const link = document.createElement('a')
    link.href = 'atom://config/packages/i4atom';
    link.textContent = 'Configure i4atom';
    link.classList.add('btn', 'btn-primary');
    this.element.appendChild(link);
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
