import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filter, currentFilter) {
  const checked = currentFilter === filter.id;
  const disabled = filter.disabled ? 'disabled' : '';

  return `<div class="trip-filters__filter">
    <input id="${`filter-${filter.id.toLowerCase()}`}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.id}" ${checked ? 'checked' : ''} ${disabled}>
    <label class="trip-filters__filter-label" for="${`filter-${filter.id.toLowerCase()}`}">${filter.name}</label>
  </div>`;
}

function createFiltersTemplate(allFilters, currentFilter) {
  return `<form class="trip-filters" action="#" method="get">
    ${allFilters.map((f) => createFilterTemplate(f, currentFilter)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #filterTypeChange = null;

  #onFilterChange = (event) => {
    event.preventDefault();
    this.#filterTypeChange(event.target.value);
  };

  constructor({filters, currentFilter, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#filterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#onFilterChange);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }
}
