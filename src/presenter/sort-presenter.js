import SortingView from '../view/sorters-view.js';
import { render, replace, RenderPosition } from '../framework/render.js';
import { UpdateType } from '../const.js';
import { pointsFilters } from '../utils/filter-utils.js';

export default class SortPresenter {
  #containerElement;
  #sortModel;
  #filterModel;
  #pointsListModel;
  #component;

  constructor({ containerElement, sortModel, filterModel, pointsListModel }) {
    this.#containerElement = containerElement;
    this.#sortModel = sortModel;
    this.#filterModel = filterModel;
    this.#pointsListModel = pointsListModel;

    this.#sortModel.addObserver(this.#modelChangeHandler);
    this.#pointsListModel.addObserver(this.#modelChangeHandler);
  }

  init() {
    const previousComponent = this.#component;
    const filteredPoints = pointsFilters[this.#filterModel.currentFilterType](this.#pointsListModel.points);
    this.#component = new SortingView({
      currentSortType: this.#sortModel.currentSortType,
      sortTypeChangeHandler: this.#sortTypeChangeHandler,
      isDisabled: filteredPoints.length === 0,
    });

    if (!previousComponent) {
      render(this.#component, this.#containerElement, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#component, previousComponent);
    }
  }

  #sortTypeChangeHandler = (sortType) => this.#sortModel.setSort(UpdateType.MINOR, sortType);

  #modelChangeHandler = () => this.init();
}
