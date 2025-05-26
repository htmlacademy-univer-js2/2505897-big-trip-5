import {getRandomElementOfArray, getRandomIntValue} from '../utils/common.js';
import {CITIES, DESCRIPTIONS} from '../const.js';

const MIN_DESCRIPTION_NUMBER = 1;
const MAX_DESCRIPTION_NUMBER = 5;
const MIN_PHOTO_NUMBER = 1;
const MAX_PHOTO_NUMBER = 5;

const getRandomDestination = () => ({
  description: Array.from({length: getRandomIntValue(MIN_DESCRIPTION_NUMBER, MAX_DESCRIPTION_NUMBER)}, () => getRandomElementOfArray(DESCRIPTIONS)).join(' '),
  city: getRandomElementOfArray(CITIES),
  pictures: Array.from({length: getRandomIntValue(MIN_PHOTO_NUMBER, MAX_PHOTO_NUMBER)}, () => `https://loremflickr.com/248/152?random=${getRandomIntValue(1, 1000)}`),
});

export {getRandomDestination};
