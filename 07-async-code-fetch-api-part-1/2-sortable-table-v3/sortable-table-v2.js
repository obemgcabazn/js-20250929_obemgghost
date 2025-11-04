import SortableTableV1 from "./sortable-table-v1.js";

export default class SortableTableV2 extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.sorted = sorted;
    this.sort(this.sorted.id, this.sorted.order);
    this.setListeners();
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
    window.addEventListener('pointerdown', this.onTableCellClick);
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

  destroy() {
    this.remove();
    window.removeEventListener('pointerdown', this.onTableCellClick);
  }
}
