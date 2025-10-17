function createDiv(className, content = '') {
  const div = document.createElement('div');
  div.classList = className;
  div.textContent = content;
  return div;
}

export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
  }

  get element() {
    return this.createTemplate();
  }

  sort(field, order) {

  }

  createHeaderElement() {
    const header = createDiv('sortable-table__header sortable-table__row');
    header.dataset.element = 'header';

    this.headerConfig.map((column) => {
      const columnElement = createDiv('sortable-table__cell');
      columnElement.dataset.id = column.id;
      columnElement.dataset.sortable = column.sortable;

      const columnTitle = document.createElement('span');
      columnTitle.textContent = column.title;
      columnElement.append(columnTitle);

      header.append(columnElement);
    });

    return header;
  }

  createBodyElement() {
    const body = createDiv('sortable-table__body');
    body.dataset.element = 'body';
    const bodyContent = this.data.map((product) => {
      return `<a href="/products/${product.id}" class="sortable-table__row">
      <div class="sortable-table__cell">
        <img class="sortable-table-image" alt="Image" src="${product.images[0].url}">
      </div>
      <div class="sortable-table__cell">${product.title}</div>
      <div class="sortable-table__cell">${product.quantity}</div>
      <div class="sortable-table__cell">${product.price}</div>
      <div class="sortable-table__cell">${product.sales}</div>
    </a>`;
    });
    body.innerHTML = bodyContent.join('');
    return body;
  }

  createTemplate() {
    const template = createDiv('sortable-table');
    template.append(this.createHeaderElement());
    template.append(this.createBodyElement());
    return template;
  }
}
