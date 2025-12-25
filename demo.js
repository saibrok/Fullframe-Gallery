import FullframeGallery from './gallery.js';

const state = {
  items: [],
  page: 1,
  itemsPerPage: 15,
  rows: 3,
  autoRows: true,
  gap: 10,
  skeletonRatio: 3 / 4,
  itemsToRender: 10,
  dataSource: 'images.json',
  stripSizes: false,
};

const elements = {};
let galleryInstance = null;

function cacheElements() {
  elements.gallery = document.querySelector('[data-justified-gallery]');
  elements.passSizes = document.getElementById('passSizes');
  elements.itemsPerPage = document.getElementById('itemsPerPage');
  elements.itemsToRender = document.getElementById('itemsToRender');
  elements.rowsInput = document.getElementById('rowsInput');
  elements.autoRows = document.getElementById('autoRows');
  elements.gapInput = document.getElementById('gapInput');
  elements.skeletonRatio = document.getElementById('skeletonRatio');
  elements.prevPage = document.getElementById('prevPage');
  elements.nextPage = document.getElementById('nextPage');
  elements.pageInfo = document.getElementById('pageInfo');
  elements.totalCount = document.getElementById('totalCount');
}

function totalPages() {
  if (!state.itemsToRender) {
    return 1;
  }
  return Math.max(1, Math.ceil(state.items.length / state.itemsToRender));
}

function currentPageItems() {
  if (!state.itemsToRender) {
    return applySizeMode(state.items.slice());
  }
  let start = (state.page - 1) * state.itemsToRender;
  return applySizeMode(state.items.slice(start, start + state.itemsToRender));
}

function applySizeMode(items) {
  if (!state.stripSizes) {
    return items;
  }
  return items.map(function (item) {
    let copy = Object.assign({}, item);
    delete copy.width;
    delete copy.height;
    return copy;
  });
}

// Перерисовывает галерею и запускает раскладку.
function renderGallery() {
  let gallery = elements.gallery;
  if (!gallery) {
    return;
  }

  let pages = totalPages();
  if (state.page > pages) {
    state.page = pages;
  }

  let pageItems = currentPageItems();

  if (!galleryInstance) {
    galleryInstance = new FullframeGallery(gallery, pageItems, {
      rows: state.rows,
      autoRows: state.autoRows,
      itemsPerPage: state.itemsPerPage,
      gap: state.gap,
      skeletonRatio: state.skeletonRatio,
    });
  } else {
    galleryInstance.setItems(pageItems);
    galleryInstance.setOptions({
      rows: state.rows,
      autoRows: state.autoRows,
      itemsPerPage: state.itemsPerPage,
      gap: state.gap,
      skeletonRatio: state.skeletonRatio,
    });
  }

  updatePagination();
}

function updatePagination() {
  let pages = totalPages();
  elements.pageInfo.textContent = 'Страница ' + state.page + ' из ' + pages;
  elements.prevPage.disabled = state.page <= 1;
  elements.nextPage.disabled = state.page >= pages;
  elements.totalCount.textContent = 'Всего: ' + state.items.length;
}

// Обрабатывает изменения контролов.
function bindControls() {
  elements.itemsPerPage.addEventListener('input', function () {
    let value = parseInt(elements.itemsPerPage.value, 10);
    state.itemsPerPage = Number.isFinite(value) && value >= 0 ? value : 15;
    state.page = 1;
    renderGallery();
  });

  elements.itemsToRender.addEventListener('input', function () {
    let value = parseInt(elements.itemsToRender.value, 10);
    state.itemsToRender = Number.isFinite(value) && value > 0 ? value : 0;
    state.page = 1;
    renderGallery();
  });

  elements.rowsInput.addEventListener('input', function () {
    let value = parseInt(elements.rowsInput.value, 10);
    state.rows = Number.isFinite(value) && value > 0 ? value : 3;
    renderGallery();
  });

  elements.autoRows.addEventListener('change', function () {
    state.autoRows = elements.autoRows.checked;
    renderGallery();
  });

  elements.gapInput.addEventListener('input', function () {
    let value = parseInt(elements.gapInput.value, 10);
    state.gap = Number.isFinite(value) && value >= 0 ? value : 10;
    renderGallery();
  });

  elements.skeletonRatio.addEventListener('change', function () {
    let value = parseFloat(elements.skeletonRatio.value);
    state.skeletonRatio = Number.isFinite(value) && value > 0 ? value : 3 / 4;
    renderGallery();
  });

  elements.passSizes.addEventListener('change', function () {
    state.stripSizes = !elements.passSizes.checked;
    state.page = 1;
    renderGallery();
  });

  elements.prevPage.addEventListener('click', function () {
    state.page = Math.max(1, state.page - 1);
    renderGallery();
  });

  elements.nextPage.addEventListener('click', function () {
    state.page = Math.min(totalPages(), state.page + 1);
    renderGallery();
  });
}

// Загружает JSON как будто это ответ от бэкенда.
function loadData() {
  return fetch(state.dataSource)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Не удалось загрузить JSON');
      }
      return response.json();
    })
    .then(function (data) {
      state.items = data;
    });
}

document.addEventListener('DOMContentLoaded', function () {
  cacheElements();
  bindControls();

  loadData()
    .then(function () {
      renderGallery();
    })
    .catch(function () {
      elements.pageInfo.textContent = 'Не удалось загрузить данные';
    });
});
