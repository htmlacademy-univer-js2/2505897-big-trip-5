import { EVENT_TYPES } from '../const.js';
import {getRandomElementOfArray, getRandomIntValue} from '../utils/common.js';
import {getTwoRandomDates} from '../utils/point-utils.js';
import { getRandomDestination } from './destination.js';
import { getRandomOffer } from './offer-info.js';

const MIN_COST = 2000;
const MAX_COST = 5000;
const OFFERS_MIN_COUNT = 1;
const OFFERS_MAX_COUNT = 5;

const getRandomPoint = () => {
  const twoDates = getTwoRandomDates();

  return {
    id: crypto.randomUUID(),
    eventType: getRandomElementOfArray(EVENT_TYPES),
    destination: getRandomDestination(),
    startDatetime: twoDates[0],
    endDatetime: twoDates[1],
    price: getRandomIntValue(MIN_COST, MAX_COST),
    offers: Array.from({ length: getRandomIntValue(OFFERS_MIN_COUNT, OFFERS_MAX_COUNT) }, getRandomOffer),
    isFavorite: Boolean(getRandomIntValue(0, 1)),
  };
};

export {getRandomPoint};
