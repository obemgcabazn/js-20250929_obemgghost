function createDivElement(className = '', content = '') {
  const div = document.createElement('div');
  div.classList = className;
  div.textContent = content;
  return div;
}

export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.element = this.createElement();
  }

  createElement() {
    const element = createDivElement();
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createSortArrowElement() {
    return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
  }

  createTableHeaderTemplate() {
    return this.headerConfig.map(columnConfig => (
      `<div class="sortable-table__cell"
            data-id="${columnConfig.id}"
            data-sortable="${columnConfig.sortable}"
            data-order="${columnConfig.id === this.sorted.id ? this.sorted.order : 'asc'}">
        <span>${columnConfig.title}</span>
        ${columnConfig.id === this.sorted.id ? this.createSortArrowElement() : ''}
      </div>`
    )).join('');
  }

  createTableBodyCellTemplate(product, columnConfig) {
    const content = product[columnConfig.id];
    if (columnConfig.template) {
      return columnConfig.template(content);
    }
    return `<div class="sortable-table__cell">${content}</div>`;
  }

  createTableBodyRowTemplate(product) {
    return `
      <a href="/products/${product.id}" class="sortable-table__row">
         ${this.headerConfig.map(columnConfig =>
    this.createTableBodyCellTemplate(product, columnConfig)
  ).join('')}
      </a>
    `;
  }

  createTableBodyTemplate() {
    return this.data.map(product => (
      this.createTableBodyRowTemplate(product)
    )).join('');
  }

  createTemplate() {
    return `
    <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.createTableHeaderTemplate()}
        </div>
        <div data-element="body" class="sortable-table__body">
            ${this.createTableBodyTemplate()}
        </div>
    </div>
    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
    `;
  }

  sort(field, order) {
    this.sorted.id = field;
    this.sorted.order = order;

    const sortingConfig = this.headerConfig.find((config) => config.id === this.sorted.id);
    if (!sortingConfig?.sortable) {
      return;
    }

    const compareFn = (a, b) => {
      if (sortingConfig.sortType === 'string') {
        const collator = new Intl.Collator('ru', { caseFirst: 'upper' });
        return this.sorted.order === 'asc' ?
          collator.compare(a[field], b[field]) :
          collator.compare(b[field], a[field]);
      }

      return this.sorted.order === 'asc' ? a[field] - b[field] : b[field] - a[field];
    };

    this.data.sort(compareFn);

    this.element = this.createElement();
    console.log(this.data);
  }
}
