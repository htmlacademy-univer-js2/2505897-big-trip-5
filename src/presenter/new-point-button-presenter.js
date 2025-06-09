import { render } from '../framework/render.js';
import { UpdateType } from '../const.js';
import NewPointButtonView from '../view/new-point-button-view.js';

export default class NewPointButtonPresenter {
  #container;
  #component;

  constructor({containerElement, pointsListModel}) {
    this.#container = containerElement;
    pointsListModel.addObserver(this.#modelChangeHandler);
  }

  init({buttonClickHandler}) {
    this.#component = new NewPointButtonView({ buttonClickHandler: buttonClickHandler });
    render(this.#component, this.#container);
  }

  disableButton() {
    this.#component?.setDisabled(true);
  }

  enableButton() {
    this.#component?.setDisabled(false);
  }

  #modelChangeHandler = (updateType, { isError } = {}) => {
    if (updateType === UpdateType.INIT) {
      if (isError) {
        this.disableButton();
      } else {
        this.enableButton();
      }
    }
  };
}
