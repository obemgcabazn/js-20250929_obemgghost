import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable extends SortableTableV2 {
  constructor(headersConfig, settings) {
    super(headersConfig, settings);

    this.sort(this.sorted.id, this.sorted.order);
    this.setListeners();
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
      super.render();
    } catch (e) {
      console.error(e);
    }
  }
}
