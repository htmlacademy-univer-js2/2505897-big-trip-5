import { UpdateType, FilterType } from '../const.js';
import { render, replace } from '../framework/render.js';
import { pointsFilters } from '../utils/filter-utils.js';
import FilterView from '../view/filters-view.js';

export default class FilterPresenter {
  #pointsListModel;
  #filterModel;
  #container;
  #component;

  #modelChangeHandler = () => this.init();

  #filterTypeChangeHandler = (filterType) => this.#filterModel.setFilter(UpdateType.MAJOR, filterType);

  constructor({ containerElement, filterModel, pointsListModel }) {
    this.#container = containerElement;
    this.#filterModel = filterModel;
    this.#pointsListModel = pointsListModel;

    this.#pointsListModel.addObserver(this.#modelChangeHandler);
    this.#filterModel.addObserver(this.#modelChangeHandler);
  }

  init() {
    const previusComponent = this.#component;
    this.#component = new FilterView({
      currentFilterType: this.#filterModel.currentFilterType,
      filterTypeChangeHandler: this.#filterTypeChangeHandler,
      filters: Object.values(FilterType).map((filterType) => ({
        filterType,
        isDisabled: pointsFilters[filterType](this.#pointsListModel.points).length === 0
      }))
    });

    if (!previusComponent) {
      render(this.#component, this.#container);
    } else {
      replace(this.#component, previusComponent);
    }
  }
}
