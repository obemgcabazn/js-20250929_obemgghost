import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  constructor({url = '', range, label, value = null, link, formatHeading} = {}) {
    this.url = url;
    this.from = range.from;
    this.to = range.to;
    this.value = value;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    this.element = this.createElement();
    this.update(this.from, this.to);
  }

  async update(from, to) {
    await this.fetchData(this.url, from, to);

    if (this.data.length !== 0) {
      this.value = this.getTotal();
      const newElement = this.createElement();
      this.element.replaceWith(newElement);
      this.element = newElement;
      this.element.classList.remove('column-chart_loading');
      // this.subElements = this.getSubElements();
    }

    return this.data;
  }

  createTooltipTemplate(item) {
    const desc = this.toLocaleData(item[0]);
    return `<div><small>${desc}</small></div><strong>${item[1]}</strong>`;
  }

  createChartBarsElement() {
    const dataValues = Object.entries(this.data);
    const maxValue = dataValues.reduce((acc, current) => {
      return (acc < current[1]) ? current[1] : acc;
    }, 0);
    const scale = this.chartHeight / maxValue;
    return dataValues.map((item) => {
      return `<div style="--value: ${Math.floor(item[1] * scale)}" data-tooltip="${this.createTooltipTemplate(item)}"></div>`;
    }).join('');
  }

  getTotal() {
    const dataValues = Object.entries(this.data);
    return dataValues.reduce((acc, current) => {
      return acc + current[1];
    }, 0);
  }

  createBodyTemplate() {
    if (!this.data) {
      return '';
    }

    return `
    <div data-element="body" class="column-chart__chart">
      ${this.createChartBarsElement()}
    </div>
    `;
  }

  createElement() {
    const element = createDivElement();
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createTemplate() {
    return `
    <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        <a href="${this.link}" class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.headingValue}</div>
        ${this.createBodyTemplate()}
      </div>
    </div>
    `;
  }

  async fetchData(url, from, to) {
    try {
      const params = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString()
      });

      const fetchUrl = BACKEND_URL + `/${url}/?${params.toString()}`;
      const response = await fetch(fetchUrl);
      this.data = await response.json();
    } catch (e) {
      console.error(e);
    }
  }

  toLocaleData(date) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  get headingValue() {
    if (this.value === '') {
      return '';
    }
    return this.formatHeading ? this.formatHeading(this.value) : this.value;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}

function createDivElement(className = '', content = '') {
  const div = document.createElement('div');
  div.classList = className;
  div.textContent = content;
  return div;
}
