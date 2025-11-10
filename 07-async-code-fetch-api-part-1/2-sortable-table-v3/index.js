import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {

  INFINITY_SCROLL_GAP = 40;
  LOADING_PRODUCT_STEP = 10;

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false
  } = {}) {
    super(headersConfig, { data, sorted });
    this.url = url;
    this.isSortLocally = isSortLocally;

    this.start = 0;
    this.end = this.LOADING_PRODUCT_STEP;

    this.render();
  }

  sort(id, order) {
    if (this.isSortLocally) {
      this.sortOnClient(id, order);
    } else {
      this.sortOnServer(id, order);
    }
  }

  sortOnClient(id, order) {
    super.sort(id, order);
  }

  async sortOnServer(id, order) {
    this.isLoading = true;
    try {
      const fetchUrl = this.createFetchURL(id, order, 0, this.end);
      const response = await fetch(fetchUrl);
      this.data = await response.json();
      this.updateElement();

    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  async render() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      await this.sortOnServer(this.sorted.id, this.sorted.order);
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

  setListeners() {
    super.setListeners();
    if (!this.isSortLocally) {
      document.addEventListener('scroll', this.onWindowScroll);
    }
  }

  onWindowScroll = (e) => {
    if (this.isLoading) {
      return;
    }
    const { bottom } = this.element.getBoundingClientRect();
    const { clientHeight } = document.documentElement;
    if (bottom < clientHeight + this.INFINITY_SCROLL_GAP) {
      console.log('fetch');
      this.loadMoreData();
    }
  }

  createFetchURL(id, order, startProduct = 0, endProduct = 30) {
    const params = new URLSearchParams({
      _embed: 'subcategory.category',
      _sort: id,
      _order: order,
      _start: startProduct,
      _end: endProduct
    });
    return `${BACKEND_URL}/${this.url}?${params.toString()}`;
  }

  async loadMoreData() {
    this.isLoading = true;
    this.start = this.end;
    this.end = this.start + this.LOADING_PRODUCT_STEP;

    try {
      const fetchUrl = this.createFetchURL(this.sorted.id, this.sorted.order, this.start, this.end);
      const response = await fetch(fetchUrl);
      const newData = await response.json();

      if (newData.length > 0) {
        this.data.push(...newData);
        this.updateElement();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  destroy() {
    this.remove();
    this.element.removeEventListener('pointerdown', this.onTableCellClick);
  }
}
