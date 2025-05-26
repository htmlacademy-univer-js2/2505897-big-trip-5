import { getRandomElementOfArray, getRandomIntValue } from '../utils/common.js';
import { EVENT_TYPES, OFFERS } from '../const.js';

const MIN_COST = 10;
const MAX_COST = 2000;

function getRandomOffer() {
  return {
    type: getRandomElementOfArray(EVENT_TYPES),
    title: getRandomElementOfArray(OFFERS),
    price: getRandomIntValue(MIN_COST, MAX_COST)
  };
}

export { getRandomOffer };
