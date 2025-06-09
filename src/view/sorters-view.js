import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sortType, currentSortType, isDisabled) {
  isDisabled = isDisabled || sortType === SortType.OFFERS || sortType === SortType.EVENT;
  const isChecked = sortType === currentSortType;

  return `
    <div class="trip-sort__item trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="${sortType}"
        ${isDisabled ? 'disabled' : ''}
        ${isChecked && !isDisabled ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label></div>
    `;
}

export default class SortingView extends AbstractView {
  #currentSortType;
  #isDisabled;
  #sortTypeChangeHandler;

  constructor({ sortTypeChangeHandler, currentSortType, isDisabled }) {
    super();
    this.#sortTypeChangeHandler = sortTypeChangeHandler;
    this.#isDisabled = isDisabled;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#sortElementChangeHandler);
  }

  #sortElementChangeHandler = (evt) => {
    if (this.#isDisabled || evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#sortTypeChangeHandler(evt.target.value);
  };

  get template() {
    return `
    <form class="trip-sort" action="#" method="get">
      ${Object.values(SortType).map((type) => createSortItemTemplate(type, this.#currentSortType, this.#isDisabled)).join('')}
    </form>
  `;
  }
}
