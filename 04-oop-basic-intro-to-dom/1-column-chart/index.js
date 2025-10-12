export default class ColumnChart {
  chartHeight = 50;

  constructor({data = [], label = '', value, link, formatHeading} = {}) {
    this.formatHeading = formatHeading;
    this.element = createDiv('column-chart column-chart_loading');
    this.element.style = `--chart-height: ${this.chartHeight}`;

    const title = createDiv('column-chart__title');
    title.textContent = `Total ${label}`;

    if (link) {
      const titleLink = document.createElement('a');
      titleLink.classList.add('column-chart__link');
      titleLink.href = link;
      titleLink.textContent = 'View all';
      title.append(titleLink);
    }

    this.element.append(title);

    this.container = createDiv('column-chart__container');

    this.header = createDiv('column-chart__header');
    this.header.textContent = this.formatHeading ? this.formatHeading(value) : value;
    this.header.dataset.element = 'header';
    this.container.append(this.header);

    this.chart = createDiv('column-chart__chart');
    this.chart.dataset.element = 'body';
    this.container.append(this.chart);

    this.element.append(this.container);
    this.update(data);
  }

  update(data) {

    if (data.length !== 0) {
      this.element.classList.remove('column-chart_loading');
      this.chart.innerHTML = '';

      const maxValue = Math.max(...data);
      const scale = this.chartHeight / maxValue;

      data.forEach((item) => {
        const div = document.createElement('div');
        div.style = `--value: ${Math.floor(item * scale)}`;
        div.dataset.tooltip = `${Math.round(item / maxValue * 100 )}%`;
        this.chart.append(div);
      });
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

const skeleton = document.createElement('img');
skeleton.src = 'charts-skeleton.svg';

function createDiv(className) {
  const div = document.createElement('div');
  div.classList = className;
  return div;
}
