import PointsListModel from './model/points-list-model.js';
import SortModel from './model/sort-model.js';
import FilterModel from './model/filter-model.js';

import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import SortPresenter from './presenter/sort-presenter.js';
import PointListPresenter from './presenter/point-list-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsApiService from './point-api-service.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

const sortModel = new SortModel();
const filterModel = new FilterModel();
const pointsListModel = new PointsListModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const newPointButtonPresenter = new NewPointButtonPresenter({
  containerElement: tripMainContainer,
  pointsListModel,
});

const pointsListPresenter = new PointListPresenter({
  containerElement: tripEventsContainer,
  pointsListModel,
  filterModel,
  sortModel,
  newPointButtonPresenter,
});

new FilterPresenter({
  containerElement: filterContainer,
  pointsListModel,
  filterModel,
}).init();

new SortPresenter({
  containerElement: tripEventsContainer,
  pointsListModel,
  sortModel,
  filterModel,
}).init();

new TripInfoPresenter({
  containerElement: tripMainContainer,
  pointsListModel,
}).init();

pointsListModel.init();
pointsListPresenter.init();
newPointButtonPresenter.init({
  buttonClickHandler: pointsListPresenter.newPointButtonClickHandler
});
