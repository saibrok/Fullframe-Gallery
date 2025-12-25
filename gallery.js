/**
 * Масштабирует изображения к фиксированной высоте, сохраняя пропорции.
 * @param {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>} items
 * @param {number} height
 * @returns {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>}
 */
// Базовые значения для расчета раскладки.
const DEFAULT_GAP_PX = 10;
// Высота для оценки пропорций (не финальная высота строк).
const ESTIMATE_ROW_HEIGHT = 100;
// Делитель для авто-расчета числа строк.
const AUTO_ROWS_DIVISOR = 4;
// Минимально допустимая ширина для расчета, чтобы избежать деления на 0.
const MIN_AVAILABLE_WIDTH_PX = 1;

function scaleToHeight(items, height) {
  return items.map(function (item) {
    const width = (height / item.height) * item.width;
    return {
      itemEl: item.itemEl,
      imgEl: item.imgEl,
      width: width,
      height: height,
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
      width: item.width * factor,
      height: item.height * factor,
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
  let totalWidth = sumWidths(items);
  let rows = [];
  let runningWidth = 0;
  let rowIndex = 0;
  let prevWidth = 0;

  items.forEach(function (item) {
    runningWidth += item.width;
    let target = (rowIndex + 1) * (totalWidth / rowCount);
    let between = prevWidth <= target && target <= runningWidth;
    let leftGap = target - prevWidth;
    let rightGap = runningWidth - target;

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
  let row = container.querySelector('.gallery-row');
  if (row) {
    let rowGap = parseFloat(getComputedStyle(row).gap);
    if (Number.isFinite(rowGap)) {
      return rowGap;
    }
  }

  let styles = getComputedStyle(container);
  let gapValue = styles.getPropertyValue('--gallery-gap');
  let gap = parseFloat(gapValue);
  return Number.isFinite(gap) ? gap : DEFAULT_GAP_PX;
}

/**
 * Нормализует параметры галереи, заполняет значения по умолчанию.
 * @param {{
 *   rows?: number,
 *   autoRows?: boolean,
 *   itemsPerPage?: number,
 *   skeletonRatio?: number,
 *   gap?: number,
 * }} [options]
 * @returns {{
 *   rows: (number|null),
 *   autoRows: boolean,
 *   itemsPerPage: (number|null),
 *   skeletonRatio: number,
 *   gap: (number|null),
 * }}
 */
function normalizeOptions(options) {
  let normalized = {
    rows: null,
    autoRows: false,
    itemsPerPage: null,
    skeletonRatio: 4 / 3,
    gap: null,
  };

  if (options) {
    if (Number.isFinite(options.rows)) {
      normalized.rows = options.rows;
    }
    if (typeof options.autoRows === 'boolean') {
      normalized.autoRows = options.autoRows;
    }
    if (Number.isFinite(options.itemsPerPage) && options.itemsPerPage > 0) {
      normalized.itemsPerPage = options.itemsPerPage;
    }
    if (Number.isFinite(options.skeletonRatio) && options.skeletonRatio > 0) {
      normalized.skeletonRatio = options.skeletonRatio;
    }
    if (Number.isFinite(options.gap)) {
      normalized.gap = options.gap;
    }
  }

  if (!normalized.itemsPerPage) {
    normalized.autoRows = false;
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
  let merged = {};
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
 * @param {{skeletonRatio: number}} options
 * @returns {Array<{itemEl: Element, imgEl: HTMLImageElement, width: number, height: number}>}
 */
function buildItemList(container, options) {
  return Array.prototype.slice.call(container.querySelectorAll('.gallery-item')).map(function (itemEl) {
    let imgEl = itemEl.querySelector('img');
    let width = parseInt(imgEl.dataset.width, 10) || imgEl.naturalWidth;
    let height = parseInt(imgEl.dataset.height, 10) || imgEl.naturalHeight;
    if (!Number.isFinite(width) || width <= 0) {
      width = ESTIMATE_ROW_HEIGHT * options.skeletonRatio;
    }
    if (!Number.isFinite(height) || height <= 0) {
      height = ESTIMATE_ROW_HEIGHT;
    }
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
 *   autoRows: boolean,
 *   itemsPerPage: (number|null),
 *   skeletonRatio: number,
 *   gap: (number|null),
 * }} options
 */
function layoutGallery(container, options) {
  let items = buildItemList(container, options);
  let total = items.length;
  if (!total) {
    return;
  }

  let rowsNumber = Number.isFinite(options.rows) ? options.rows : null;
  if (options.autoRows && Number.isFinite(options.itemsPerPage) && Number.isFinite(rowsNumber) && rowsNumber > 0) {
    let itemsPerRow = Math.ceil(options.itemsPerPage / rowsNumber);
    rowsNumber = Math.max(1, Math.ceil(total / itemsPerRow));
  }
  if (!Number.isFinite(rowsNumber) || rowsNumber <= 0) {
    rowsNumber = Math.ceil(total / AUTO_ROWS_DIVISOR);
  }

  let containerWidth = container.clientWidth;

  // Основной расчет: приводим все изображения к высоте 100px для оценки ширин.
  if (Number.isFinite(options.gap)) {
    container.style.setProperty('--gallery-gap', options.gap + 'px');
  }
  let gap = Number.isFinite(options.gap) ? options.gap : readGap(container);
  let prepared = scaleToHeight(items, ESTIMATE_ROW_HEIGHT);
  let rows = splitIntoRows(prepared, rowsNumber);

  let fragment = document.createDocumentFragment();
  rows.forEach(function (row) {
    let rowEl = document.createElement('div');
    rowEl.className = 'gallery-row';

    // Доступная ширина под элементы строки с учетом промежутков.
    let availableWidth = Math.max(containerWidth - gap * (row.length - 1), MIN_AVAILABLE_WIDTH_PX);
    let sizedRow;
    // Масштабируем строку так, чтобы занять всю ширину.
    let rowWidth = sumWidths(row);
    let scaleFactor = availableWidth / rowWidth;
    sizedRow = scaleByFactor(row, scaleFactor);

    sizedRow.forEach(function (item) {
      item.itemEl.style.width = item.width + 'px';
      item.itemEl.style.height = item.height + 'px';
      rowEl.appendChild(item.itemEl);
    });

    fragment.appendChild(rowEl);
  });

  // Полная перерисовка DOM-узлов строки.
  container.innerHTML = '';
  container.appendChild(fragment);
}

/**
 * Класс галереи с хранимыми опциями и динамическим обновлением.
 */
class FullframeGallery {
  /**
   * @param {Element} container
   * @param {Array<{id: (string|number), src: string, width?: number, height?: number, title?: string, alt?: string}>} items
   * @param {{
   *   rows?: number,
   *   autoRows?: boolean,
   *   itemsPerPage?: number,
   *   skeletonRatio?: number,
   *   gap?: number,
   * }} [options]
   */
  constructor(container, items, options) {
    this.container = container;
    this.items = Array.isArray(items) ? items : [];
    this.options = normalizeOptions(options);
    this._queued = false;
    this._resizeBound = false;
    this._handleResize = this._scheduleLayout.bind(this);

    if (this.container) {
      this._renderItems();
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
    this._renderItems();
    this.layout();
  }

  /**
   * Обновляет список изображений и пересчитывает галерею.
   * @param {Array<{id: (string|number), src: string, width?: number, height?: number, title?: string, alt?: string}>} items
   */
  setItems(items) {
    this.items = Array.isArray(items) ? items : [];
    this._renderItems();
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
      window.removeEventListener('resize', this._handleResize);
      this._resizeBound = false;
    }
  }

  /**
   * Подписывает на загрузку изображений, чтобы перестраивать раскладку.
   */
  _bindImageListeners() {
    let images = this.container.querySelectorAll('img');
    let self = this;
    images.forEach(function (img) {
      let itemEl = img.closest('.gallery-item');
      if (itemEl && !img.complete) {
        itemEl.classList.add('gallery-item_loading');
      }
      if (!img.__ffg_bound) {
        img.addEventListener(
          'load',
          function () {
            if (itemEl) {
              itemEl.classList.remove('gallery-item_loading');
            }
            if (!img.dataset.width) {
              img.dataset.width = String(img.naturalWidth || '');
            }
            if (!img.dataset.height) {
              img.dataset.height = String(img.naturalHeight || '');
            }
            self._handleResize();
          },
          { once: true },
        );
        img.__ffg_bound = true;
      }
    });
  }

  /**
   * Рендерит DOM-структуру галереи из массива элементов.
   */
  _renderItems() {
    if (!this.container) {
      return;
    }

    if (!this.container.classList.contains('gallery')) {
      this.container.classList.add('gallery');
    }

    let fragment = document.createDocumentFragment();
    let visibleItems = this._getVisibleItems();
    visibleItems.forEach(function (item) {
      let wrapper = document.createElement('div');
      wrapper.className = 'gallery-item';
      wrapper.dataset.id = String(item.id);

      let img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || item.title || '';
      img.loading = 'lazy';

      if (Number.isFinite(item.width) && Number.isFinite(item.height)) {
        img.dataset.width = String(item.width);
        img.dataset.height = String(item.height);
      } else {
        wrapper.classList.add('gallery-item_loading');
      }

      wrapper.appendChild(img);
      fragment.appendChild(wrapper);
    });

    this.container.innerHTML = '';
    this.container.appendChild(fragment);
  }

  /**
   * Возвращает список элементов, учитывая itemsPerPage.
   * @returns {Array<{id: (string|number), src: string, width?: number, height?: number, title?: string, alt?: string}>}
   */
  _getVisibleItems() {
    if (this.options.itemsPerPage) {
      return this.items.slice(0, this.options.itemsPerPage);
    }
    return this.items.slice();
  }

  /**
   * Привязывает обработчик изменения размеров окна.
   */
  _bindResize() {
    if (!this._resizeBound) {
      window.addEventListener('resize', this._handleResize);
      this._resizeBound = true;
    }
  }

  /**
   * Троттлинг через rAF, чтобы не пересчитывать слишком часто.
   */
  _scheduleLayout() {
    let self = this;
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

export default FullframeGallery;
