import AbstractView from './view/abstract-view.js';

/** @enum {string} Перечисление возможных позиций для отрисовки */
const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * Функция для создания элемента на основе разметки
 * @param {string} template Разметка в виде строки
 * @returns {HTMLElement} Созданный элемент
 */
function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

/**
 * Функция для отрисовки элемента
 * @param {AbstractView} component Компонент, который должен был отрисован
 * @param {HTMLElement} container Элемент в котором будет отрисован компонент
 * @param {string} place Позиция компонента относительно контейнера. По умолчанию - `beforeend`
 */
function render(component, container, place = RenderPosition.BEFOREEND) {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can render only components');
  }

  if (!container) {
    throw new Error('Container element doesn\'t exist');
  }

  const elementToInsert = component.element;

  if (!elementToInsert) {
    throw new Error('Component element is null or undefined');
  }

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.insertAdjacentElement('beforebegin', elementToInsert);
      break;
    case RenderPosition.AFTERBEGIN:
      container.insertAdjacentElement('afterbegin', elementToInsert);
      break;
    case RenderPosition.BEFOREEND:
      container.insertAdjacentElement('beforeend', elementToInsert);
      break;
    case RenderPosition.AFTEREND:
      container.insertAdjacentElement('afterend', elementToInsert);
      break;
    default:
      throw new Error(`Unknown render position: ${place}`);
  }
}

/**
 * Функция для замены одного компонента на другой
 * @param {AbstractView} newComponent Компонент, который нужно показать
 * @param {AbstractView} oldComponent Компонент, который нужно скрыть
 */
function replace(newComponent, oldComponent) {
  if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
    throw new Error('Can replace only components');
  }

  const newElement = newComponent.element;
  const oldElement = oldComponent.element;

  const parent = oldElement.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newElement, oldElement);
}

/**
 * Функция для удаления компонента
 * @param {AbstractView} component Компонент, который нужно удалить
 */
function remove(component) {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
}

export {RenderPosition, createElement, render, replace, remove};
