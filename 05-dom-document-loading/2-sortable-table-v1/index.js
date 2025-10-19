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

    this.body = createDiv('sortable-table__body');
    this.body.dataset.element = 'body';

    this.subElements = {
      body: this.createBodyElement()
    };

    this.element = this.createTemplate();
  }

  sort(field, order) {
    const sortingConfig = this.headerConfig.filter((i) => i.id === field)[0];
    if (!sortingConfig.sortable) {
      return;
    }

    if (sortingConfig.sortType === 'string') {
      const collator = new Intl.Collator('ru', { caseFirst: 'upper' });
      if (order === 'asc') {
        this.data = this.data.sort((a, b) => collator.compare(a[field], b[field]));
      } else {
        this.data = this.data.sort((a, b) => collator.compare(b[field], a[field]));
      }
    } else {
      if (order === 'asc') {
        this.data = this.data.sort((a, b) => a[field] - b[field]);
      } else {
        this.data = this.data.sort((a, b) => b[field] - a[field]);
      }
    }

    this.createBodyElement();
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

    this.body.innerHTML = '';

    this.data.forEach((product) => {
      const link = document.createElement('a');
      link.href = `/products/${product.id}`;
      link.classList.add('sortable-table__row');

      let row = '';
      this.headerConfig.forEach((column) => {
        row += (column.template) ?
          column.template(product[column.id]) :
          `<div class="sortable-table__cell">${product[column.id]}</div>`;
      });

      link.innerHTML = row;

      this.body.append(link);
    });
    return this.body;
  }

  createTemplate() {
    const template = createDiv('sortable-table');
    template.append(this.createHeaderElement());
    template.append(this.createBodyElement());
    return template;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
