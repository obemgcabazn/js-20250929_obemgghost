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
    this.subElements = this.getSubElements();
    this.sort(this.sorted.id, this.sorted.order);

    this.setListeners();
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  createElement() {
    const element = createDivElement();
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createSortArrowTemplate() {
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
        ${columnConfig.id === this.sorted.id ? this.createSortArrowTemplate() : ''}
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

  sort = (field, order) => {
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
    const newElement = this.createElement();
    this.element.replaceWith(newElement);
    this.element = newElement;
  }

  setListeners() {
    window.addEventListener('pointerdown', this.onTableCellClick);
  }

  onTableCellClick = (event) => {
    const tableCell = event.target.closest('.sortable-table__cell');
    if (!tableCell || tableCell.dataset.sortable === 'false') {
      return;
    }

    function reverseOrder(order) {
      return order === 'asc' ? 'desc' : 'asc';
    }

    if (this.sorted.id === tableCell.dataset.id) {
      const newSortOrder = reverseOrder(this.sorted.order);
      tableCell.dataset.order = newSortOrder;
      this.sorted.order = newSortOrder;
    } else {
      this.sorted.id = tableCell.dataset.id;
      this.sorted.order = 'asc';
    }

    this.sort(this.sorted.id, this.sorted.order);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    window.removeEventListener('pointerdown', this.onTableCellClick);
  }
}
