var state = {
  items: [],
  page: 1,
  perPage: 15,
  rows: 3,
  autoRows: true,
  gap: 10,
  useKnownSizes: true,
};

var elements = {};
var galleryInstance = null;

function cacheElements() {
  elements.gallery = document.querySelector("[data-justified-gallery]");
  elements.itemsPerPage = document.getElementById("itemsPerPage");
  elements.rowsInput = document.getElementById("rowsInput");
  elements.autoRows = document.getElementById("autoRows");
  elements.gapInput = document.getElementById("gapInput");
  elements.knownSizes = document.getElementById("knownSizes");
  elements.prevPage = document.getElementById("prevPage");
  elements.nextPage = document.getElementById("nextPage");
  elements.pageInfo = document.getElementById("pageInfo");
}

function totalPages() {
  return Math.max(1, Math.ceil(state.items.length / state.perPage));
}

function currentPageItems() {
  var start = (state.page - 1) * state.perPage;
  return state.items.slice(start, start + state.perPage);
}

// Создает HTML для одного элемента галереи.
function createGalleryItem(item) {
  var wrapper = document.createElement("div");
  wrapper.className = "gallery-item";

  var img = document.createElement("img");
  img.src = item.url;
  img.alt = item.title || "";
  img.loading = "lazy";

  if (state.useKnownSizes) {
    img.dataset.width = item.width;
    img.dataset.height = item.height;
  }

  wrapper.appendChild(img);
  return wrapper;
}

// Перерисовывает галерею и запускает раскладку.
function renderGallery() {
  var gallery = elements.gallery;
  if (!gallery) {
    return;
  }

  var pages = totalPages();
  if (state.page > pages) {
    state.page = pages;
  }

  gallery.dataset.rows = String(state.rows);
  gallery.innerHTML = "";

  currentPageItems().forEach(function (item) {
    gallery.appendChild(createGalleryItem(item));
  });

  if (window.FullframeGallery) {
    if (!galleryInstance) {
      galleryInstance = new window.FullframeGallery(gallery, {
        rows: state.rows,
        autoRows: state.autoRows,
        pageSize: state.perPage,
        gap: state.gap,
      });
    } else {
      galleryInstance.setOptions({
        rows: state.rows,
        autoRows: state.autoRows,
        pageSize: state.perPage,
        gap: state.gap,
      });
    }
  }

  updatePagination();
}

function updatePagination() {
  var pages = totalPages();
  elements.pageInfo.textContent = "Страница " + state.page + " из " + pages;
  elements.prevPage.disabled = state.page <= 1;
  elements.nextPage.disabled = state.page >= pages;
}

// Обрабатывает изменения контролов.
function bindControls() {
  elements.itemsPerPage.addEventListener("change", function () {
    state.perPage = parseInt(elements.itemsPerPage.value, 10);
    state.page = 1;
    renderGallery();
  });

  elements.rowsInput.addEventListener("input", function () {
    var value = parseInt(elements.rowsInput.value, 10);
    state.rows = Number.isFinite(value) && value > 0 ? value : 3;
    renderGallery();
  });

  elements.autoRows.addEventListener("change", function () {
    state.autoRows = elements.autoRows.checked;
    renderGallery();
  });

  elements.gapInput.addEventListener("input", function () {
    var value = parseInt(elements.gapInput.value, 10);
    state.gap = Number.isFinite(value) && value >= 0 ? value : 10;
    renderGallery();
  });

  elements.knownSizes.addEventListener("change", function () {
    state.useKnownSizes = elements.knownSizes.checked;
    renderGallery();
  });

  elements.prevPage.addEventListener("click", function () {
    state.page = Math.max(1, state.page - 1);
    renderGallery();
  });

  elements.nextPage.addEventListener("click", function () {
    state.page = Math.min(totalPages(), state.page + 1);
    renderGallery();
  });
}

// Загружает JSON как будто это ответ от бэкенда.
function loadData() {
  return fetch("images.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Не удалось загрузить JSON");
      }
      return response.json();
    })
    .then(function (data) {
      state.items = data;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  cacheElements();
  bindControls();

  loadData()
    .then(function () {
      renderGallery();
    })
    .catch(function () {
      elements.pageInfo.textContent = "Не удалось загрузить данные";
    });
});
