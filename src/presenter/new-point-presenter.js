import { ActionType, UpdateType, FormType } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render';
import FormEditingView from '../view/editing-form-view.js';
import { createEscKeydownHandler } from '../utils/common-utils.js';

export default class NewPointPresenter {
  #container;
  #component;
  #pointsListModel;
  #infoChangeHandler;
  #componentDestroyHandler;

  constructor({containerElement, pointsListModel, dataChangeHandler, componentDestroyHandler}) {
    this.#container = containerElement;
    this.#pointsListModel = pointsListModel;
    this.#infoChangeHandler = dataChangeHandler;
    this.#componentDestroyHandler = componentDestroyHandler;
  }

  init() {
    if(this.#component) {
      return;
    }

    this.#component = new FormEditingView({
      destinations: this.#pointsListModel.destinations,
      offers: this.#pointsListModel.offers,
      formType: FormType.CREATE,
      rollupButtonClickHandler: this.#rollupButtonClickHandler,
      submitButtonClickHandler: this.#submitButtonClickHandler,
      cancelButtonClickHandler: this.#cancelButtonClickHandler,
    });

    render(this.#component, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  destroy() {
    if (!this.#component) {
      return;
    }

    this.#componentDestroyHandler();
    remove(this.#component);
    this.#component = null;
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  setSaving() {
    this.#component.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#component.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#component.shake(resetFormState);
  }

  #submitButtonClickHandler = (pointData) => this.#infoChangeHandler(ActionType.ADD_POINT, UpdateType.MINOR, pointData);

  #rollupButtonClickHandler = () => this.destroy();

  #cancelButtonClickHandler = () => this.destroy();

  #escKeydownHandler = createEscKeydownHandler(() => this.destroy());
}
