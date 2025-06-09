import AbstractView from '../framework/view/abstract-view.js';
import { getDateDifference, getTime, getMonthAndDay, getOfferById, getOffersByType, getDestinationById } from '../utils/point-utils.js';

function createOfferItem(offerId, availableOffers) {
  const currentOffer = getOfferById(offerId, availableOffers) || {};

  if (!currentOffer) {
    return '';
  }

  return `
    <li class="event__offer">
      <span class="event__offer-title">${currentOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${currentOffer.price}</span>
    </li>
  `;
}

function createTemplate(point, destinations, allOffers) {
  const {type, destination, dateFrom, dateTo, basePrice, offers, isFavorite} = point;

  const startingDate = getMonthAndDay(dateFrom);
  const startingTime = getTime(dateFrom);
  const endingTime = getTime(dateTo);
  const duration = getDateDifference(dateFrom, dateTo);
  const availableOffers = getOffersByType(type, allOffers);
  const destinationInfo = getDestinationById(destination, destinations);

  const offersMarkup = offers.map((offerId) => createOfferItem(offerId, availableOffers)).join('');
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${startingDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationInfo.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${startingTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${endingTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>
        <button class="event__favorite-btn  ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
    `;
}

export default class PointRouteView extends AbstractView {
  #currentPoint;
  #currentDestinations;
  #currentOffers;
  #rollupButtonClickHandler;
  #favoriteButtonClickHandler;

  constructor({point, destinations, offers, rollupButtonClickHandler, favoriteButtonClickHandler}) {
    super();
    this.#currentPoint = point;
    this.#currentDestinations = destinations;
    this.#currentOffers = offers;
    this.#rollupButtonClickHandler = rollupButtonClickHandler;
    this.#favoriteButtonClickHandler = favoriteButtonClickHandler;

    const rollupButtonElement = this.element.querySelector('.event__rollup-btn');
    const favoriteButtonElement = this.element.querySelector('.event__favorite-btn');
    rollupButtonElement.addEventListener('click', this.#rollupButtonElementClickHandler);
    favoriteButtonElement.addEventListener('click', this.#favoriteButtonElementClickHandler);
  }

  get template() {
    return createTemplate(this.#currentPoint, this.#currentDestinations, this.#currentOffers);
  }

  #rollupButtonElementClickHandler = (evt) => {
    evt.preventDefault();
    this.#rollupButtonClickHandler();
  };

  #favoriteButtonElementClickHandler = (evt) => {
    evt.preventDefault();
    this.#favoriteButtonClickHandler();
    evt.currentTarget.blur();
  };
}
