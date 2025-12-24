/**
 * Масштабирует изображения к фиксированной высоте, сохраняя пропорции.
 * @param {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>} items
 * @param {number} height
 * @returns {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>}
 */
function scaleToHeight(items, height) {
  return items.map(function (item) {
    var width = Math.floor((height / item.height) * item.width);
    return {
      itemEl: item.itemEl,
      imgEl: item.imgEl,
      width: width,
      height: Math.floor(height),
    };
  });
}

/**
 * Суммирует ширины элементов строки.
 * @param {Array<{width: number}>} items
 * @returns {number}
 */
function sumWidths(items) {
  return items.reduce(function (acc, item) {
    return acc + item.width;
  }, 0);
}

/**
 * Масштабирует массив размеров по коэффициенту.
 * @param {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>} items
 * @param {number} factor
 * @returns {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>}
 */
function scaleByFactor(items, factor) {
  return items.map(function (item) {
    return {
      itemEl: item.itemEl,
      imgEl: item.imgEl,
      width: Math.floor(item.width * factor),
      height: Math.floor(item.height * factor),
    };
  });
}

/**
 * Разбивает элементы на несколько строк так, чтобы суммарная ширина каждой строки
 * была близка к целевому порогу. Это повторяет логику justifyImages.
 * @param {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>} items
 * @param {number} rowCount
 * @returns {Array<Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>>}
 */
function splitIntoRows(items, rowCount) {
  var totalWidth = sumWidths(items);
  var rows = [];
  var runningWidth = 0;
  var rowIndex = 0;
  var prevWidth = 0;

  items.forEach(function (item) {
    runningWidth += item.width;
    var target = (rowIndex + 1) * (totalWidth / rowCount);
    var between = prevWidth <= target && target <= runningWidth;
    var leftGap = target - prevWidth;
    var rightGap = runningWidth - target;

    if (between && leftGap <= rightGap) {
      rowIndex += 1;
      between = false;
    }

    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }

    rows[rowIndex].push(item);

    if (between && rightGap <= leftGap) {
      rowIndex += 1;
    }

    prevWidth = runningWidth;
  });

  return rows;
}

/**
 * Берет размер зазора между элементами из CSS-переменной.
 * @param {Element} container
 * @returns {number}
 */
function readGap(container) {
  var styles = getComputedStyle(container);
  var gapValue = styles.getPropertyValue("--gallery-gap");
  var gap = parseFloat(gapValue);
  return Number.isFinite(gap) ? gap : 10;
}

/**
 * Собирает данные по изображениям: DOM-элементы и исходные размеры.
 * @param {Element} container
 * @returns {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>}
 */
function buildItemList(container) {
  return Array.prototype.slice.call(container.querySelectorAll(".gallery-item")).map(function (itemEl) {
    var imgEl = itemEl.querySelector("img");
    var width = parseInt(imgEl.dataset.width, 10) || imgEl.naturalWidth || 1;
    var height = parseInt(imgEl.dataset.height, 10) || imgEl.naturalHeight || 1;
    return {
      itemEl: itemEl,
      imgEl: imgEl,
      width: width,
      height: height,
    };
  });
}

/**
 * Пересчитывает и раскладывает галерею: разбивает на строки и задает размеры.
 * @param {Element} container
 */
function layoutGallery(container) {
  var items = buildItemList(container);
  var total = items.length;
  if (!total) {
    return;
  }

  // Количество строк можно задавать через data-rows, иначе берем авто-значение.
  var rowsNumber = parseInt(container.dataset.rows, 10);
  if (!Number.isFinite(rowsNumber) || rowsNumber <= 0) {
    rowsNumber = Math.ceil(total / 4);
  }

  var containerWidth = container.clientWidth;
  if (window.innerWidth <= document.documentElement.clientWidth) {
    containerWidth -= 20;
  }

  // Основной расчет: приводим все изображения к высоте 100px для оценки ширин.
  var gap = readGap(container);
  var prepared = scaleToHeight(items, 100);
  var rows = splitIntoRows(prepared, rowsNumber);

  var fragment = document.createDocumentFragment();
  rows.forEach(function (row) {
    var rowEl = document.createElement("div");
    rowEl.className = "gallery-row";

    // Доступная ширина под элементы строки с учетом промежутков.
    var availableWidth = Math.max(containerWidth - gap * (row.length - 1), 1);
    var sizedRow;
    if (total < 4) {
      // Для маленьких наборов стараемся держать высоту 350px, но не вылезать за ширину.
      var preferred = scaleToHeight(row, 350);
      var preferredWidth = sumWidths(preferred);
      sizedRow = preferredWidth > availableWidth ? scaleByFactor(preferred, availableWidth / preferredWidth) : preferred;
    } else {
      // Для нормальных наборов масштабируем строку так, чтобы занять всю ширину.
      var rowWidth = sumWidths(row);
      var scaleFactor = availableWidth / rowWidth;
      sizedRow = scaleByFactor(row, scaleFactor);
    }

    sizedRow.forEach(function (item) {
      item.itemEl.style.width = item.width + "px";
      item.itemEl.style.height = item.height + "px";
      rowEl.appendChild(item.itemEl);
    });

    fragment.appendChild(rowEl);
  });

  // Полная перерисовка DOM-узлов строки.
  container.innerHTML = "";
  container.appendChild(fragment);
}

/**
 * Подготавливает галерею и подписывает на события загрузки и ресайза.
 * @param {Element} container
 */
function setupGallery(container) {
  var queued = false;
  // Троттлинг через rAF, чтобы не пересчитывать слишком часто.
  function scheduleLayout() {
    if (queued) {
      return;
    }
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      layoutGallery(container);
    });
  }

  var images = container.querySelectorAll("img");
  images.forEach(function (img) {
    if (!img.complete) {
      img.addEventListener("load", scheduleLayout, { once: true });
    }
  });

  scheduleLayout();
  window.addEventListener("resize", scheduleLayout);
}

/**
 * Инициализация по селектору или DOM-элементу.
 * @param {string|Element} target
 */
function initJustifiedGallery(target) {
  var container = target;
  if (typeof target === "string") {
    container = document.querySelector(target);
  }

  if (container) {
    setupGallery(container);
  }
}

/**
 * Публичное API.
 * @type {{init: Function, setup: Function, layout: Function}}
 */
var JustifiedGallery = {
  init: initJustifiedGallery,
  setup: setupGallery,
  layout: layoutGallery,
};

if (typeof window !== "undefined") {
  window.JustifiedGallery = JustifiedGallery;
}
