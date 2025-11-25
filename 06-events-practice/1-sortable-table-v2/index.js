import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTableV2 extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = true
  } = {}) {
    super(headersConfig, data);
    this.sorted = sorted;
    this.url = url;
    this.isSortLocally = isSortLocally;

    this.sort(this.sorted.id, this.sorted.order);
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

  setListeners() {
    this.element.addEventListener('pointerdown', this.onTableCellClick);
  }

  reverseOrder(order) {
    return order === 'asc' ? 'desc' : 'asc';
  }

  onTableCellClick = (event) => {
    const tableCell = event.target.closest('.sortable-table__cell');
    if (!tableCell || tableCell.dataset.sortable === 'false') {
      return;
    }

    if (this.sorted.id === tableCell.dataset.id) {
      const newSortOrder = this.reverseOrder(this.sorted.order);
      tableCell.dataset.order = newSortOrder;
      this.sorted.order = newSortOrder;
    } else {
      this.sorted.id = tableCell.dataset.id;
      this.sorted.order = 'desc';
    }

    this.sort(this.sorted.id, this.sorted.order);
  }

  async sort(sortField, sortOrder) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, sortOrder);
    } else {
      await this.sortOnServer(sortField, sortOrder);
    }
  }

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
  }

  async sortOnServer(sortField, sortOrder) {
    throw new Error("not implemented");
  }

  render() {
    super.render();
    this.setListeners();
  }

  destroy() {
    this.element.removeEventListener('pointerdown', this.onTableCellClick);
    this.remove();
  }
}
