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
    return ``;
  }

  createBodyElement() {
    return ``;
  }

  createTemplate() {
    return this.createHeaderElement() + this.createBodyElement();
  }
}
