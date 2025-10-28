function createDivElement(className = '', content = '') {
  const div = document.createElement('div');
  div.classList = className;
  div.textContent = content;
  return div;
}

class Tooltip {

  static activeNotification = null;

  constructor() {
    this.rafId = null;
    this.mouseX = 0;
    this.mouseY = 0;

    if (Tooltip.activeNotification) {
      return Tooltip.activeNotification;
    }
    Tooltip.activeNotification = this;
  }
  initialize () {
    this.tooltips = document.querySelectorAll('[data-tooltip]');
    this.setListeners();
  }

  render(text) {
    if (this.element) {
      this.destroy();
    }
    this.element = createDivElement('tooltip', text);
    document.body.append(this.element);
  }

  createTooltipElement(event) {
    const text = event.target.dataset.tooltip;
    this.render(text);
  }

  setListeners() {
    this.tooltips.forEach((tooltip)=> {
      tooltip.addEventListener('pointerover', this.createTooltipElement.bind(this));
      tooltip.addEventListener('pointerout', this.destroy.bind(this));
    });

    document.addEventListener('pointermove', (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;

      if (this.rafId !== null || !this.element) {
        return;
      }

      this.rafId = requestAnimationFrame(() => {
        this.element.style.left = this.mouseX + 15 + 'px';
        this.element.style.top = this.mouseY + 15 + 'px';
        this.rafId = null;
      });

    });
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }

}

export default Tooltip;
