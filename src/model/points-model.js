import {POINT_COUNT} from '../const.js';
import {generatePoint} from '../mock/point.js';


export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, generatePoint);

  getPoints() {
    return this.#points;
  }
}
