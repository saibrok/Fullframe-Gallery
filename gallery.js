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
 * Берет размер зазора между элементами из CSS или стиля строки.
 * @param {Element} container
 * @returns {number}
 */
function readGap(container) {
  var row = container.querySelector(".gallery-row");
  if (row) {
    var rowGap = parseFloat(getComputedStyle(row).gap);
    if (Number.isFinite(rowGap)) {
      return rowGap;
    }
  }

  var styles = getComputedStyle(container);
  var gapValue = styles.getPropertyValue("--gallery-gap");
  var gap = parseFloat(gapValue);
  return Number.isFinite(gap) ? gap : 10;
}

/**
 * Нормализует параметры галереи, заполняет значения по умолчанию.
 * @param {{
 *   rows?: number,
 *   gap?: number,
 *   fallbackWidth?: number,
 *   fallbackHeight?: number
 * }} [options]
 * @returns {{
 *   rows: (number|null),
 *   gap: (number|null),
 *   fallbackWidth: number,
 *   fallbackHeight: number
 * }}
 */
function normalizeOptions(options) {
  var normalized = {
    rows: null,
    gap: null,
    fallbackWidth: 320,
    fallbackHeight: 240,
  };

  if (options) {
    if (Number.isFinite(options.rows)) {
      normalized.rows = options.rows;
    }
    if (Number.isFinite(options.gap)) {
      normalized.gap = options.gap;
    }
    if (Number.isFinite(options.fallbackWidth)) {
      normalized.fallbackWidth = options.fallbackWidth;
    }
    if (Number.isFinite(options.fallbackHeight)) {
      normalized.fallbackHeight = options.fallbackHeight;
    }
  }

  return normalized;
}

/**
 * Объединяет текущие опции с новыми.
 * @param {Object} baseOptions
 * @param {Object} nextOptions
 * @returns {Object}
 */
function mergeOptions(baseOptions, nextOptions) {
  var merged = {};
  Object.keys(baseOptions).forEach(function (key) {
    merged[key] = baseOptions[key];
  });
  if (nextOptions) {
    Object.keys(nextOptions).forEach(function (key) {
      merged[key] = nextOptions[key];
    });
  }
  return merged;
}

/**
 * Собирает данные по изображениям: DOM-элементы и исходные размеры.
 * @param {Element} container
 * @param {{fallbackWidth: number, fallbackHeight: number}} options
 * @returns {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>}
 */
function buildItemList(container, options) {
  return Array.prototype.slice.call(container.querySelectorAll(".gallery-item")).map(function (itemEl) {
    var imgEl = itemEl.querySelector("img");
    var width = parseInt(imgEl.dataset.width, 10) || imgEl.naturalWidth || options.fallbackWidth || 1;
    var height = parseInt(imgEl.dataset.height, 10) || imgEl.naturalHeight || options.fallbackHeight || 1;
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
 * @param {{
 *   rows: (number|null),
 *   gap: (number|null),
 *   fallbackWidth: number,
 *   fallbackHeight: number
 * }} options
 */
function layoutGallery(container, options) {
  var items = buildItemList(container, options);
  var total = items.length;
  if (!total) {
    return;
  }

  // Количество строк можно задавать через data-rows, иначе берем авто-значение.
  var rowsNumber = Number.isFinite(options.rows) ? options.rows : parseInt(container.dataset.rows, 10);
  if (!Number.isFinite(rowsNumber) || rowsNumber <= 0) {
    rowsNumber = Math.ceil(total / 4);
  }

  var containerWidth = container.clientWidth;
  if (window.innerWidth <= document.documentElement.clientWidth) {
    containerWidth -= 20;
  }

  // Основной расчет: приводим все изображения к высоте 100px для оценки ширин.
  if (Number.isFinite(options.gap)) {
    container.style.setProperty("--gallery-gap", options.gap + "px");
  }
  var gap = Number.isFinite(options.gap) ? options.gap : readGap(container);
  var prepared = scaleToHeight(items, 100);
  var rows = splitIntoRows(prepared, rowsNumber);


  var fragment = document.createDocumentFragment();
  rows.forEach(function (row) {
    var rowEl = document.createElement("div");
    rowEl.className = "gallery-row";

    // Доступная ширина под элементы строки с учетом промежутков.
    var availableWidth = Math.max(containerWidth - gap * (row.length - 1), 1);
    var sizedRow;
    // Масштабируем строку так, чтобы занять всю ширину.
    var rowWidth = sumWidths(row);
    var scaleFactor = availableWidth / rowWidth;
    sizedRow = scaleByFactor(row, scaleFactor);

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
 * Класс галереи с хранимыми опциями и динамическим обновлением.
 */
class FullframeGallery {
  /**
   * @param {string|Element} target
   * @param {{
   *   rows?: number,
   *   gap?: number,
   *   fallbackWidth?: number,
   *   fallbackHeight?: number
   * }} [options]
   */
  constructor(target, options) {
    this.container = typeof target === "string" ? document.querySelector(target) : target;
    this.options = normalizeOptions(options);
    this._queued = false;
    this._resizeBound = false;
    this._handleResize = this._scheduleLayout.bind(this);

    if (this.container) {
      this.layout();
      this._bindResize();
    }
  }

  /**
   * Обновляет опции и пересчитывает галерею.
   * @param {Object} nextOptions
   */
  setOptions(nextOptions) {
    this.options = normalizeOptions(mergeOptions(this.options, nextOptions));
    this.layout();
  }

  /**
   * Пересчитывает галерею с текущими опциями.
   */
  layout() {
    if (!this.container) {
      return;
    }

    this._bindImageListeners();
    layoutGallery(this.container, this.options);
  }

  /**
   * Удаляет слушатели ресайза.
   */
  destroy() {
    if (this._resizeBound) {
      window.removeEventListener("resize", this._handleResize);
      this._resizeBound = false;
    }
  }

  /**
   * Подписывает на загрузку изображений, чтобы перестраивать раскладку.
   */
  _bindImageListeners() {
    var images = this.container.querySelectorAll("img");
    var self = this;
    images.forEach(function (img) {
      if (!img.__ffg_bound) {
        img.addEventListener("load", self._handleResize, { once: true });
        img.__ffg_bound = true;
      }
    });
  }

  /**
   * Привязывает обработчик изменения размеров окна.
   */
  _bindResize() {
    if (!this._resizeBound) {
      window.addEventListener("resize", this._handleResize);
      this._resizeBound = true;
    }
  }

  /**
   * Троттлинг через rAF, чтобы не пересчитывать слишком часто.
   */
  _scheduleLayout() {
    var self = this;
    if (this._queued) {
      return;
    }
    this._queued = true;
    window.requestAnimationFrame(function () {
      self._queued = false;
      self.layout();
    });
  }
}

if (typeof window !== "undefined") {
  window.FullframeGallery = FullframeGallery;
}
