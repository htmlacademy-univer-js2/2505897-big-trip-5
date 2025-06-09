import PointRouteView from '../view/point-of-route-view.js';
import { render, replace, remove } from '../framework/render.js';
import FormEditingView from '../view/editing-form-view.js';
import { Mode, ActionType, UpdateType } from '../const.js';
import { isSameDates } from '../utils/point-utils.js';
import { createEscKeydownHandler } from '../utils/common-utils.js';

export default class PointPresenter {
  #container;
  #component;
  #editingElement;
  #mode = Mode.DEFAULT;
  #pointData;
  #destinations;
  #offers;
  #infoChangeHandler;
  #modeChangeHandler;

  constructor({destinations, offers, containerElement, dataChangeHandler, modeChangeHandler}) {
    this.#container = containerElement;
    this.#infoChangeHandler = dataChangeHandler;
    this.#modeChangeHandler = modeChangeHandler;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  #componentRollupButtonClickHandler = () => {
    this.#modeChangeHandler();
    this.#mode = Mode.EDITING;
    replace(this.#editingElement, this.#component);
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #editComponentRollupButtonClickHandler = () => this.resetEditViewToPointView();

  #submitButtonClickHandler = async (updatedPoint) => {
    const isMinor =
      !isSameDates(updatedPoint.dateFrom, this.#pointData.dateFrom) ||
      !isSameDates(updatedPoint.dateTo, this.#pointData.dateTo) ||
      updatedPoint.basePrice !== this.#pointData.basePrice;

    await this.#infoChangeHandler(
      ActionType.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPoint
    );
  };

  #deleteButtonClickHandler = async (pointToDelete) => {
    await this.#infoChangeHandler(ActionType.DELETE_POINT, UpdateType.MINOR, pointToDelete);
  };

  #favoriteButtonClickHandler = () => this.#infoChangeHandler(
    ActionType.UPDATE_POINT, UpdateType.MINOR,
    {...this.#pointData, isFavorite: !this.#pointData.isFavorite}
  );

  #escKeydownHandler = createEscKeydownHandler(() => this.resetEditViewToPointView());

  init(point) {
    this.#pointData = point;
    const previusComponent = this.#component;
    const previusEditingComponent = this.#editingElement;

    this.#component = new PointRouteView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      rollupButtonClickHandler: this.#componentRollupButtonClickHandler,
      favoriteButtonClickHandler: this.#favoriteButtonClickHandler,
    });

    this.#editingElement = new FormEditingView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      rollupButtonClickHandler: this.#editComponentRollupButtonClickHandler,
      submitButtonClickHandler: this.#submitButtonClickHandler,
      deleteButtonClickHandler: this.#deleteButtonClickHandler,
    });

    if (!previusComponent || !previusEditingComponent) {
      render(this.#component, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#component, previusComponent);
    } else {
      replace(this.#component, previusEditingComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove([previusComponent, previusEditingComponent]);
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeydownHandler);
    remove([this.#component, this.#editingElement]);
  }

  resetEditViewToPointView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#editingElement.reset(this.#pointData);
      replace(this.#component, this.#editingElement);
      document.removeEventListener('keydown', this.#escKeydownHandler);
      this.#mode = Mode.DEFAULT;
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editingElement.updateElement({ isDisabled: true, isSaving: true });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editingElement.updateElement({ isDisabled: true, isDeleting: true });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#component.shake();
      return;
    }
    this.#editingElement.shake(this.#editingElement.updateElement({ isDisabled: false, isSaving: false, isDeleting: false }));
  }
}
