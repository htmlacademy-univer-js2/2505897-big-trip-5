import { FiltersView } from '../view/filters-view.js';
import { FILTER_TYPES, UPDATE_TYPES } from '../const.js';
import { pointsFilters } from '../utils/filter-utils.js';
import { render, replace } from '../framework/render';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  #onFilterTypeChange = (filterType) => {
    if(this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UPDATE_TYPES.MAJOR, filterType);
  };

  #onPointsModelChange = () => {
    this.init();
  };

  constructor({filterContainer, filterModel, pointsListModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsListModel;

    this.#pointsModel.addObserver(this.#onPointsModelChange);
    this.#filterModel.addObserver(this.#onPointsModelChange);
  }

  get filters() {
    const allPoints = this.#pointsModel.points;
    return Object.values(FILTER_TYPES).map((type) => {
      const count = pointsFilters[type](allPoints).length;
      return {
        id: type,
        name: type,
        disabled: count === 0
      };
    });
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters: this.filters,
      currentFilter: this.#filterModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange,
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
  }
}
