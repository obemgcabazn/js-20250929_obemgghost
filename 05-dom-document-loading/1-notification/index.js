function createDiv(className, content = '') {
  const div = document.createElement('div');
  div.classList = className;
  div.textContent = content;
  return div;
}

export default class NotificationMessage {
  constructor(message, {duration = 1000, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = createDiv('notification');
    this.element.classList.add(this.type);

    const timer = createDiv('timer');
    this.element.append(timer);

    const inner = createDiv('inner-wrapper');

    const header = createDiv('notification-header', this.type);
    inner.append(header);

    const notificationBody = createDiv('notification-body', this.message);

    inner.append(notificationBody);

    this.element.append(inner);
  }

  show(target = document.body) {
    target.append(this.element);
    setTimeout(this.destroy.bind(this), this.duration);
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}
