import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false
  } = {}) {
    super(headersConfig, data);
    this.url = url;
    this.isSortLocally = isSortLocally;

    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      this.sortOnServer(this.sorted.id, this.sorted.order);
    }
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


    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  }

  sortOnClient (id, order) {
    this.sort(id, order);
  }

  async sortOnServer (id, order) {
    try {
      const params = new URLSearchParams({
        _embed: 'subcategory.category',
        _sort: id,
        _order: order,
        _start: 0,
        _end: 30
      });

      const fetchUrl = BACKEND_URL + `/${this.url}/?${params.toString()}`;
      const response = await fetch(fetchUrl);
      this.data = await response.json();

    } catch (e) {
      console.error(e);
    }
  }
}
