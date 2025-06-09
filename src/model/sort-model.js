import Observable from '../framework/observable.js';
import { SortType } from '../const.js';

export default class SortModel extends Observable {
  #currentSortType = SortType.DAY;

  get currentSortType() {
    return this.#currentSortType;
  }

  setSort(updateType, sortType) {
    this.#currentSortType = sortType;
    this._notify(updateType, sortType);
  }
}
