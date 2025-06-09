import PointRouteListView from '../view/point-of-route-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import ErrorView from '../view/error-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SortType, ActionType, UpdateType, FilterType, TimeLimit } from '../const.js';
import { pointsSorters } from '../utils/sorting-utils.js';
import { pointsFilters } from '../utils/filter-utils.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class PointsListPresenter {
  #component = new PointRouteListView();
  #container;
  #pointsListModel;
  #filterModel;
  #sortModel;
  #newPointButtonPresenter;
  #pointsPresenters = new Map();
  #emptyElement;
  #loadingElement = new LoadingView();
  #errorElement = new ErrorView();
  #isLoading = true;
  #uiBlocker = new UiBlocker({ lowerLimit: TimeLimit.LOWER_LIMIT, upperLimit: TimeLimit.UPPER_LIMIT });
  #newPointPresenter;

  constructor({ containerElement, filterModel, sortModel, pointsListModel, newPointButtonPresenter }) {
    this.#container = containerElement;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#pointsListModel = pointsListModel;
    this.#newPointButtonPresenter = newPointButtonPresenter;

    this.#pointsListModel.addObserver(this.#modelChangeHandler);
    this.#filterModel.addObserver(this.#modelChangeHandler);
    this.#sortModel.addObserver(this.#modelChangeHandler);

    this.#newPointPresenter = new NewPointPresenter({
      containerElement: this.#component.element,
      pointsListModel: this.#pointsListModel,
      dataChangeHandler: this.#dataChangeHandler,
      componentDestroyHandler: this.#newPointComponentDestroyHandler,
    });
  }

  init() {
    this.#newPointButtonPresenter.disableButton();
    this.#renderList();
  }

  #renderList() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    render(this.#component, this.#container);
    const filteredPoints = pointsFilters[this.#filterModel.currentFilterType](this.#pointsListModel.points);
    if (filteredPoints.length) {
      pointsSorters[this.#sortModel.currentSortType](filteredPoints);
      filteredPoints.forEach((point) => this.#renderPoint(point));
    } else {
      this.#renderEmptyList();
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      destinations: this.#pointsListModel.destinations,
      offers: this.#pointsListModel.offers,
      containerElement: this.#component.element,
      dataChangeHandler: this.#dataChangeHandler,
      modeChangeHandler: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyList() {
    this.#emptyElement = new EmptyListView(this.#filterModel.currentFilterType);
    render(this.#emptyElement, this.#component.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingElement, this.#container, RenderPosition.BEFOREEND);
  }

  #renderError() {
    render(this.#errorElement, this.#container, RenderPosition.BEFOREEND);
  }

  #clearPointsList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    this.#newPointPresenter.destroy();
    if (this.#emptyElement) {
      remove(this.#emptyElement);
    }
  }

  newPointButtonClickHandler = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonPresenter.disableButton();
    this.#newPointPresenter.init();
  };

  #modelChangeHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#sortModel.setSort(UpdateType.MINOR, SortType.DAY);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingElement);
        if (data.isError) {
          this.#renderError();
        } else {
          this.#renderList();
        }
    }
  };

  #dataChangeHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    const currentPresenter = this.#pointsPresenters.get(update.id);
    try {
      switch (actionType) {
        case ActionType.UPDATE_POINT:
          currentPresenter.setSaving();
          await this.#pointsListModel.updatePoint(updateType, update);
          break;
        case ActionType.DELETE_POINT:
          currentPresenter.setDeleting();
          await this.#pointsListModel.deletePoint(updateType, update);
          break;
        case ActionType.ADD_POINT:
          this.#newPointPresenter.setSaving();
          await this.#pointsListModel.addPoint(updateType, update);
      }
    } catch {
      if (actionType === ActionType.ADD_POINT) {
        this.#newPointPresenter.setAborting();
      } else {
        currentPresenter.setAborting();
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #newPointComponentDestroyHandler = () => this.#newPointButtonPresenter.enableButton();

  #modeChangeHandler = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetEditViewToPointView());
    this.#newPointPresenter.destroy();
  };
}
