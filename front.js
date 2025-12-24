!(function () {
  'use strict';
  function x(e, t, o, i, s) {
    var n = Math.abs(Math.cos(s)),
      a = Math.abs(Math.sin(s));
    return {
      cx: e + (o / 2) * Math.cos(s) - (i / 2) * Math.sin(s),
      cy: t + (o / 2) * Math.sin(s) + (i / 2) * Math.cos(s),
      width: o * n + i * a,
      height: o * a + i * n,
    };
  }
  angular
    .module('imgEditor.directives', [])
    .directive('imgData', [
      function () {
        return {
          restrict: 'A',
          link: function (t, o, e) {
            var i = t.$eval(e.imgData),
              s = new FileReader();
            (s.onload = function () {
              t.$apply(function () {
                var e = new Image();
                (e.onload = function () {
                  o.attr('src', e.src);
                }),
                  (e.src = s.result),
                  t.$broadcast('loadedImg', e, e.src);
              });
            }),
              s.readAsDataURL(i);
          },
        };
      },
    ])
    .directive('imgDataFromUri', function () {
      return {
        restrict: 'A',
        link: function (v, b, e) {
          var y = document.createElement('canvas'),
            w = y.getContext('2d'),
            $ = new Image();
          ($.onload = function () {
            var e = (y.width = $.width),
              t = (y.height = $.height);
            w.drawImage($, 0, 0);
            var o = y.toDataURL('image/jpeg', 1),
              i = new Image();
            i.src = o;
            var s = v.model.crop(v);
            if (s && 0 < s.length) {
              var n = new Image();
              n.src = o;
              var a = s;
              (a.w = a.x2 - a.x), (a.h = a.y2 - a.y), (e = y.width), (t = y.height);
              var r = document.createElement('canvas'),
                l = r.getContext('2d'),
                c = document.createElement('canvas'),
                d = c.getContext('2d'),
                u = x(a.x, a.y, a.w, a.h, 0);
              (r.width = c.width = u.width),
                (r.height = c.height = u.height),
                l.drawImage(n, u.cx - u.width / 2, u.cy - u.height / 2, u.width, u.height, 0, 0, u.width, u.height),
                d.translate(parseInt(r.width / 2), parseInt(r.height / 2)),
                d.drawImage(r, parseInt(-r.width / 2), parseInt(-r.height / 2));
              var p = u.width / 2 - a.w / 2,
                h = u.height / 2 - a.h / 2;
              (y.width = a.w),
                (y.height = a.h),
                (e = y.width),
                (t = y.height),
                w.drawImage(c, -p, -h),
                (n = r = c = l = d = h = p = null),
                (o = y.toDataURL('image/jpeg', 1));
            }
            if (v.model.rotation(v)) {
              for (var m = v.model.rotation(v); m < 0; ) m += 360;
              var f = (m / 90) % 4,
                _ = new Image();
              _.src = o;
              for (var g = 0; g < f; g++)
                (y.width = t),
                  (y.height = e),
                  (e = y.width),
                  (t = y.height),
                  w.save(),
                  w.translate(e, t / e),
                  w.rotate(Math.PI / 2),
                  w.drawImage(_, 0, 0),
                  w.restore(),
                  (_.src = y.toDataURL('image/jpeg', 1));
              (_ = null), (o = y.toDataURL('image/jpeg', 1));
            }
            v.$broadcast('loadedImg', i, o), b.attr('src', o);
          }),
            ($.crossOrigin = ''),
            e.$observe('imgDataFromUri', function (e) {
              $.src = e;
            });
        },
      };
    })
    .directive('imgThumb', [
      function () {
        return {
          restrict: 'A',
          link: function (e, i, t) {
            e.$on('loadedImg', function (e, t, o) {
              i.attr('src', o);
            }),
              e.$on('update', function (e, t) {
                i.attr('src', t);
              });
          },
        };
      },
    ])
    .directive('imgEditable', [
      '$parse',
      function (o) {
        return {
          restrict: 'A',
          link: function (p, h, e) {
            var i,
              s,
              d = new Image(),
              n = new Image();
            function t(r) {
              var l,
                e,
                c = new Image();
              (c.onload = function () {
                var t,
                  o,
                  i,
                  s = !1,
                  n = document.createElement('canvas'),
                  a = n.getContext('2d');
                (n.width = c.width),
                  (n.height = c.height),
                  (o = n.width),
                  (i = n.height),
                  a.drawImage(c, 0, 0, c.width, c.height),
                  s ||
                    ((s = !0),
                    ((t = new Image()).src = n.toDataURL('image/jpeg', 1)),
                    (t.onload = function () {
                      if (
                        ((n.width = i),
                        (n.height = o),
                        (o = n.width),
                        (i = n.height),
                        a.clearRect(0, 0, n.width, n.height),
                        a.save(),
                        a.translate(o / 2, i / 2),
                        'right' == r)
                      )
                        var e = 90;
                      else if ('left' == r) e = -90;
                      a.rotate((e * Math.PI) / 180),
                        a.drawImage(t, -t.width / 2, -t.height / 2),
                        a.restore(),
                        (t = null),
                        (s = !1),
                        h.attr('src', n.toDataURL('image/jpeg', 1)),
                        p.$broadcast('update', n.toDataURL('image/jpeg', 1)),
                        (n = null);
                    }));
              }),
                (c.src = h.attr('src')),
                (l = r),
                ((e = new Image()).onload = function () {
                  var o,
                    i,
                    s,
                    n = !1,
                    a = document.createElement('canvas'),
                    r = a.getContext('2d');
                  (a.width = e.width),
                    (a.height = e.height),
                    (i = a.width),
                    (s = a.height),
                    r.drawImage(e, 0, 0, e.width, e.height),
                    n ||
                      ((n = !0),
                      ((o = new Image()).src = a.toDataURL('image/jpeg', 1)),
                      (o.onload = function () {
                        if (
                          ((a.width = s),
                          (a.height = i),
                          (i = a.width),
                          (s = a.height),
                          r.save(),
                          r.translate(i / 2, s / 2),
                          'right' == l)
                        )
                          var e = 90;
                        else if ('left' == l) var e = -90;
                        r.rotate((e * Math.PI) / 180),
                          r.drawImage(o, -o.width / 2, -o.height / 2),
                          r.restore(),
                          (o = null),
                          (n = !1);
                        var t = a.toDataURL('image/jpeg', 1);
                        (a = null), (d.src = t);
                      }));
                }),
                (e.src = d.src);
            }
            function a(e, t, o, i, s) {
              if (0 === s)
                return {
                  x: e,
                  y: t,
                };
              if (180 === Math.abs(s))
                return {
                  x: o - e,
                  y: i - t,
                };
              var n = (s * Math.PI) / 180,
                a = e - o / 2,
                r = t - i / 2,
                l = i / 2,
                c = o / 2;
              return {
                x: parseInt(Math.cos(n) * a - Math.sin(n) * r + l),
                y: parseInt(Math.sin(n) * a + Math.cos(n) * r + c),
              };
            }
            (p.model = {}),
              (p.model.crop = o(e.crop)),
              (p.model.rotation = o(e.rotation)),
              (p.model.trueSize = o(e.trueSize)),
              (p.model.base64 = o(e.base64)),
              p.$on('loadedImg', function (e, t, o) {
                p.model.base64.assign(p, o);
              }),
              p.$on('update', function (e, t) {
                p.model.base64.assign(p, t);
              }),
              p.crop || (p.crop = !1),
              p.rotation || (p.rotation = 0),
              h.attr('src') && 1 < h.attr('src').length && (d.src = h.attr('src')),
              p.$on('loadedImg', function (e, t, o) {
                (d.src = o), (n.src = t.src);
              }),
              p.$on('crop', function () {
                if (((p.cropping = !0), ((s = new Image()).src = h.attr('src')), h.attr('src', d.src), p.crop)) {
                  var e = a(p.crop.x, p.crop.y, n.width, n.height, p.rotation),
                    t = a(p.crop.x2, p.crop.y2, n.width, n.height, p.rotation),
                    o = [e.x, e.y, t.x, t.y];
                  $(h).Jcrop(
                    {
                      trueSize: [d.width, d.height],
                      setSelect: o,
                    },
                    function () {
                      i = this;
                    },
                  );
                } else
                  $(h).Jcrop(
                    {
                      trueSize: [d.width, d.height],
                    },
                    function () {
                      i = this;
                    },
                  );
              }),
              p.$on('reset', function () {
                (p.crop = !1),
                  (p.rotation = 0),
                  (s = null),
                  h.attr('src', n.src),
                  (d.src = n.src),
                  p.$broadcast('update', n.src);
              }),
              p.$on('save', function () {
                if (p.cropping) {
                  (s = null), (p.cropping = !1);
                  var e = i.tellSelect(),
                    t = a(e.x, e.y, d.width, d.height, -p.rotation),
                    o = a(e.x2, e.y2, d.width, d.height, -p.rotation);
                  (p.crop = {
                    x: t.x,
                    y: t.y,
                    x2: o.x,
                    y2: o.y,
                  }),
                    p.model.crop.assign(p, p.crop),
                    $(h).css('width', ''),
                    $(h).css('height', ''),
                    i.destroy(),
                    (function (e) {
                      var t = new Image();
                      t.src = h.attr('src');
                      var o = document.createElement('canvas'),
                        i = o.getContext('2d'),
                        s = e,
                        n = (o.width, o.height, document.createElement('canvas')),
                        a = n.getContext('2d'),
                        r = document.createElement('canvas'),
                        l = r.getContext('2d'),
                        c = x(s.x, s.y, s.w, s.h, 0);
                      (n.width = r.width = c.width),
                        (n.height = r.height = c.height),
                        a.drawImage(
                          t,
                          c.cx - c.width / 2,
                          c.cy - c.height / 2,
                          c.width,
                          c.height,
                          0,
                          0,
                          c.width,
                          c.height,
                        ),
                        l.translate(parseInt(n.width / 2), parseInt(n.height / 2)),
                        l.drawImage(n, parseInt(-n.width / 2), parseInt(-n.height / 2));
                      var d = c.width / 2 - s.w / 2,
                        u = c.height / 2 - s.h / 2;
                      (o.width = s.w),
                        (o.height = s.h),
                        o.width,
                        o.height,
                        i.drawImage(r, -d, -u),
                        h.attr('src', o.toDataURL('image/jpeg', 1)),
                        p.$broadcast('update', o.toDataURL('image/jpeg', 1)),
                        (t = o = i = s = a = l = n = r = c = d = u = null);
                    })(e);
                }
              }),
              p.$on('cancel', function () {
                p.cropping &&
                  ((p.cropping = !1),
                  h.attr('src', s.src),
                  $(h).css('width', ''),
                  $(h).css('height', ''),
                  (s = null),
                  i.destroy());
              }),
              p.$on('rotate_right', function () {
                (p.rotation = (p.rotation - 90) % 360), p.model.rotation.assign(p, p.rotation), t('right');
              }),
              p.$on('rotate_left', function () {
                (p.rotation = (p.rotation + 90) % 360), p.model.rotation.assign(p, p.rotation), t('left');
              });
          },
        };
      },
    ]);
})();
var photoApp = angular.module('photoApp', [
  'angucomplete-alt',
  'angularFileUpload',
  'imgEditor.directives',
  'monospaced.elastic',
  'ngCookies',
  'ngPromiseExtras',
  'ui.sortable',
  'vsdropdown',
]);
photoApp.constant('restUrls', {
  facets: '/search/facets/',
  expublish: '/exhibitions/publish/',
  removephotos: '/rest/front/my-photos/remove/',
  moderate: '/rest/front/my-photos/send-to-moderation/',
  exhibedit: '/rest/front/exhibitions-edit/',
  cartlist: '/rest/front/exhibitions-cart/list/',
  cartcount: '/rest/front/exhibitions-cart/count/',
  cartclear: '/rest/front/exhibitions-cart/clear/',
  cartremove: '/rest/front/exhibitions-cart/remove/',
  photos: '/rest/front/my-photos/',
  authors: '/rest/front/authors/',
  sources: '/rest/front/sources/',
  periods: '/rest/front/periods/',
  regions: '/rest/front/regions/',
  regionSuggest: '/rest/front/regions-suggest/',
  tagslist: '/rest/front/tags/',
  tagstree: '/rest/front/tags_tree/?with_tag=1',
  tagsnodes: '/rest/front/tags_tree_nodes/',
  tagcreateorget: '/rest/front/tag_get_or_create/',
  d_n_d_create: '/rest/front/d_and_d_create/',
}),
  photoApp.config([
    '$locationProvider',
    function (e) {
      var t = Boolean(window.history && history.pushState);
      e.html5Mode({
        enabled: t,
        requireBase: !1,
      });
    },
  ]),
  photoApp.run([
    '$http',
    '$cookies',
    function (e, t) {
      (e.defaults.headers.post = {
        'X-CSRFToken': t.get('csrftoken'),
      }),
        (e.defaults.headers.put = {
          'X-CSRFToken': t.get('csrftoken'),
        }),
        (e.defaults.headers.patch = {
          'X-CSRFToken': t.get('csrftoken'),
        }),
        (e.defaults.headers.delete = {
          'X-CSRFToken': t.get('csrftoken'),
        });
    },
  ]),
  photoApp.directive('chosen', [
    '$timeout',
    function () {
      return {
        require: 'ngModel',
        link: function (e, t, o) {
          var i = o.ngModel;
          null !== i &&
            e.$watch(i, function () {
              t.trigger('chosen:updated');
            }),
            t.chosen({
              width: '230px',
              search_contains: !0,
              no_results_text: 'Не найдены данные по запросу',
            });
        },
      };
    },
  ]),
  photoApp.directive('keyboardtags', function () {
    return {
      link: function (i) {
        angular.element(document).on('keydown', function (e) {
          var t = $(e.target).prop('tagName'),
            o = 'INPUT' === t || 'TEXTAREA' === t;
          40 !== e.which || !i.tags || e.altKey || e.ctrlKey || (e.preventDefault(), i.moveDown(), i.$apply()),
            38 !== e.which || !i.tags || e.altKey || e.ctrlKey || (e.preventDefault(), i.moveTop(), i.$apply()),
            37 !== e.which || !i.tags || e.altKey || e.ctrlKey || o || (e.preventDefault(), i.moveLeft(), i.$apply()),
            39 !== e.which || !i.tags || e.altKey || e.ctrlKey || o || (e.preventDefault(), i.moveRight(), i.$apply()),
            13 === e.which && i.tags && (e.preventDefault(), i.onEnterKey(), i.$apply());
        });
      },
    };
  }),
  photoApp.directive('timeline', function () {
    return {
      link: function (i, e) {
        var s,
          t = $(e).find('.b-timeline__slider'),
          n = 1840,
          a = !1,
          r = !1,
          o = $.trim($('#b-top__year-from').val()),
          l = $.trim($('#b-top__year-to').val());
        o || (o = n),
          l || (l = 1999),
          t.noUiSlider({
            start: [o, l],
            step: 1,
            connect: !0,
            range: {
              min: [1840],
              max: [1999],
            },
          }),
          t
            .Link('lower')
            .to(
              '-inline-<div class="b-timeline__year"><div class="b-timeline__dot"></div><div class="b-timeline__bg"></div><div class="b-timeline__year-text"></div></div>',
              function (e) {
                var t = parseInt(e, 10);
                (i.facetsdata.year_from = t),
                  $('#b-top__year-from').val(t),
                  $(this).find('.b-timeline__year-text').text(t),
                  a
                    ? ((s = $.now()),
                      setTimeout(function () {
                        $.now() - s < 500 ||
                          ($('.b-top').trigger('searchform', {
                            type: 'timeline',
                          }),
                          i.getFacets());
                      }, 500))
                    : (a = !0);
                var o = (100 * (e - n)) / 159;
                $('.b-timeline__slider-years-range').css('left', o + '%');
              },
            ),
          t
            .Link('upper')
            .to(
              '-inline-<div class="b-timeline__year"><div class="b-timeline__dot"></div><div class="b-timeline__bg"></div><div class="b-timeline__year-text"></div></div>',
              function (e) {
                var t = parseInt(e, 10);
                (i.facetsdata.year_to = t),
                  $('#b-top__year-to').val(t),
                  $(this).find('.b-timeline__year-text').text(t),
                  r
                    ? ((s = $.now()),
                      setTimeout(function () {
                        $.now() - s < 500 ||
                          ($('.b-top').trigger('searchform', {
                            type: 'timeline',
                          }),
                          i.getFacets());
                      }, 500))
                    : (r = !0);
                var o = 100 - (100 * (e - n)) / 159;
                $('.b-timeline__slider-years-range').css('right', o + '%');
              },
            );
      },
    };
  }),
  photoApp.directive('datetimepicker', function () {
    return {
      require: 'ngModel',
      link: function (o, m, e, f) {
        var i = $(m),
          t = $(m).parent().find('.b-default-form__calendar-icon');
        (initDateWidget = function () {
          var e = i.val();
          $(m).datetimepicker({
            lang: 'ru',
            timepicker: !1,
            scrollInput: !1,
            defaultSelect: !1,
            value: '',
            format: 'Y-m-d',
            formatDate: 'Y-m-d',
            startDate: e || '1950-01-01',
            validateOnBlur: !1,
            yearStart: 1840,
            yearEnd: 1999,
            onSelectDate: function (e) {
              var t = e.dateFormat('Y-m-d');
              $(m).datetimepicker('hide'), i.val(t), o.$apply();
            },
            onClose: function (e, t) {
              var o = t.val(),
                i = t.hasClass('upload-photos__input-text-date-to');
              if (o) {
                var s,
                  n,
                  a,
                  r,
                  l = [(o = o.replace(/[^0-9]/g, '')).substr(0, 4), o.substr(4, 2), o.substr(6, 2)];
                if (
                  (1 === (l = l.filter(Boolean)).length &&
                    (n = l[0].match(/^\d{4}$/)) &&
                    ((s = n[0] + '-' + (i ? '12' : '01') + '-' + (i ? '31' : '01')), t.val(s), f.$setViewValue(s)),
                  2 === l.length &&
                    ((n = l[0].match(/^\d{4}$/)),
                    (a = l[1].match(/^\d{2}$/)),
                    n && a && ((s = n[0] + '-' + a[0] + '-' + (i ? '31' : '01')), t.val(s), f.$setViewValue(s))),
                  3 === l.length &&
                    ((n = l[0].match(/^\d{4}$/)),
                    (a = l[1].match(/^\d{2}$/)),
                    (r = l[2].match(/^\d{2}$/)),
                    n && a && r))
                ) {
                  var c = $(m).closest('.upload-photos__form-row').find('.upload-photos__input-text-date-to'),
                    d = $(m).controller('ngModel'),
                    u = n[0] + '-' + a[0] + '-' + r[0];
                  if (($(m).val(u), d.$setViewValue(u), 0 < c.length && '' === c.val())) {
                    var p = c.controller('ngModel');
                    if ('01' !== a[0] && '01' !== r[0]) c.val(u), p.$setViewValue(u);
                    else {
                      var h = n + '-12-31';
                      c.val(h), p.$setViewValue(h);
                    }
                  }
                }
              }
            },
          });
        }),
          o.$watch(e.ngModel, initDateWidget, !0),
          t.on('click', function () {
            $(m).datetimepicker('show');
          });
      },
    };
  }),
  photoApp.directive('chosenauthor', function () {
    return {
      require: 'ngModel',
      link: function (e, t, o) {
        var i = o.ngModel;
        null !== i &&
          e.$watch(i, function () {
            t.trigger('chosen:updated');
          }),
          t.chosen({
            width: '350px',
            search_contains: !0,
            no_results_text: 'Не найдены авторы по запросу',
          });
      },
    };
  }),
  photoApp.directive('chosensources', function () {
    return {
      require: 'ngModel',
      link: function (e, t, o) {
        var i = o.ngModel;
        null !== i &&
          e.$watch(i, function () {
            t.trigger('chosen:updated');
          }),
          t.chosen({
            width: '350px',
            search_contains: !0,
            no_results_text: 'Не найдены источники по запросу',
          });
      },
    };
  }),
  photoApp.directive('chosengeo', function () {
    return {
      require: 'ngModel',
      link: function (e, t, o) {
        var i = o.ngModel;
        null !== i &&
          e.$watch(i, function () {
            t.trigger('chosen:updated');
          }),
          t.chosen({
            width: '100%',
            search_contains: !0,
            no_results_text: 'Не найдены данные по запросу',
          });
      },
    };
  }),
  photoApp.directive('ngReallyClick', [
    function () {
      return {
        restrict: 'A',
        link: function (t, e, o) {
          e.bind('click', function () {
            var e = o.ngReallyMessage;
            e && confirm(e) && t.$apply(o.ngReallyClick);
          });
        },
      };
    },
  ]),
  photoApp.directive('pluralize', [
    function () {
      return {
        link: function (i, s, n) {
          i.$watch(
            n.num,
            function (e) {
              var t;
              'object' == typeof e && (t = e.length), 'number' == typeof e && (t = e);
              var o = i.$eval(n.texts)[4 < t % 100 && t % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][t % 10 < 5 ? t % 10 : 5]];
              s.text(o);
            },
            !0,
          );
        },
      };
    },
  ]),
  photoApp.directive('ngThumb', [
    '$window',
    function (t) {
      var r = Boolean(t.FileReader && t.CanvasRenderingContext2D),
        l = function (e) {
          return angular.isObject(e) && e instanceof t.File;
        },
        c = function (e) {
          var t = '|' + e.type.slice(e.type.lastIndexOf('/') + 1) + '|';
          return -1 !== '|jpg|png|jpeg|bmp|gif|'.indexOf(t);
        };
      return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (o, e, t) {
          if (r) {
            var i = o.$eval(t.ngThumb);
            if (l(i.file) && c(i.file)) {
              var s = e.find('canvas'),
                n = new FileReader();
              (n.onload = function (e) {
                var t = (o.img = new Image());
                (t.onload = a), (t.src = e.target.result);
              }),
                n.readAsDataURL(i.file);
            }
          }
          function a() {
            var e = i.width || (this.width / this.height) * i.height,
              t = i.height || (this.height / this.width) * i.width;
            s.attr({
              width: e,
              height: t,
            }),
              s[0].getContext('2d').drawImage(this, 0, 0, e, t);
          }
        },
      };
    },
  ]),
  photoApp.directive('ngThumbCover', [
    '$window',
    function (t) {
      var l = Boolean(t.FileReader && t.CanvasRenderingContext2D),
        c = function (e) {
          return angular.isObject(e) && e instanceof t.File;
        },
        d = function (e) {
          var t = '|' + e.type.slice(e.type.lastIndexOf('/') + 1) + '|';
          return -1 !== '|jpg|png|jpeg|bmp|gif|'.indexOf(t);
        };
      return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (n, t, a) {
          var r = t.width();
          n.$watch('coverFile', function () {
            if (l) {
              var o = n.$eval(a.ngThumbCover);
              if (c(o.file) && d(o.file)) {
                var i = t.find('canvas'),
                  e = new FileReader();
                (e.onload = function (e) {
                  var t = (n.img = new Image());
                  (t.onload = s), (t.src = e.target.result);
                }),
                  e.readAsDataURL(o.file);
              }
            }
            function s() {
              var e = r || (this.width / this.height) * o.height,
                t = o.height || (this.height / this.width) * r;
              i.attr({
                width: e,
                height: t,
              }),
                i[0].getContext('2d').drawImage(this, 0, 0, e, t);
            }
          });
        },
      };
    },
  ]),
  photoApp.controller('CartPhotoCtrl', [
    '$scope',
    '$http',
    'restUrls',
    '$timeout',
    '$window',
    '$cookies',
    '$q',
    function (n, i, e, t, o, s) {
      (n.CartlistURL = e.cartlist),
        (n.CartcountURL = e.cartcount),
        (n.clearRemoveURL = e.cartremove),
        (n.clearCartURL = e.cartclear),
        (n.exhibwizardURL = e.exhibwizard),
        (n.getParams = {
          page: 1,
        }),
        (n.photosForExhibition = []),
        (n.photos = []),
        (n.allPhotoIdies = []),
        (n.hasNext = !1),
        (n.loading = !1);
      try {
        n.CheckedPhotos = JSON.parse(s.get('cartphotos'));
      } catch (e) {
        n.CheckedPhotos = [];
      }
      (n.getCartPhotos = function () {
        i({
          method: 'get',
          params: n.getParams,
          url: n.CartlistURL,
        }).then(
          function (e) {
            var t = e.data,
              o = t.data;
            if (((n.photosCount = o.length), 0 < o.length)) {
              for (var i = 0, s = o.length; i < s; i++) n.photos.push(o[i]), n.allPhotoIdies.push(o[i].id);
              0 < n.CheckedPhotos.length
                ? (n.photosForExhibition = n.CheckedPhotos)
                : (n.photosForExhibition = n.allPhotoIdies);
            } else angular.element('.cart-photo__items .cart-photo__empty').html('Список избранных фотографий пуст.');
            n.gallery(), (n.hasNext = t.has_next), (n.loading = !1);
          },
          function () {
            angular.element('.cart-photo__items').html('Произошла ошибка при получении избранных фотографий.'),
              (n.loading = !1);
          },
        );
      }),
        n.getCartPhotos(),
        (n.gallery = function () {
          var e = angular.element('.cart-photo__items');
          t(function () {
            justifyImages(e);
          }, 0);
        }),
        angular.element(o).on('resize', function () {
          n.gallery();
        }),
        (n.checkPhoto = function (e) {
          var t = n.CheckedPhotos.indexOf(e.id);
          (e.checked = !e.checked),
            -1 === t ? n.CheckedPhotos.push(e.id) : n.CheckedPhotos.splice(t, 1),
            n.CheckedPhotos.length < 1
              ? (n.photosForExhibition = n.allPhotoIdies)
              : (n.photosForExhibition = n.CheckedPhotos),
            s.put('cartphotos', JSON.stringify(n.CheckedPhotos), {
              path: '/',
            });
        }),
        (n.clearSelected = function () {
          for (var e = 0, t = n.CheckedPhotos.length; e < t; e++) {
            var o = n.CheckedPhotos[e];
            i({
              method: 'post',
              url: n.clearRemoveURL,
              data: {
                photo: o,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            }).success(function () {
              var e = n.CheckedPhotos.indexOf(o);
              n.CheckedPhotos.splice(e, 1),
                s.put('cartphotos', JSON.stringify(n.CheckedPhotos), {
                  path: '/',
                }),
                n.getCartPhotos();
            });
          }
        }),
        (n.clearCart = function () {
          i({
            method: 'post',
            url: n.clearCartURL,
          }).success(function () {
            for (var e in n.photos) n.photos.splice(e);
            n.getCartPhotos();
          }),
            s.remove('cartphotos', {
              path: '/',
            }),
            t(function () {
              window.location.reload();
            }, 0);
        }),
        angular.element(o).on('scroll touchend', function () {
          if (0 < n.photos.length) {
            var e = $('.b-body__content').height() - $(window).height() - $(window).scrollTop() < 5;
            !n.loading && e && n.hasNext && ((n.loading = !0), (n.getParams.page += 1), n.getCartPhotos());
          }
        });
    },
  ]),
  photoApp.controller('CreateExCtrl', [
    '$scope',
    '$http',
    'restUrls',
    '$window',
    '$document',
    '$timeout',
    '$cookies',
    '$q',
    '$sce',
    'FileUploader',
    function (a, r, e, t, o, l, i, c, d, s) {
      var n = t.location.href.match(/exhibitions\/edit\/(\d+)/)[1],
        u = o[0].createElement('input');
      (a.cartListURL = e.cartlist),
        (a.cartCountURL = e.cartcount),
        (a.exhibWizardURL = e.exhibedit),
        (a.publishURL = e.expublish),
        (a.instructionUrl = 'https://video.yandex.ru/iframe/yacinema/fv9ujgz96i.2020/?autoplay=1&hd=1'),
        (a.confirmMessage = 'После сохранения выставка будет заново отправлена на модерацию, продолжить?'),
        (a.exID = parseInt(n, 10)),
        (a.supportPlaceholder = void 0 !== u.placeholder),
        (a.showTitlePlaceholder = !0),
        (a.showDescPlaceholder = !0),
        (a.showPopup = !1),
        (a.photosIdies = []),
        (a.coverImage = {}),
        (a.previewUrl = ''),
        (a.checkedPhotos = []),
        (a.exhibition = {
          cover: void 0,
          name: void 0,
          text: void 0,
        }),
        (a.dataCartPhotos = {
          page: 1,
          hasNext: !1,
          photos: [],
        }),
        (a.photoCounter = {
          deleted: 0,
          added: 0,
          addedStr: '',
          deletedStr: '',
          timer: 3e3,
        });
      var p = null;
      a.setVideoFrameSrc = function (e) {
        angular.element('.create-exhibition__video-instruction-video-frame')[0].contentWindow.location.replace(e);
      };
      try {
        (a.instructionShowed = 'true' === i.get('instruction_showed')),
          (a.dontShow = a.instructionShowed),
          a.instructionShowed || a.setVideoFrameSrc(a.instructionUrl);
      } catch (e) {
        console.log(e);
      }
      (a.coverUploader = new s({
        headers: {
          'X-CSRFToken': i.get('csrftoken'),
        },
        alias: 'image',
        url: a.uploadURL,
        autoUpload: !1,
      })),
        (a.sortableOptions = {
          placeholder: 'create-exhibition__placeholder',
        }),
        (a.onTitlePlaceholderFocus = function () {
          a.showTitlePlaceholder = !1;
        }),
        (a.onDescPlaceholderFocus = function () {
          a.showDescPlaceholder = !1;
        }),
        (a.getCartPhotos = function () {
          var e = a.dataCartPhotos.page || 1;
          r({
            method: 'get',
            url: a.cartListURL + '?page=' + e,
          }).then(
            function (e) {
              var t = e.data.data,
                o = e.data.has_next,
                i = e.data.count;
              (a.dataCartPhotos.hasNext = o), (a.dataCartPhotos.count = i), (a.hasError = !1);
              for (var s = 0; s < t.length; s++) 1 === s && (t[s].name = ''), a.dataCartPhotos.photos.push(t[s]);
              (a.dataCartPhotos.countLeft = a.dataCartPhotos.count - a.dataCartPhotos.photos.length),
                (a.dataCartPhotos.countNext = 20 <= a.dataCartPhotos.countLeft ? 20 : a.dataCartPhotos.countLeft),
                o && a.dataCartPhotos.page++;
            },
            function () {
              (a.hasError = !0), (a.errorMessage = 'Произошла ошибка при получении избранных фотографий.');
            },
          );
        }),
        (a.getExhibitionData = function () {
          r({
            method: 'get',
            url: a.exhibWizardURL + a.exID + '/',
          }).then(
            function (e) {
              var t = $('.b-body').data('user-id');
              a.getCartPhotos();
              var o = e.data;
              (a.hasError = !1),
                (a.previewUrl = o.preview_url),
                (a.photosSelected = void 0),
                o.exhibition &&
                  (o.exhibition.cover &&
                    ((a.coverImage.url = o.exhibition.cover.image), (a.coverImage.id = o.exhibition.cover.id)),
                  3 == o.exhibition.status && (a.exhibition.published = !0),
                  1 == o.exhibition.status && (a.exhibition.isDraft = !0),
                  (a.exhibition.id = o.exhibition.id),
                  (a.exhibition.user_id = t),
                  (a.exhibition.name = o.exhibition.name),
                  (a.exhibition.text = o.exhibition.text),
                  (a.coverImageStyle = {
                    'background-image': 'url(' + a.exhibition.cover + ')',
                  })),
                l(function () {
                  (a.photosSelected = o.slides),
                    a.photosSelected.sort(function (e, t) {
                      return e.order > t.order ? 1 : e.order < t.order ? -1 : 0;
                    });
                }, 0);
            },
            function () {
              (a.hasError = !0), (a.errorMessage = 'Произошла ошибка при получении данных выставки.');
            },
          );
        }),
        a.getExhibitionData(),
        a.$watch('photosSelected', function (e) {
          if (e) {
            for (var t = [], o = 0; o < e.length; o++) e[o].photo && t.push(e[o].photo.id);
            a.photosIdies = t;
          }
        }),
        (a.makeCover = function (e) {
          var t = e.thumbnail.url,
            o = e.photo.id;
          a.coverImage = {
            url: t,
            id: o,
          };
        }),
        (a.editDesc = function (e, t) {
          for (var o = e.currentTarget, i = 0; i < a.photosSelected.length; i++) a.photosSelected[i].edit = !1;
          (t.edit = !0),
            l(function () {
              $(o).parent().find('textarea').focus();
            }, 50);
        }),
        (a.saveDesc = function (e) {
          e.edit = !1;
        }),
        (a.toggleCartPhotos = function (e) {
          e.stopPropagation(), (a.showPopup = !0 !== a.showPopup);
        }),
        (a.addPhotoToEx = function (e) {
          var t = a.photosIdies.indexOf(e.id);
          if (-1 < t) {
            for (var o = 0, i = a.photosSelected.length; o < i; o++)
              a.photosSelected[o] &&
                a.photosSelected[o].photo.id == a.photosIdies[t] &&
                (a.photosSelected.splice(o, 1), a.counter('deleted'));
            a.photosIdies.splice(t, 1);
          } else
            a.photosIdies.push(e.id),
              a.photosSelected.push({
                photo: e,
                thumbnail: e.thumbnail,
                order: a.photosSelected.length + 1,
              }),
              a.counter('added');
        }),
        (a.delPhoto = function (e) {
          var t = a.photos;
          (a.photos = void 0),
            a.photosIdies.splice(a.photosIdies.indexOf(e.photo.id), 1),
            a.photosSelected.splice(a.photosSelected.indexOf(e), 1),
            l(function () {
              a.photos = t;
            }, 0);
        }),
        (a.deleteAll = function () {
          (a.checkedPhotos = []), (a.photosSelected = []), (a.photosIdies = []);
        }),
        (a.counter = function (e) {
          switch (e) {
            case 'added':
              a.resetCounter('deleted'), a.photoCounter.added++, a.counterToStr(e, a.photoCounter.added);
              break;
            case 'deleted':
              a.resetCounter('added'), a.photoCounter.deleted++, a.counterToStr(e, a.photoCounter.deleted);
          }
          a.timerCounter();
        }),
        (a.counterToStr = function (e, t) {
          if ('added' === e)
            switch (String(t).substr(-1)) {
              case '1':
                a.photoCounter.quantityStr = 'Добавлена ' + t + ' фотография';
                break;
              case '2':
              case '3':
              case '4':
                a.photoCounter.quantityStr = 'Добавлено ' + t + ' фотографии';
                break;
              default:
                a.photoCounter.quantityStr = 'Добавлено ' + t + ' фотографий';
            }
          else
            switch (String(t).substr(-1)) {
              case '1':
                a.photoCounter.quantityStr = 'Удалена ' + t + ' фотография';
                break;
              case '2':
              case '3':
              case '4':
                a.photoCounter.quantityStr = 'Удалено ' + t + ' фотографии';
                break;
              default:
                a.photoCounter.quantityStr = 'Удалено ' + t + ' фотографий';
            }
        }),
        (a.resetCounter = function (e) {
          switch (e) {
            case 'added':
              a.photoCounter.added = 0;
              break;
            case 'deleted':
              a.photoCounter.deleted = 0;
              break;
            default:
              (a.photoCounter.added = 0), (a.photoCounter.deleted = 0);
          }
        }),
        (a.timerCounter = function () {
          l.cancel(p),
            (p = l(function () {
              a.resetCounter();
            }, a.photoCounter.timer));
        }),
        (a.hideVideo = function () {
          (a.instructionShowed = !0), a.setVideoFrameSrc('about:blank');
        }),
        (a.hideVideoWithCookie = function () {
          a.dontShow
            ? i.put('instruction_showed', !0, {
                path: '/',
              })
            : i.put('instruction_showed', !1, {
                path: '/',
              });
        }),
        (a.showInstruction = function () {
          (a.instructionShowed = !1), a.setVideoFrameSrc(a.instructionUrl);
        }),
        (a.previewExhibition = function (e) {
          if ((e.preventDefault(), a.photosSelected.length < 1))
            (a.previewTipMessage = 'Добавьте фотографии в выставку'),
              (a.showPreviewTip = !0),
              l(function () {
                a.showPreviewTip = !1;
              }, 1800);
          else {
            for (var t = [], o = 0; o < a.photosSelected.length; o++) {
              var i;
              if (((a.photosSelected[o].order = o), a.photosSelected[o].photo))
                (i = a.photosSelected[o].hasOwnProperty('id')
                  ? {
                      id: a.photosSelected[o].id,
                      photo: a.photosSelected[o].photo.id,
                      text: a.photosSelected[o].text,
                    }
                  : {
                      photo: a.photosSelected[o].photo.id,
                      text: a.photosSelected[o].text,
                    }),
                  t.push(i);
            }
            a.exhibition.cover = a.coverImage.id;
            var s = {
              exhibition: a.exhibition,
              slides: t,
            };
            (a.previewData = JSON.stringify(s)),
              setTimeout(function () {
                angular.element('.panel-bottom__preview-form')[0].submit();
              }, 50);
          }
        }),
        (a.publicExhibition = function () {
          if (a.photosSelected.length < 9)
            (a.hasError = !0), (a.errorMessage = d.trustAsHtml('Минимальное количество фотографий в выставке – 9'));
          else if ('' === a.exhibition.name.trim())
            (a.hasError = !0), (a.errorMessage = d.trustAsHtml('Придумайте название'));
          else if (a.coverImage.id) {
            a.saveExhibition(!0).then(function () {
              r({
                method: 'post',
                url: a.publishURL + a.exID + '/',
                headers: {
                  'Content-Type': 'application/json',
                },
              }).then(
                function () {
                  (a.showSuccessPublish = !0),
                    (a.publicTipMessage = 'Отправлено на модерацию'),
                    (a.hasError = !1),
                    l(function () {
                      a.showSuccessPublish = !1;
                    }, 1800);
                },
                function (e) {
                  var t = e.data;
                  (a.hasError = !0),
                    t.message
                      ? (a.errorMessage = d.trustAsHtml(t.message))
                      : (a.errorMessage = d.trustAsHtml(
                          'При публикации выставки произошла ошибка, код ошибки: ' + e.status,
                        ));
                },
              );
            });
          } else (a.hasError = !0), (a.errorMessage = d.trustAsHtml('Выберите обложку'));
        }),
        (a.saveExhibition = function (n) {
          if (a.photosSelected.length < 1)
            n ||
              ((a.showSuccessSave = !0),
              (a.saveTipMessage = 'Добавьте фотографии к выставке'),
              l(function () {
                a.showSuccessSave = !1;
              }, 1800));
          else if ('' === a.exhibition.name.trim())
            n ||
              ((a.showSuccessSave = !0),
              (a.saveTipMessage = 'Придумайте название'),
              l(function () {
                a.showSuccessSave = !1;
              }, 1800));
          else {
            if (!a.exhibition.isDraft && a.photosSelected.length < 9)
              return (
                (a.showSuccessSave = !0),
                (a.saveTipMessage = 'Минимальное количество фотографии выставке - 9'),
                void l(function () {
                  a.showSuccessSave = !1;
                }, 1800)
              );
            function e() {
              for (var e = [], i = c.defer(), t = 0; t < a.photosSelected.length; t++) {
                var o;
                if (((a.photosSelected[t].order = t), a.photosSelected[t].photo))
                  (o = a.photosSelected[t].hasOwnProperty('id')
                    ? {
                        id: a.photosSelected[t].id,
                        photo: a.photosSelected[t].photo.id,
                        text: a.photosSelected[t].text,
                      }
                    : {
                        photo: a.photosSelected[t].photo.id,
                        text: a.photosSelected[t].text,
                      }),
                    e.push(o);
              }
              a.exhibition.cover = a.coverImage.id;
              var s = {
                exhibition: a.exhibition,
                slides: e,
              };
              return (
                r({
                  method: 'post',
                  url: a.exhibWizardURL + a.exID + '/',
                  data: s,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }).then(
                  function (e) {
                    var t = e.data,
                      o = t.slides;
                    o.sort(function (e, t) {
                      return e.order > t.order ? 1 : e.order < t.order ? -1 : 0;
                    }),
                      0 < t.errors.exhibition.length
                        ? ((a.hasError = !0), (a.errorMessage = d.trustAsHtml('Придумайте название')))
                        : ((a.hasError = !1),
                          n ||
                            ((a.showSuccessSave = !0),
                            (a.saveTipMessage = 'Изменения сохранены'),
                            l(function () {
                              (a.photosSelected = o), (a.showSuccessSave = !1);
                            }, 1800))),
                      i.resolve('save exhibition');
                  },
                  function (e) {
                    var t = e.data;
                    (a.hasError = !0),
                      t.message
                        ? (a.errorMessage = d.trustAsHtml(t.message))
                        : (a.errorMessage = d.trustAsHtml(
                            'При сохранении произошла ошибка, cтатус ошибки: ' + e.status,
                          ));
                  },
                ),
                i.promise
              );
            }
            if (!a.exhibition.published) return e();
            if (confirm(a.confirmMessage)) return e();
          }
        }),
        o.on('click', function () {
          a.showPopup && ((a.showPopup = !1), a.$apply());
        });
    },
  ]),
  photoApp.controller('SearchCtrl', [
    '$scope',
    '$http',
    'restUrls',
    '$window',
    '$timeout',
    '$filter',
    '$sce',
    '$q',
    function (s, e, t, o, n, a, i, r) {
      var l = o.location.href.match(/sources\/(\d+)/),
        c = r.defer(),
        d = l ? l[1] : null;
      (s.facetsURL = t.facets),
        (s.regionURL = t.regionSuggest),
        (s.facetsdata = {}),
        (s.searchdata = {}),
        (s.extendMode = !1),
        (s.suggestData = {
          suggests: [],
          onLoad: !1,
          selectedItem: 0,
        }),
        (s.actualSuggest = '');
      var u = new URL(window.location.href),
        p = u.searchParams.get('query'),
        h = u.searchParams.getAll('author_ids').filter(Boolean)[0] || '',
        m = u.searchParams.getAll('source_ids').filter(Boolean)[0] || d || '';
      s.searchQuery = p;
      h && (s.facetsdata.author_ids = h),
        m && (s.facetsdata.source_ids = m),
        p && (s.facetsdata.query = p),
        (h || m) && ((s.extendMode = !0), angular.element('.b-top-search').removeClass('b-top-search_min_yes')),
        (s.searchdata.query = p),
        (s.author_id_default = h),
        (s.source_id_default = m),
        (s.searchdata.author_id = s.author_id_default),
        (s.searchdata.source_id = s.source_id_default),
        (s.clickExample = function () {
          (s.sourceOptions.selectedItems = []),
            (s.authorOptions.selectedItems = []),
            (s.facetsdata.author_ids = null),
            (s.facetsdata.source_ids = null),
            (s.searchdata.source_id = null),
            (s.searchdata.author_id = null),
            s.getFacets();
        }),
        (s.onSelectAuthor = function (e, t) {
          var o = 0 < e.length ? t.id : '';
          (s.searchdata.author_id = o),
            s.searchdata.source_id || (s.sourceOptions.selectedItems = []),
            s.changeAuthor();
        }),
        (s.onSelectSource = function (e, t) {
          var o = 0 < e.length ? t.id : '';
          (s.searchdata.source_id = o),
            s.searchdata.author_id || (s.authorOptions.selectedItems = []),
            s.changeSource();
        }),
        (s.authorPredicate = function (e) {
          for (
            var t = this.full_name.toLowerCase().split(/\s*\s\s*/), o = !1, i = t.length;
            i-- &&
            (o =
              -1 < e.last_name.toLowerCase().indexOf(t[i]) ||
              -1 < e.first_name.toLowerCase().indexOf(t[i]) ||
              -1 < e.middle_name.toLowerCase().indexOf(t[i]) ||
              -1 < e.aliases.toLowerCase().indexOf(t[i]));

          );
          return o;
        }),
        (s.authorSort = function (e) {
          var t = this.full_name.toLowerCase();
          return -1 < e.last_name.toLowerCase().indexOf(t) ? '0' + e.last_name : e.last_name;
        }),
        (s.sourcePredicate = function (e) {
          for (
            var t = this.name.toLowerCase().split(/\s*\s\s*/),
              o = e.name.toLowerCase().split(/\s*\s\s*/),
              i = !1,
              s = t.length;
            s-- &&
            (i = o.some(function (e) {
              return -1 < e.indexOf(t[s]);
            }));

          );
          return i;
        }),
        (s.sourceOptions = {
          items: [],
          selectedItems: [],
          input: {
            isObject: !0,
            visiblePropName: 'name',
          },
          filter: {
            enabled: !0,
            filterFunc: s.sourcePredicate,
            filterPlaceholderTxt: 'Источник',
            filterPlaceholderSearchTxt: 'Поиск',
            noHitsTxt: 'Нет совпадений',
          },
          selection: {
            maximum: 1,
            selectionsTxt: 'выбрано',
            showCount: !0,
          },
          visibleItemCount: 10,
          showTooltip: !1,
          fadeInEffects: !1,
          itemSelectCb: s.onSelectSource,
        }),
        (s.authorOptions = {
          items: [],
          selectedItems: [],
          input: {
            isObject: !0,
            visiblePropName: 'full_name',
          },
          filter: {
            enabled: !0,
            filterSort: s.authorSort,
            filterFunc: s.authorPredicate,
            filterPlaceholderTxt: 'Автор',
            filterPlaceholderSearchTxt: 'Поиск',
            noHitsTxt: 'Нет совпадений',
          },
          selection: {
            maximum: 1,
            selectionsTxt: 'выбрано',
            showCount: !0,
          },
          visibleItemCount: 10,
          showTooltip: !1,
          fadeInEffects: !1,
          itemSelectCb: s.onSelectAuthor,
        }),
        (s.getSourceFacets = function () {
          e({
            method: 'get',
            url: s.facetsURL,
            params: s.facetsdata,
          }).success(function (e) {
            (s.authors = e.authors),
              (s.sources = e.sources),
              (s.searchdata.author_id = void 0),
              (s.searchdata.source_id = void 0),
              (s.authorOptions.items = s.authors),
              (s.sourceOptions.items = s.sources),
              n(function () {
                (s.searchdata.author_id = s.facetsdata.author_ids ? s.facetsdata.author_ids : ''),
                  (s.searchdata.source_id = s.facetsdata.source_ids ? s.facetsdata.source_ids : '');
                var e = a('filter')(
                  s.sources,
                  {
                    id: parseInt(s.searchdata.source_id, 10),
                  },
                  !0,
                );
                0 < e.length && (s.sourceOptions.selectedItems = [e[0]]);
              }, 0);
          });
        }),
        (s.getAuthorFacets = function () {
          e({
            method: 'get',
            url: s.facetsURL,
            params: s.facetsdata,
          }).success(function (e) {
            (s.authors = e.authors),
              (s.sources = e.sources),
              (s.searchdata.author_id = void 0),
              (s.searchdata.source_id = void 0),
              (s.authorOptions.items = s.authors),
              (s.sourceOptions.items = s.sources),
              n(function () {
                (s.searchdata.author_id = s.facetsdata.author_ids ? s.facetsdata.author_ids : ''),
                  (s.searchdata.source_id = s.facetsdata.source_ids ? s.facetsdata.source_ids : '');
                var e = a('filter')(
                  s.authors,
                  {
                    id: parseInt(s.searchdata.author_id, 10),
                  },
                  !0,
                );
                0 < e.length && (s.authorOptions.selectedItems = [e[0]]);
              }, 0);
          });
        }),
        (s.getFacets = function () {
          s.extendMode &&
            e({
              method: 'get',
              url: s.facetsURL,
              params: s.facetsdata,
            }).success(function (e) {
              if (
                ((s.sources = e.sources),
                (s.authors = e.authors),
                (s.authorOptions.items = s.authors),
                (s.sourceOptions.items = s.sources),
                s.searchdata.author_id)
              )
                var o = !0;
              if (s.searchdata.source_id) var i = !0;
              (s.searchdata.author_id = void 0),
                (s.searchdata.source_id = void 0),
                n(function () {
                  (s.searchdata.author_id = o
                    ? s.author_id_default
                    : s.facetsdata.author_ids
                    ? s.facetsdata.author_ids
                    : ''),
                    (s.searchdata.source_id = i
                      ? s.source_id_default
                      : s.facetsdata.source_ids
                      ? s.facetsdata.source_ids
                      : '');
                  var e = a('filter')(
                      s.sources,
                      {
                        id: parseInt(s.searchdata.source_id, 10),
                      },
                      !0,
                    ),
                    t = a('filter')(
                      s.authors,
                      {
                        id: parseInt(s.searchdata.author_id, 10),
                      },
                      !0,
                    );
                  0 < e.length && (s.sourceOptions.selectedItems = [e[0]]),
                    0 < t.length && (s.authorOptions.selectedItems = [t[0]]);
                }, 0);
            });
        }),
        s.getFacets(),
        (s.changeAuthor = function () {
          (s.facetsdata.author_ids = s.searchdata.author_id),
            '' === s.searchdata.author_id ? s.getFacets() : s.getSourceFacets(),
            (s.searchdata.author_id = s.facetsdata.author_ids ? s.facetsdata.author_ids : ''),
            n(function () {
              angular.element('.b-top').trigger('changeAuthor', {
                author: s.facetsdata.author_ids,
              });
            }, 50);
        }),
        (s.changeSource = function () {
          (s.facetsdata.source_ids = s.searchdata.source_id),
            '' === s.searchdata.source_id ? s.getFacets() : s.getAuthorFacets(),
            (s.searchdata.source_id = s.facetsdata.source_ids ? s.facetsdata.source_ids : ''),
            n(function () {
              angular.element('.b-top').trigger('changeSource', {
                source: s.facetsdata.source_ids,
              });
            }, 50);
        }),
        (s.showExtend = function () {
          (s.extendMode = !0), s.getFacets();
        }),
        (s.onKeyUp = function (e) {
          13 === e.which &&
            (e.preventDefault(), (s.suggestData.suggestsShow = !1), (s.suggestData.suggests = []), s.getFacets());
        }),
        (s.clearTextInput = function () {
          (s.facetsdata.query = ''),
            (s.searchQuery = ''),
            (s.suggestData.suggestsShow = !1),
            (s.suggestData.suggests = []);
        }),
        (s.onFind = function () {
          s.getFacets(), (s.suggestData.suggestsShow = !1), (s.suggestData.suggests = []);
        }),
        (s.suggestData.suggestsShow = !1),
        (window.onclick = function () {
          s.suggestData.suggestsShow && ((s.suggestData.suggestsShow = !1), s.$apply());
        }),
        (s.loadSuggest = function () {
          c.resolve(),
            (c = r.defer()),
            (s.searchQuery = s.searchQuery.replace(/[/.,!?;\[\]\(\)<>\{\}\^\&\*\$±]*/g, '')),
            (s.suggestData.suggests = []),
            (s.actualSuggest = s.searchQuery),
            0 < s.searchQuery.length
              ? e({
                  method: 'get',
                  url: '/search/suggests/?query=' + s.searchQuery,
                  timeout: c.promise,
                }).then(
                  function (e) {
                    e.data.suggests.forEach(function (e) {
                      s.suggestData.suggests.push(i.trustAsHtml(e));
                    }),
                      (s.suggestData.suggestsShow = 0 < s.suggestData.suggests.length),
                      (s.suggestData.selectedItem = 0);
                  },
                  function () {
                    s.suggestData.suggestsShow = !1;
                  },
                )
              : (s.suggestData.suggestsShow = !1);
        }),
        (s.suggestData.suggestsToSearch = function (e) {
          var t = i.valueOf(e).replace(/(\<(\/?[^>]+)>)/g, '');
          (s.searchQuery = t),
            (s.suggestData.suggestsShow = !1),
            (s.suggestData.suggests = []),
            n(function () {
              $(document.searchForm).trigger('submit');
            }, 500);
        }),
        (s.keyboardNav = function (e) {
          if ((e.preventDefault(), 0 < s.suggestData.suggests.length && s.suggestData.suggestsShow)) {
            switch (e.which) {
              case 38:
                s.suggestData.selectedItem--, t();
                break;
              case 40:
                s.suggestData.selectedItem++, t();
                break;
              case 27:
                s.clearTextInput();
            }
            function t() {
              var e = document.querySelectorAll('.search-suggest__item');
              s.suggestData.selectedItem <= 0
                ? (s.suggestData.selectedItem = e.length)
                : s.suggestData.selectedItem > e.length && (s.suggestData.selectedItem = 1);
              for (var t = 0; t < e.length; t++) e[t].classList.remove('search-suggest__item_focus');
              e[s.suggestData.selectedItem - 1].classList.add('search-suggest__item_focus'),
                (s.searchQuery = e[s.suggestData.selectedItem - 1].innerText);
            }
          }
        }),
        (s.preventCursorMove = function (e) {
          (38 !== e.which && 40 !== e.which) || e.preventDefault();
        });
    },
  ]),
  photoApp.controller('TagsTabsCtrl', [
    '$scope',
    'restUrls',
    '$http',
    '$timeout',
    '$q',
    function (s, e, t, o, i) {
      var n = 0,
        a = i.defer();
      (s.tagsURL = e.tagstree),
        (s.tagsParam = {
          show_service_tags: 1,
          show_ancestors: 1,
          unsorted_tags: 1,
          page: 1,
        }),
        (s.taglistURL = e.tagslist),
        (s.tagNodesURL = e.tagsnodes),
        (s.tagCreateOrGet = e.tagcreateorget),
        (s.tagsIdies = void 0),
        (s.photoTags = []),
        (s.tagExist = !0),
        (s.initTags = function () {
          (s.tags = []),
            (s.currentPhotoIndex = 0),
            (s.currentTagData = {
              currentTagId: void 0,
              currentChilds: void 0,
              currentParent: void 0,
              currentIndex: void 0,
              level: 0,
            }),
            (s.tagSections = []),
            (s.prevIndexes = []);
        }),
        (s.getTags = function (e) {
          a.resolve(),
            (n = $.now()),
            o(function () {
              $.now() - n < 300 ||
                (e && e.tagquery && '' !== e.tagquery
                  ? ((s.tagsParam.page = 1),
                    (s.tagExist = !1),
                    (s.currentTagData.level = 0),
                    (s.tagsParam.query = e.tagquery),
                    t({
                      method: 'get',
                      url: s.tagNodesURL,
                      params: s.tagsParam,
                    }).then(
                      function (e) {
                        var t = e.data;
                        (s.showTagsError = !1),
                          (s.tagSections = []),
                          s.tagSections.push(t.results),
                          (s.tags = t.results),
                          (s.loadtree = !1),
                          angular.element('.tags-tabs__tabs-list-subsection_section_1').removeAttr('style'),
                          (s.currentTagData.currentIndex = void 0),
                          (s.hasTags = Boolean(t.has_next));
                      },
                      function (e) {
                        (s.showTagsError = !0),
                          404 == e.status
                            ? (s.initTags(), (s.tagsError = 'Тэгов по данному запросу не найдено'))
                            : (s.tagsError = 'Произошла ошибка'),
                          (s.currentTagData.currentIndex = void 0),
                          (s.loadtree = !1),
                          (s.hasTags = !1);
                      },
                    ))
                  : ((s.showTagsError = !1), (s.tagExist = !0), s.onTagFocus()));
            }, 300);
        }),
        (s.getTagsChain = function (o) {
          if (0 < o.tag_tree_nodes.length)
            var e = t({
              method: 'get',
              url: s.tagNodesURL,
              params: {
                page_size: 1e4,
                id: o.tag_tree_nodes,
                show_ancestors: 1,
              },
            }).success(function (e) {
              o.photoTags = e.results;
            });
          else o.photoTags = [];
          0 < o.tags.length &&
            (e
              ? e.success(function () {
                  t({
                    method: 'get',
                    url: s.taglistURL,
                    params: {
                      id: o.tags,
                      page_size: 1e4,
                    },
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }).success(function (e) {
                    angular.forEach(e.results, function (e) {
                      var t = {
                        id: e.id,
                        noexist: !0,
                        tag: {
                          id: e.id,
                          name: e.name,
                        },
                      };
                      -1 === o.photoTags.indexOf(t) && o.photoTags.push(t);
                    });
                  });
                })
              : t({
                  method: 'get',
                  url: s.taglistURL,
                  params: {
                    id: o.tags,
                  },
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }).success(function (e) {
                  angular.forEach(e.results, function (e) {
                    var t = {
                      id: e.id,
                      noexist: !0,
                      tag: {
                        id: e.id,
                        name: e.name,
                      },
                    };
                    -1 === o.photoTags.indexOf(t) && o.photoTags.push(t);
                  });
                }));
        }),
        (s.loadPageTags = function (e) {
          e.tagquery && '' !== e.tagquery && !s.loadtree
            ? ((s.tagExist = !1),
              (s.tagsParam.page += 1),
              (s.loadtree = !0),
              t({
                method: 'get',
                url: s.tagNodesURL,
                params: s.tagsParam,
              }).then(
                function (e) {
                  var t = e.data;
                  (s.showTagsError = !1),
                    (s.tagSections[0] = s.tagSections[0].concat(t.results)),
                    (s.tags = s.tagSections),
                    (s.loadtree = !1),
                    angular.element('.photo__tags-list-subsection_section_1').removeAttr('style'),
                    (s.hasTags = Boolean(t.has_next));
                },
                function (e) {
                  (s.showTagsError = !0),
                    404 == e.status
                      ? (s.initTags(), (s.tagsError = 'Тэгов по данному запросу не найдено'))
                      : (s.tagsError = 'Произошла ошибка'),
                    (s.loadtree = !1),
                    (s.hasTags = !1);
                },
              ))
            : ((s.tagExist = !0), (s.offOnFocus = !1), s.onTagFocus());
        }),
        (s.addTag = function (e, t) {
          t
            ? -1 === s.currentItem.tag_tree_nodes.indexOf(e.id) &&
              (s.currentItem.tag_tree_nodes.push(e.id), s.getTagsChain(s.currentItem))
            : -1 === s.currentItem.tags.indexOf(e.tag.id) &&
              (s.currentItem.tags.push(e.tag.id), s.getTagsChain(s.currentItem));
        }),
        (s.delTag = function (e, t) {
          var o;
          t
            ? -1 < (o = s.currentItem.tags.indexOf(e)) &&
              (s.currentItem.tags.splice(o, 1), s.getTagsChain(s.currentItem))
            : -1 < (o = s.currentItem.tag_tree_nodes.indexOf(e)) &&
              (s.currentItem.tag_tree_nodes.splice(o, 1), s.getTagsChain(s.currentItem));
        }),
        (s.setIndexId = function (e, t) {
          (s.currentTagData.currentIndex = e),
            (s.currentTagData.currentTagId = t.tag.id),
            (s.currentTagData.currentChilds = t.children),
            (s.currentTagData.currentTagNodeId = t.id ? t.id : ''),
            (s.currentTagData.inTree = Boolean(t.tag.in_tree));
        }),
        (s.moveTop = function () {
          var e = s.tagSections[s.tagSections.length - 1];
          if (e) {
            var t = s.currentTagData.currentIndex - 1,
              o = e[t];
            o && s.setIndexId(t, o);
          }
        }),
        (s.moveDown = function () {
          var e = s.tagSections[s.tagSections.length - 1];
          if (e) {
            var t = s.currentTagData.currentIndex + 1,
              o = e[t];
            o && s.setIndexId(t, o);
          }
        }),
        (s.moveLeft = function () {
          if (-1 < s.currentTagData.level - 1) {
            (s.currentTagData.level = 0 < s.currentTagData.level - 1 ? s.currentTagData.level - 1 : 0),
              s.tagSections.pop();
            var e = s.prevIndexes[s.prevIndexes.length - 1],
              t = s.prevIndexes[s.prevIndexes.length - 1].index;
            s.prevIndexes.pop(),
              s.setIndexId(t, e),
              o(function () {
                if (0 == s.currentTagData.level)
                  angular.element('.tags-tabs__tabs-list-subsection').removeAttr('style');
                else {
                  angular.element('.tags-tabs__tabs-list-subsection').css({
                    height: 'auto',
                  });
                  var e = angular.element('.tags-tabs__tabs-list-subsection:last-child').height();
                  angular.element('.tags-tabs__tabs-list-subsection').height(e);
                }
                $('.tags-tabs__tabs-list').scrollTop(0);
              }, 0);
          }
        }),
        (s.moveRight = function () {
          s.currentTagData.currentChilds &&
            0 < s.currentTagData.currentChilds.length &&
            ((s.currentTagData.level += 1),
            s.tagSections.push(s.currentTagData.currentChilds),
            s.prevIndexes.push({
              index: s.currentTagData.currentIndex,
              tag: {
                id: s.currentTagData.currentTagId,
                in_tree: s.currentTagData.inTree,
              },
              children: s.currentTagData.currentChilds,
            }),
            (s.currentTagData.prevIndex = s.currentTagData.currentTagId),
            s.setIndexId(0, s.currentTagData.currentChilds[0]),
            o(function () {
              angular.element('.tags-tabs__tabs-list-subsection').css({
                height: 'auto',
              });
              var e = angular.element('.tags-tabs__tabs-list-subsection:last-child').height();
              angular.element('.tags-tabs__tabs-list-subsection').height(e), $('.tags-tabs__tabs-list').scrollTop(0);
            }, 0));
        }),
        (s.showSubs = function (e, t) {
          (s.currentTagData.currentChilds = t.children),
            s.setIndexId(e, t),
            o(function () {
              s.moveRight();
            }, 0);
        }),
        (s.setScroll = function () {
          var e = $('.tags-tabs__tabs-list-frame').offset().top;
          0 < s.currentTagData.currentIndex && (e += 41 * s.currentTagData.currentIndex),
            $('html, body').stop().animate({
              scrollTop: e,
            });
        }),
        (s.onKeyUp = function (e) {
          40 === e.keyCode &&
            s.tags &&
            (angular.element(e.currentTarget).blur(),
            (s.currentTagData.level = 0),
            s.setIndexId(0, s.tagSections[s.tagSections.length - 1][0]));
        }),
        (s.onTagFocus = function () {
          a.resolve(),
            (a = i.defer()),
            s.currentItem &&
              !s.currentItem.tagquery &&
              ((s.loadtabtags = !0),
              t({
                method: 'get',
                url: s.tagsURL,
                timeout: a.promise,
              }).then(
                function (e) {
                  for (var t = e.data, o = [], i = 0; i < t.results.length; i++) o.push(t.results[i]);
                  (s.currentTagData = {
                    currentTagId: void 0,
                    currentChilds: void 0,
                    currentParent: void 0,
                    currentIndex: void 0,
                    level: 0,
                  }),
                    (s.tagSections = []),
                    (s.prevIndexes = []),
                    s.tagSections.push(o),
                    (s.tags = t.results),
                    (s.loadtabtags = !1),
                    (s.showTagsError = !1),
                    angular.element('.tags-tabs__tabs-list-subsection').removeAttr('style');
                },
                function () {
                  (s.loadtabtags = !1), (s.showTagsError = !0);
                },
              ));
        }),
        (s.createNewTag = function (e) {
          e.tagquery && s.addNewTag(e.tagquery);
        }),
        (s.addNewTag = function (e) {
          s.addNewTagInProgress ||
            ((s.addNewTagInProgress = !0),
            t({
              method: 'post',
              url: s.tagCreateOrGet,
              data: {
                name: e,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .success(function (e) {
                -1 === s.currentItem.tags.indexOf(e.id) &&
                  ((s.currentItem.tagquery = ''), s.currentItem.tags.push(e.id), s.getTagsChain(s.currentItem)),
                  (s.addNewTagInProgress = !1),
                  (s.tagExist = !0);
              })
              .error(function () {
                (s.addNewTagInProgress = !1), (s.tagExist = !0);
              }));
        }),
        (s.clickNode = function (e, t, o) {
          e.stopPropagation(), (s.currentTagData.currentChilds = o.children), s.setIndexId(t, o);
        }),
        (s.clickNodeName = function (e, t) {
          e.stopPropagation(), t && s.addTag(t, t.tag.in_tree);
        }),
        (s.onEnterKey = function () {
          if (s.currentTagData && s.currentTagData.currentTagId) {
            var e = {
              id: s.currentTagData.currentTagNodeId,
              tag: {
                id: s.currentTagData.currentTagId,
              },
            };
            s.addTag(e, s.currentTagData.inTree);
          }
        }),
        s.$on('loadtagsfront', function (e, t) {
          s.$parent.item.id == t.id &&
            (s.initTags(), (s.currentItem = t), s.currentItem.photoTags || s.getTagsChain(s.currentItem));
        });
    },
  ]),
  photoApp.controller('DownloadCtrl', [
    '$scope',
    'restUrls',
    '$http',
    '$window',
    '$timeout',
    '$cookies',
    '$q',
    '$sce',
    '$filter',
    'FileUploader',
    function (n, e, a, t, r, o, i, s, l, c) {
      if (
        ((n.licenseAccepted = 'True' === angular.element('.b-body').data('license')),
        (n.uploadURL = e.photos),
        (n.moderateURL = e.moderate),
        (n.removePhotosURL = e.removephotos),
        (n.sourcesURL = e.sources),
        (n.periodsURL = e.periods),
        (n.regionSuggest = e.regionSuggest),
        (n.tagsURL = e.tagstree),
        (n.tagNodesURL = e.tagsnodes),
        (n.tagCreateOrGet = e.tagcreateorget),
        (n.dndURL = e.d_n_d_create),
        (n.uploads = []),
        (n.uploadErrors = []),
        (n.photosWithError = []),
        (n.non_field_errors = null),
        (n.tagExist = !1),
        (n.currentTagData = {
          currentTagId: void 0,
          currentChilds: void 0,
          currentParent: void 0,
          currentIndex: void 0,
          level: 0,
        }),
        (n.tagSections = []),
        (n.showAgreement = !1),
        (n.agreeWithRules = !1),
        (n.showSuccessSave = !1),
        (n.saveProgress = !1),
        (n.moderateProgress = !1),
        (n.currentPhotoIndex = 0),
        (n.currentUploadID = null),
        (n.prevIndexes = []),
        (n.periods = a.get(n.periodsURL)),
        (n.imageUploader = new c({
          headers: {
            'X-CSRFToken': o.get('csrftoken'),
          },
          alias: 'image',
          url: n.uploadURL,
          autoUpload: !0,
          filters: [
            {
              name: 'isImage',
              fn: function (e) {
                return 0 <= $.inArray(e.type, ['image/gif', 'image/jpeg', 'image/png']);
              },
            },
            {
              name: 'isBig',
              fn: function (e) {
                return e.size < 5242880;
              },
            },
          ],
        })),
        (n.isWebkit = -1 !== navigator.userAgent.indexOf('AppleWebKit')),
        (n.isWindows = -1 !== navigator.platform.indexOf('Win')),
        n.$on('editimage', function (e, t) {
          t.imageedited = !0;
        }),
        n.isWebkit && n.isWindows)
      ) {
        function d() {
          (n.inFileModal = !1), document.body.removeEventListener('focus', function () {}, !0), n.$apply();
        }
        angular.element('.upload-photos__drop').on('drop', function () {
          n.inFileModal ? n.sendDropEvent(!0) : n.sendDropEvent(!1), n.$apply();
        }),
          angular.element('.upload-photos__drop-button').on('click', function () {
            (n.inFileModal = !0),
              document.body.addEventListener(
                'focus',
                function () {
                  setTimeout(d, 100);
                },
                !0,
              ),
              n.$apply();
          });
      }
      (n.sendDropEvent = function (e) {
        var t = {
          event: 'direct',
        };
        e && (t.event = 'modal'),
          a({
            method: 'post',
            data: t,
            url: n.dndURL,
            headers: {
              'Content-Type': 'application/json',
            },
          });
      }),
        (n.savePhotos = function () {
          n.uploadErrors = [];
          var s = [],
            e = i.defer();
          if (((n.photosWithError = []), !n.saveProgress && !n.moderateProgress))
            return (
              (n.saveProgress = !0),
              angular.forEach(n.uploads, function (o) {
                var e = angular.copy(o),
                  i = e.id,
                  t = e.base64;
                delete e.image,
                  delete e.base64,
                  delete e.crop,
                  e.imageedited && (e.image = t),
                  e.source && (e.source = e.source.id),
                  e.region && 'object' == typeof e.region && (e.region = e.region.id),
                  '' === e.date_from && (e.date_from = null),
                  '' === e.date_to && (e.date_to = null),
                  s.push(
                    a({
                      method: 'patch',
                      url: n.uploadURL + i + '/',
                      data: e,
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                      .success(function () {
                        o.errors = [];
                        var e = n.photosWithError.indexOf(i);
                        -1 < e && n.photosWithError.splice(e, 1),
                          (n.showSuccessSave = !0),
                          r(function () {
                            n.showSuccessSave = !1;
                          }, 1800),
                          (n.saveProgress = !1);
                      })
                      .error(function (e) {
                        var t = n.photosWithError.indexOf(i);
                        (o.errors = e),
                          -1 === t && n.photosWithError.push(i),
                          o.errors.date_to &&
                            ((o.errors.date_to[0] = o.errors.date_to[0].replace('YYYY[-MM[-DD]]', 'ГГГГ-ММ-ДД')),
                            (o.errors.date_to[0] = o.errors.date_to[0].replace('date', 'даты'))),
                          o.errors.date_from &&
                            ((o.errors.date_from[0] = o.errors.date_from[0].replace('YYYY[-MM[-DD]]', 'ГГГГ-ММ-ДД')),
                            (o.errors.date_from[0] = o.errors.date_from[0].replace('date', 'даты'))),
                          o.errors.latitude && (o.errors.latitude[0] = o.errors.latitude[0].replace('цисле', 'числе')),
                          o.errors.longitude &&
                            (o.errors.longitude[0] = o.errors.longitude[0].replace('цисле', 'числе')),
                          (n.saveProgress = !1),
                          (n.moderateProgress = !1);
                      }),
                  );
              }),
              0 < s.length
                ? i.all(s).then(function () {
                    e.resolve('save all photos');
                  })
                : e.reject('nothing to save'),
              e.promise
            );
        }),
        (n.savePhotosAndModerate = function () {
          if (!n.moderateProgress && !n.saveProgress) {
            var e = n.savePhotos();
            (n.moderateProgress = !0),
              e.then(
                function () {
                  (n.saveProgress = !1), n.sendToModerate();
                },
                function () {
                  n.saveProgress = !1;
                },
              );
          }
        }),
        (n.sendToModerate = function (e) {
          var t = [];
          (n.moderateError = void 0),
            angular.forEach(n.uploads, function (e) {
              t.push(e.id);
            }),
            0 < t.length &&
              a({
                method: 'post',
                url: n.moderateURL,
                data: $.param(
                  {
                    id: t,
                    is_license_accepted: e,
                  },
                  !0,
                ),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              })
                .success(function () {
                  (n.showSuccessModerate = !0),
                    (n.moderateError = !1),
                    r(function () {
                      (n.uploads = []),
                        (n.moderateProgress = !1),
                        (n.showSuccessModerate = !1),
                        r(function () {
                          window.location.href = '/profile/';
                        }, 0);
                    }, 1800);
                })
                .error(function (e) {
                  'LICENSE_NOT_ACCEPTED' === e.error_code
                    ? ((n.showAgreement = !0), angular.element('.b-body').addClass('b-body_popup_yes'))
                    : ((n.moderateError = !0), (n.moderateErrorMessage = s.trustAsHtml(e.message))),
                    (n.moderateProgress = !1);
                });
        }),
        (n.sendAgree = function () {
          n.agreeWithRules && (n.closeAgreement(), n.sendToModerate(n.agreeWithRules));
        }),
        (n.closeAgreement = function () {
          (n.showAgreement = !1), angular.element('.b-body').removeClass('b-body_popup_yes');
        }),
        (n.imageUploader.onWhenAddingFileFailed = function (e, t) {
          'isImage' === t.name &&
            n.uploadErrors.push({
              file: e.name,
              error: 'Невалидный формат файла',
            }),
            'isBig' === t.name &&
              n.uploadErrors.push({
                file: e.name,
                error: 'Максимальный размер файла 5 МБ',
              });
        }),
        (n.imageUploader.onErrorItem = function (e, t) {
          var o = e._file.name,
            i = 'Ошибка сервера';
          try {
            var s = JSON.parse(e._xhr.response);
            i = s.image ? s.image[0] : s.detail;
          } catch (e) {
            console.log(e);
          }
          n.uploadErrors.push({
            file: o,
            error: i,
          }),
            'LIMIT_EXCEEDED' === t.error_code && (n.imageUploader.clearQueue(), n.imageUploader.cancelAll());
        }),
        (n.imageUploader.onCompleteAll = function () {
          n.getUploads(), (n.showProgress = !1);
        }),
        (n.imageUploader.onProgressAll = function (e) {
          (n.showProgress = !0), (n.progress = e + '%');
        }),
        (n.getUploads = function () {
          a({
            method: 'get',
            url: n.uploadURL,
            params: {
              status: 0,
            },
          })
            .success(function (e) {
              angular.forEach(e, function (e) {
                '' === e.date_from && (e.date_from = null),
                  '' === e.date_to && (e.date_to = null),
                  (e.image = e.thumbnails ? e.thumbnails.original : null),
                  (e.applyInfo = {}),
                  l('filter')(n.uploads, {
                    id: e.id,
                  })[0] || n.uploads.unshift(e);
              });
            })
            .error(function (e) {
              console.log(e);
            });
        }),
        n.getUploads(),
        (n.delPhoto = function (t, e) {
          t &&
            (n.uploads.splice(e, 1),
            a({
              method: 'DELETE',
              url: n.uploadURL + t.id + '/',
            })
              .success(function () {
                var e = n.photosWithError.indexOf(t.id);
                -1 < e && n.photosWithError.splice(e, 1), n.uploads.length < 1 && (n.currentUploadID = null);
              })
              .error(function (e) {
                console.log(e);
              }));
        }),
        (n.cancelUpload = function () {
          if (
            ((n.uploadErrors = []), (n.showProgress = !0), (n.progress = 'Отмена загрузки..'), 0 < n.uploads.length)
          ) {
            for (var e = [], t = 0, o = n.uploads.length; t < o; t++) e.push(n.uploads[t].id);
            var i = a({
              method: 'post',
              url: n.removePhotosURL,
              data: $.param(
                {
                  id: e,
                },
                !0,
              ),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            });
          }
          i.then(
            function () {
              (n.photosWithError = []), (n.currentUploadID = null), (n.showProgress = !1), (n.uploads = []);
            },
            function (e) {
              console.log(e);
            },
          );
        }),
        n.$watchCollection('photosWithError', function (e) {
          n.photosInfoError = 0 < e.length;
        }),
        n.$watchGroup(['photosInfoError', 'moderateError'], function (e) {
          n.showValidationPanel = Boolean(e[0] || e[1]);
        }),
        (n.applyAuthorForNext = function (t) {
          (t.applyAuthors = !t.applyAuthors),
            t &&
              t.author_name &&
              (t.applyAuthors
                ? angular.forEach(n.uploads, function (e) {
                    e.id < t.id &&
                      ((e.reverted = !1),
                      n.revertAuthor(e),
                      (e.applyInfo.author.new_author_name = angular.copy(t.author_name)),
                      (e.author_name = angular.copy(t.author_name)));
                  })
                : angular.forEach(n.uploads, function (e) {
                    e.id < t.id && n.revertAuthor(e);
                  }));
        }),
        (n.revertAuthor = function (e) {
          (e.reverted = !e.reverted),
            e.applyInfo.hasOwnProperty('author') ||
              (e.applyInfo.author = {
                author_name: e.author_name,
              }),
            e.reverted
              ? (0 < Object.keys(e.applyInfo.author).length && (e.author_name = e.applyInfo.author.new_author_name),
                (e.applyInfo.author.text = 'Вернуть значение'))
              : ((e.author_name = e.applyInfo.author.author_name), (e.applyInfo.author.text = 'Повторить'));
        }),
        (n.applyDateForNext = function (t) {
          (t.applyDate = !t.applyDate),
            ((t && t.date_from) || t.date_to) &&
              (t.applyDate
                ? angular.forEach(n.uploads, function (e) {
                    e.id < t.id &&
                      ((e.reverted = !1),
                      n.revertDate(e),
                      (e.applyInfo.date.new_date_to = angular.copy(t.date_to)),
                      (e.applyInfo.date.new_date_from = angular.copy(t.date_from)),
                      (e.date_from = angular.copy(t.date_from)),
                      (e.date_to = angular.copy(t.date_to)));
                  })
                : angular.forEach(n.uploads, function (e) {
                    e.id < t.id && n.revertDate(e);
                  }));
        }),
        (n.revertDate = function (e) {
          (e.reverted = !e.reverted),
            e.applyInfo.hasOwnProperty('date') ||
              (e.applyInfo.date = {
                date_from: e.date_from,
                date_to: e.date_to,
              }),
            e.reverted
              ? (0 < Object.keys(e.applyInfo.date).length &&
                  ((e.date_from = e.applyInfo.date.new_date_from), (e.date_to = e.applyInfo.date.new_date_to)),
                (e.applyInfo.date.text = 'Вернуть значение'))
              : ((e.date_from = e.applyInfo.date.date_from),
                (e.date_to = e.applyInfo.date.date_to),
                (e.applyInfo.date.text = 'Повторить'));
        }),
        (n.applyGeoForNext = function (e, t) {
          t.applyGeo = !t.applyGeo;
          var o = angular
            .element(e.currentTarget)
            .closest('.upload-photos__form')
            .find('.angucomplete-holder input')
            .val();
          t &&
            (t.applyGeo
              ? angular.forEach(n.uploads, function (e) {
                  e.id < t.id &&
                    ((e.reverted = !1),
                    n.revertGeo(e),
                    (e.applyInfo.geo.new_region = angular.copy(t.region)),
                    (e.applyInfo.geo.new_latitude = angular.copy(t.latitude)),
                    (e.applyInfo.geo.new_longitude = angular.copy(t.longitude)),
                    (e.applyInfo.geo.new_region_name = angular.copy(t.region_name)),
                    (e.applyInfo.geo.new_address = angular.copy(t.address)),
                    (e.applyInfo.geo.new_input_text = angular.copy(o)),
                    (e.region = angular.copy(t.region)),
                    (e.latitude = angular.copy(t.latitude)),
                    (e.longitude = angular.copy(t.longitude)),
                    (e.address = angular.copy(t.address)),
                    (e.region_name = angular.copy(t.region_name)),
                    n.setAutocompleteValue(e, o));
                })
              : angular.forEach(n.uploads, function (e) {
                  e.id < t.id && n.revertGeo(e);
                }));
        }),
        (n.revertGeo = function (e) {
          if (((e.reverted = !e.reverted), !e.applyInfo.hasOwnProperty('geo'))) {
            var t = angular
              .element('#upload-photos__photo' + e.id)
              .find('.angucomplete-holder input')
              .val();
            e.applyInfo.geo = {
              latitude: e.latitude,
              address: e.address,
              longitude: e.longitude,
              region_name: e.region_name,
              input_text: t,
            };
          }
          e.reverted
            ? (0 < Object.keys(e.applyInfo.geo).length &&
                ((e.latitude = e.applyInfo.geo.new_latitude),
                (e.longitude = e.applyInfo.geo.new_longitude),
                (e.address = e.applyInfo.geo.new_address),
                (e.region_name = e.applyInfo.geo.new_region_name),
                n.setAutocompleteValue(e, e.applyInfo.geo.new_input_text)),
              (e.applyInfo.geo.text = 'Вернуть значение'))
            : ((e.latitude = e.applyInfo.geo.latitude),
              (e.longitude = e.applyInfo.geo.longitude),
              (e.region_name = e.applyInfo.geo.region_name),
              (e.address = e.applyInfo.geo.address),
              n.setAutocompleteValue(e, e.applyInfo.geo.input_text),
              (e.applyInfo.geo.text = 'Повторить'));
        }),
        (n.setAutocompleteValue = function (e, t) {
          angular
            .element('#upload-photos__photo' + e.id)
            .find('.angucomplete-holder input')
            .val(t);
        }),
        (n.onMouseEnter = function (e) {
          n.currentUploadID != e &&
            ((n.currentUpload = l('filter')(n.uploads, {
              id: e,
            })[0]),
            n.$broadcast('loadtagsfront', n.currentUpload),
            (n.currentUploadID = e));
        });
      var u = function (e) {
        (this.myMap = null),
          (this.myPlacemark = null),
          (this.myPlacemarkCoords = null),
          (this.myPlacemarkAddress = null),
          (this.$inputLat = e.$inputLat),
          (this.$inputLong = e.$inputLong),
          (this.$inputAddress = e.$inputAddress),
          (this.$inputRegion = e.$inputRegion),
          (this.$mapDescrAddress = e.$mapDescrAddress),
          (this.$mapDescrLat = e.$mapDescrLat),
          (this.$mapDescrLong = e.$mapDescrLong),
          (this.mapCenter = e.mapCenter || [55.753994, 37.622093]);
      };
      (u.prototype.init = function (e) {
        var o = this,
          t = o.myMap;
        ymaps.ready(function () {
          t ||
            (o.createMap(o.mapCenter, e),
            o.myMap.events.add('click', function (e) {
              var t = e.get('coords');
              o.createPlacemark(t);
            }));
        });
      }),
        (u.prototype.work = function () {
          var t = this,
            o = $('.upload-photos__photo_current_yes .js-b-input-coord_region').val(),
            i = $('.upload-photos__photo_current_yes .js-b-input-coord_address').val(),
            s = $('.upload-photos__photo_current_yes .js-b-input-coord_lat').val(),
            n = $('.upload-photos__photo_current_yes .js-b-input-coord_long').val();
          t.myMap && t.myMap.container.fitToViewport(),
            ymaps.ready(function () {
              if ('' !== s && '' !== n) {
                var e = [s, n];
                t._moveMapCoords(e, t.createPlacemark);
              } else '' !== i ? t._moveMapAddress(i, t.createPlacemark) : '' !== o && t._moveMapRegion(o);
            });
        }),
        (u.prototype.newPlacemark = function (e) {
          return new ymaps.Placemark(
            e,
            {},
            {
              preset: 'islands#violetStretchyIcon',
              draggable: !0,
            },
          );
        }),
        (u.prototype.createPlacemark = function (e) {
          var t = this;
          t.myPlacemark
            ? (t.myPlacemark.geometry.setCoordinates(e),
              (t.myPlacemarkCoords = e),
              t._getGeoAddress(t.myPlacemarkCoords, t._setMapDescr))
            : ((t.myPlacemark = t.newPlacemark(e)),
              t.myMap.geoObjects.add(t.myPlacemark),
              (t.myPlacemarkCoords = e),
              t._getGeoAddress(t.myPlacemarkCoords, t._setMapDescr),
              t.myPlacemark.events.add('dragend', function () {
                var e = t.myPlacemark.geometry.getCoordinates();
                (t.myPlacemarkCoords = e), t._getGeoAddress(e, t._setMapDescr);
              }));
        }),
        (u.prototype.createMap = function (e, t) {
          var o = this;
          o.myMap = new ymaps.Map(
            t[0],
            {
              center: e,
              zoom: 9,
              controls: ['searchControl', 'typeSelector', 'fullscreenControl'],
            },
            {
              minZoom: 2,
              suppressMapOpenBlock: !0,
            },
          );
          var n = ymaps.templateLayoutFactory.createClass(
              "<div class='b-map__control'><button class='b-map__control-item b-map__control-item_zoom-in js-b-map-control-item_zoom js-b-map-control-item_zoom-in'></button><button class='b-map__control-item b-map__control-item_zoom-out js-b-map-control-item_zoom js-b-map-control-item_zoom-out'></button></div>",
              {
                build: function () {
                  n.superclass.build.call(this);
                  var e = this,
                    t = $('.js-b-map-control-item_zoom'),
                    o = $('.js-b-map-control-item_zoom-in'),
                    i = $('.js-b-map-control-item_zoom-out'),
                    s = this.getData().control.getMap();
                  s.events.add('boundschange', function () {
                    s.zoomRange.get(s.getCenter()).then(function (e) {
                      var t = e[1],
                        o = e[0],
                        i = s.getZoom();
                      t === i
                        ? s.events.fire('mapZoomMax')
                        : o === i
                        ? s.events.fire('mapZoomMin')
                        : s.events.fire('mapZoomNorm');
                    });
                  }),
                    s.events.add('mapZoomMax', function () {
                      e.buttonDesable(o);
                    }),
                    s.events.add('mapZoomMin', function () {
                      e.buttonDesable(i);
                    }),
                    s.events.add('mapZoomNorm', function () {
                      e.buttonEnable(t);
                    }),
                    (this.zoomInCallback = ymaps.util.bind(this.zoomIn, this)),
                    (this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this)),
                    o.on('click.mapzoom', this.zoomInCallback),
                    i.on('click.mapzoom', this.zoomOutCallback);
                },
                clear: function () {
                  $('.js-b-map-control-item_zoom-in').off('click.mapzoom', this.zoomInCallback),
                    $('.js-b-map-control-item_zoom-out').off('click.mapzoom', this.zoomOutCallback),
                    n.superclass.clear.call(this);
                },
                zoomIn: function (e) {
                  if ($(e.target).hasClass('b-map__control-item_desable')) return !1;
                  var t = this.getData().control.getMap().getZoom();
                  this.events.fire('zoomchange', {
                    oldZoom: t,
                    newZoom: t + 1,
                  });
                },
                zoomOut: function (e) {
                  if ($(e.target).hasClass('b-map__control-item_desable')) return !1;
                  var t = this.getData().control.getMap().getZoom();
                  this.events.fire('zoomchange', {
                    oldZoom: t,
                    newZoom: t - 1,
                  });
                },
                buttonDesable: function (e) {
                  e.addClass('b-map__control-item_desable');
                },
                buttonEnable: function (e) {
                  e.removeClass('b-map__control-item_desable');
                },
              },
            ),
            i = ymaps.templateLayoutFactory.createClass(
              "<div class='b-map__control b-map__control_location'><button class='b-map__control-item b-map__control-item_location js-b-map-control-location'></button></div>",
            ),
            s = new ymaps.control.Button({
              data: {},
              options: {
                layout: i,
                position: {
                  top: 320,
                  left: 10,
                },
              },
            }),
            a = new ymaps.control.ZoomControl({
              options: {
                layout: n,
                float: 'none',
                position: {
                  top: 170,
                  left: 10,
                },
              },
            });
          o.myMap.controls.add(a),
            o.myMap.controls.add(s),
            s.events.add('click', function () {
              o._mapGeolocation();
            }),
            t.addClass('js-b-map_created');
        }),
        (u.prototype._mapGeolocation = function () {
          var t = this;
          ymaps.geolocation
            .get({
              provider: 'yandex',
              mapStateAutoApply: !0,
            })
            .then(function (e) {
              e.geoObjects.options.set('preset', 'islands#redCircleIcon'),
                e.geoObjects.get(0).properties.set({
                  hintContent: 'Мое местоположение',
                }),
                t.myMap.geoObjects.add(e.geoObjects);
            });
        }),
        (u.prototype._moveMapCoords = function (o, i) {
          var s = this;
          ymaps
            .geocode(o, {
              results: 1,
            })
            .then(function (e) {
              var t = e.geoObjects.get(0).properties.get('boundedBy');
              s.myMap
                .setBounds(t, {
                  checkZoomRange: !0,
                  duration: 500,
                })
                .then(function () {
                  i.call(s, o);
                });
            });
        }),
        (u.prototype._moveMapAddress = function (e, s) {
          var n = this;
          ymaps
            .geocode(e, {
              results: 1,
            })
            .then(function (e) {
              var t = e.geoObjects.get(0),
                o = t.geometry.getCoordinates(),
                i = t.properties.get('boundedBy');
              n.myMap
                .setBounds(i, {
                  checkZoomRange: !0,
                  duration: 500,
                })
                .then(function () {
                  s.call(n, o);
                });
            });
        }),
        (u.prototype._moveMapRegion = function (e, s) {
          var n = this;
          ymaps
            .geocode(e, {
              results: 1,
            })
            .then(function (e) {
              var t = e.geoObjects.get(0),
                o = t.geometry.getCoordinates(),
                i = t.properties.get('boundedBy');
              n.myMap.setBounds(i, {
                checkZoomRange: !0,
                duration: 700,
              }),
                s(o);
            });
        }),
        (u.prototype.setInputValue = function () {
          var e = this.myPlacemarkCoords;
          this.myPlacemark &&
            (r(function () {
              (n.currentUpload.latitude = e[0]), (n.currentUpload.longitude = e[1]);
            }, 0),
            this.$inputLat.val(e[0]),
            this.$inputLong.val(e[1]));
        }),
        (u.prototype._getGeoAddress = function (e, o) {
          var i = this;
          ymaps
            .geocode(e, {
              results: 1,
            })
            .then(function (e) {
              var t = e.geoObjects.get(0);
              (i.myPlacemarkAddress = t.properties.get('text')), o.call(i);
            });
        }),
        (u.prototype._setMapDescr = function () {
          $('.js-b-popup-map-descr-address').html(this.myPlacemarkAddress),
            $('.js-b-popup-map-descr-lat').html(this.myPlacemarkCoords[0]),
            $('.js-b-popup-map-descr-long').html(this.myPlacemarkCoords[1]);
        }),
        $(document).ready(function () {
          var e = $('.js-b-popup_map-coord'),
            t = $('.js-b-map_coord-button-save'),
            o = {
              $inputLat: $('.upload-photos__photo_current_yes .js-b-input-coord_lat'),
              $inputLong: $('.upload-photos__photo_current_yes .js-b-input-coord_long'),
              $inputAddress: $('.upload-photos__photo_current_yes .js-b-input-coord_address'),
              $inputRegion: $('.upload-photos__photo_current_yes .js-b-input-coord_region'),
              $mapDescrAddress: $('.js-b-popup-map-descr-address'),
              $mapDescrLat: $('.js-b-popup-map-descr-lat'),
              $mapDescrLong: $('.js-b-popup-map-descr-long'),
              mapCenterDefault: [55.753994, 37.622093],
            },
            i = new u(o);
          e.on('popupOpen', function (e) {
            e.preventDefault();
            var t = $(this).find('.js-b-map_coord');
            0 < t.length && !t.hasClass('js-b-map_created')
              ? (i.init(t), i.work())
              : t.hasClass('js-b-map_created') && i.work();
          }),
            t.on('click', function (e) {
              e.preventDefault(), i.setInputValue();
            });
        });
      var p = new (function () {
        (this.showPopup = function (e) {
          var t = $('body'),
            o = t.outerWidth(!0),
            i = t.outerWidth(!0);
          t.addClass('modify-popup-open'), i != o && t.css('paddingRight', i - o + 'px');
          var s = e.data('popup-id'),
            n = $('.js-b-popup_' + s);
          return n.addClass('js-b-popup-state_open'), n.show(), n.trigger('popupOpen'), n;
        }),
          (this.hidePopup = function (e) {
            e.hide();
          }),
          (this.bodyRemoveFixed = function () {
            setTimeout(function () {
              $('body').removeClass('modify-popup-open').removeAttr('style');
            }, 400);
          });
      })();
      $(document).ready(function () {
        $('body').on('click', '.js-popup-open', function () {
          return p.showPopup($(this)), !1;
        }),
          $(document).on('click', '.js-b-popup', function (e) {
            var t = $(e.target),
              o = t.closest('.js-b-popup__container'),
              i = t.closest('.js-b-popup__close');
            (0 === o.length || 0 < i.length) && (p.hidePopup($(this)), p.bodyRemoveFixed());
          });
      });
    },
  ]),
  'document' in self &&
    ('classList' in document.createElement('_') &&
    (!document.createElementNS || 'classList' in document.createElementNS('http://www.w3.org/2000/svg', 'g'))
      ? (function () {
          'use strict';
          var e = document.createElement('_');
          if ((e.classList.add('c1', 'c2'), !e.classList.contains('c2'))) {
            var t = function (e) {
              var i = DOMTokenList.prototype[e];
              DOMTokenList.prototype[e] = function (e) {
                var t,
                  o = arguments.length;
                for (t = 0; t < o; t++) (e = arguments[t]), i.call(this, e);
              };
            };
            t('add'), t('remove');
          }
          if ((e.classList.toggle('c3', !1), e.classList.contains('c3'))) {
            var o = DOMTokenList.prototype.toggle;
            DOMTokenList.prototype.toggle = function (e, t) {
              return 1 in arguments && !this.contains(e) == !t ? t : o.call(this, e);
            };
          }
          e = null;
        })()
      : (function (e) {
          'use strict';
          if ('Element' in e) {
            var t = 'classList',
              o = 'prototype',
              i = e.Element[o],
              s = Object,
              n =
                String[o].trim ||
                function () {
                  return this.replace(/^\s+|\s+$/g, '');
                },
              a =
                Array[o].indexOf ||
                function (e) {
                  for (var t = 0, o = this.length; t < o; t++) if (t in this && this[t] === e) return t;
                  return -1;
                },
              r = function (e, t) {
                (this.name = e), (this.code = DOMException[e]), (this.message = t);
              },
              l = function (e, t) {
                if ('' === t) throw new r('SYNTAX_ERR', 'An invalid or illegal string was specified');
                if (/\s/.test(t)) throw new r('INVALID_CHARACTER_ERR', 'String contains an invalid character');
                return a.call(e, t);
              },
              c = function (e) {
                for (
                  var t = n.call(e.getAttribute('class') || ''), o = t ? t.split(/\s+/) : [], i = 0, s = o.length;
                  i < s;
                  i++
                )
                  this.push(o[i]);
                this._updateClassName = function () {
                  e.setAttribute('class', this.toString());
                };
              },
              d = (c[o] = []),
              u = function () {
                return new c(this);
              };
            if (
              ((r[o] = Error[o]),
              (d.item = function (e) {
                return this[e] || null;
              }),
              (d.contains = function (e) {
                return -1 !== l(this, (e += ''));
              }),
              (d.add = function () {
                for (
                  var e, t = arguments, o = 0, i = t.length, s = !1;
                  (e = t[o] + ''), -1 === l(this, e) && (this.push(e), (s = !0)), ++o < i;

                );
                s && this._updateClassName();
              }),
              (d.remove = function () {
                var e,
                  t,
                  o = arguments,
                  i = 0,
                  s = o.length,
                  n = !1;
                do {
                  for (e = o[i] + '', t = l(this, e); -1 !== t; ) this.splice(t, 1), (n = !0), (t = l(this, e));
                } while (++i < s);
                n && this._updateClassName();
              }),
              (d.toggle = function (e, t) {
                e += '';
                var o = this.contains(e),
                  i = o ? !0 !== t && 'remove' : !1 !== t && 'add';
                return i && this[i](e), !0 === t || !1 === t ? t : !o;
              }),
              (d.toString = function () {
                return this.join(' ');
              }),
              s.defineProperty)
            ) {
              var p = {
                get: u,
                enumerable: !0,
                configurable: !0,
              };
              try {
                s.defineProperty(i, t, p);
              } catch (e) {
                -2146823252 === e.number && ((p.enumerable = !1), s.defineProperty(i, t, p));
              }
            } else s[o].__defineGetter__ && i.__defineGetter__(t, u);
          }
        })(self)),
  angular.module('template-vsdropdown-0.1.1.html', []).run([
    '$templateCache',
    function (e) {
      e.put(
        'templates/vsdropdown/vsdditemcontent.html',
        '<table class=vsitemcontent><tr><td style=width:18px ng-if=options.input.isObject&&options.input.properties.enabled><span class="icon vsiconproperties" popover-window ng-click=showProperties($event) ng-class="popover!==null?\'icon-down\':\'icon-right\'" tabindex=0></span></td><td class=vsitemtext tooltip-window>{{(visibleBefore ? getPropertyValue(visibleBefore, item) : null)}} {{getPropertyValue(visiblePropName, item)}}</td><td ng-if="id===1" style=width:16px><span class="icon vsiconcross icon-cross" tabindex=0 ng-click="removeItem($index, $event)"></span></td><td class=vsiconcheck ng-if="id===2" ng-show=isItemSelected(item) style=width:22px><span class="icon icon-check"></span></td></tr></table>',
      ),
        e.put(
          'templates/vsdropdown/vsddoverlay.html',
          '<div class=vsoverlay opacity ng-style="{\'opacity\': opacity}" ng-if="showOverlay&&selectedItems.length>1" ng-mouseleave=closeOverlay()><div class=vsoverlaytitle><span class=vsoverlaytitletext>{{selectedItems.length}} {{options.selection.selectionsTxt}}</span> <span class="icon vsiconoverlaycross icon-cross" ng-click=closeOverlay() tabindex=0></span></div><div class="vsselecteditem vsselecteditemcolor" ng-click=$event.stopPropagation() ng-repeat="item in selectedItems track by $index"><div class=vsiteminclude ng-include="\'templates/vsdropdown/vsdditemcontent.html\'" ng-init="id=1"></div></div></div>',
        ),
        e.put(
          'templates/vsdropdown/vsddpopover.html',
          '<div class=vstooltip style=margin-top:-24px;margin-left:24px opacity ng-style="{\'opacity\': opacity}"><table class=vsproperties ng-click=closeProperties();$event.stopPropagation()><tr><th>{{options.input.properties.propertyTitle}}</th><th>{{options.input.properties.valueTitle}}</th></tr><tr ng-repeat="prop in options.input.properties.props"><td>{{prop}}</td><td>{{getPropertyValue(prop, item)}}</td></tr></table></div>',
        ),
        e.put(
          'templates/vsdropdown/vsddtooltip.html',
          '<div class=vstooltip style=margin-top:-20px;margin-left:10px opacity ng-style="{\'opacity\': opacity}" ng-click=closeTooltip($event) tabindex=0><span class=vstooltiptext>{{getPropertyValue(visiblePropName, item)}}</span></div>',
        ),
        e.put(
          'templates/vsdropdown/vsdropdown.html',
          '<div class=vsdropdown ng-click=$event.stopPropagation()><div class=vsplaceholder ng-show="selectedItems.length==0">{{options.filter.filterPlaceholderTxt}}</div><div class=vsselectiongroup><div ng-if="options.selection.maximum>1" ng-include="\'templates/vsdropdown/vsddoverlay.html\'"></div><div class=vsselection ng-style="{\'padding-right\': selectedItems.length>1?\'60px\':\'30px\'}" ng-click=selectorFnc($event)><div class="vsselecteditem vsselecteditemcolor" ng-show="$index===0" ng-click=$event.stopPropagation() ng-repeat="item in selectedItems track by $index"><div class=vsiteminclude ng-include="\'templates/vsdropdown/vsdditemcontent.html\'" ng-init="id=1"></div></div></div><span class=vsselbtngroup><div class=vsbtnselections ng-if="selectedItems.length>1" ng-click=openOverlay()><span class="icon vsiconselections icon-selections"></span></div> <div class=vsbtnselector ng-click=selectorFnc($event)><span class="icon vsiconselector" ng-class="showSelector ? \'icon-up\' : \'icon-down\'"></span></div> <span class=vsselectioncounttxt ng-if="options.selection.showCount&&selectedItems.length>1" ng-click=openOverlay()>{{selectedItems.length}}</span></span></div><div class=vsselector ng-show=showSelector><table style="width: 100%" class=vsfiltergroup ng-show=options.filter.enabled ng-class="{\'vsnohitsfilter\': filteredItemCount===0, \'vshitsfilter\': filteredItemCount>0}"><tr><td><input class=vsfilterinput ng-model=filterText ng-model-options="{debounce: config.FILTERING_BEGIN_DELAY}" data-ng-trim=false placeholder={{options.filter.filterPlaceholderSearchTxt}} ng-keydown=keyDown($event) ng-blur="focusIdx=-1"></td><td class=vsfiltermatch><span class=vsfiltermatchtext>{{filteredItemCount>0?filteredItemCount:options.filter.noHitsTxt}}</span></td><td class=vsiconfilterclear style=width:24px ng-show="filterText.length>0"><span class="icon vsiconclear icon-clear" ng-click=clearFilter() tabindex=0></span></td></tr></table><div class=vsscrollbar vsddscrollbar items=options.items items-in-page={{options.visibleItemCount}} ng-keydown=keyDown($event) ng-focus=focus() ng-blur=blur() list-focus height={{options.visibleItemCount*config.ITEM_HEIGHT+1}} on-scroll-change-fn="onScrollChange(topIndex, maxIndex, topPos, maxPos, filteredPageCount, filteredItemCount, visibleItems)" on-focus-scrollbox-fn=onFocusScrollbox(focused) tabindex=0><div class=vsitem title="{{getPropertyValue(visiblePropName, item)}}" ng-repeat="item in visibleItems track by $index" ng-click="itemClicked($index, $event)" ng-class="{\'vsselecteditemcolor\':isItemSelected(item),\'vsfocuseditemcolor\':focusIdx===$index}"><div class=vsiteminclude ng-include="\'templates/vsdropdown/vsdditemcontent.html\'" ng-init="id=2"></div></div></div></div></div>',
        ),
        e.put(
          'templates/vsscrollbar/vsscrollbar.html',
          "<table class=vsscrollbarcontainer ng-show=\"filteredItems.length>0\" style=border-collapse:separate;border-spacing:0;padding:0;height:100%><tr><td style=width:100%;padding:0;vertical-align:top><div class=vsscrollbarcontent ng-style=\"{'margin': scrollbarVisible?'1px 0 1px 1px':'1px'}\" style=overflow-y:hidden;padding:0;outline:0 ng-transclude></div></td><td style=padding:0;height:100%><div class=vsscrollbar ng-show=scrollbarVisible style=float:right;height:100%;padding:0;margin:1px><div class=vsscrollbox tabindex=0 ng-focus=scrollBoxFocus() ng-blur=scrollBoxBlur() ng-style=\"{'height': boxHeight + 'px'}\" ng-click=$event.stopPropagation() style=position:relative;padding:0;outline:0></div></div></td></tr></table>",
        );
    },
  ]);
var _vsdd = angular.module('vsdropdown', ['template-vsdropdown-0.1.1.html']);
function declOfNum(e, t) {
  return t[4 < e % 100 && e % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][e % 10 < 5 ? e % 10 : 5]];
}
function getCookie(e) {
  var t = document.cookie.match(
    new RegExp('(?:^|; )' + e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
  );
  return t ? decodeURIComponent(t[1]) : void 0;
}
_vsdd.constant('vsdropdownConfig', {
  ITEM_HEIGHT: 36,
  LIST_FOCUS_EVENT: 'vsdropdown.listFocusEvent',
  OPERATION_ADD: '+',
  OPERATION_DEL: '-',
  DOT_SEPARATOR: '.',
  TOOLTIP_OPEN_DELAY: 900,
  FILTERING_BEGIN_DELAY: 500,
}),
  _vsdd.service('vsdropdownService', [
    '$templateCache',
    function (t) {
      this.getTemplate = function (e) {
        return t.get(e);
      };
    },
  ]),
  _vsdd.directive('vsdropdown', [
    '$timeout',
    'vsddsbEvent',
    '$document',
    function (l, c, e) {
      return {
        restrict: 'EA',
        templateUrl: 'templates/vsdropdown/vsdropdown.html',
        scope: {
          options: '=',
        },
        controller: [
          '$scope',
          'vsdropdownConfig',
          function (e, t) {
            (e.config = t),
              (e.filterText = ''),
              (e.showOverlay = !1),
              (e.topIndex = 0),
              (e.focusIdx = -1),
              (e.listFocusEvent = function () {
                e.$broadcast(e.config.LIST_FOCUS_EVENT);
              });
          },
        ],
        link: function (r, e, t) {
          r.selectedItems = [];
          var o = (r.showSelector = !1);
          (r.selectorFnc = function (e) {
            e && e.preventDefault(),
              (r.showSelector = !r.showSelector),
              r.showSelector && (r.listFocusEvent(), (r.focusIdx = 0));
          }),
            (r.openOverlay = function () {
              r.showSelector && r.selectorFnc(), (r.showOverlay = !0);
            }),
            (r.closeOverlay = function () {
              r.showOverlay = !1;
            }),
            angular.element('.b-body__content, .page').on('click', function (e) {
              (r.showSelector = !1), r.listFocusEvent();
            }),
            (r.itemClicked = function (e, t) {
              var o = r.visibleItems[e];
              r.isItemSelected(o) ? r.removeItem(r.selectedItems.indexOf(o), t) : r.addItem(o, t),
                1 === r.options.selection.maximum ? (r.showSelector = !1) : (r.focusIdx = e);
            }),
            (r.addItem = function (e, t) {
              t.stopPropagation(),
                1 < r.options.selection.maximum
                  ? (r.selectedItems.length === r.options.selection.maximum &&
                      r.removeItem(r.selectedItems.length - 1, t),
                    r.selectedItems.push(e))
                  : (r.selectedItems[0] = e),
                a(e, r.config.OPERATION_ADD);
            }),
            (r.removeItem = function (e, t) {
              t.stopPropagation();
              var o = r.selectedItems[e];
              (e !== r.selectedItems.length - 1 && 2 !== r.selectedItems.length) || r.closeOverlay(),
                r.selectedItems.splice(e, 1),
                a(o, r.config.OPERATION_DEL),
                r.clearFilter();
            }),
            (r.isItemSelected = function (e) {
              return -1 !== r.selectedItems.indexOf(e);
            }),
            (r.getPropertyValue = function (e, t) {
              return null === e
                ? t
                : -1 === e.indexOf(r.config.DOT_SEPARATOR)
                ? t[e]
                : ((o = t),
                  (i = e.split(r.config.DOT_SEPARATOR)),
                  (s = angular.copy(o)),
                  angular.forEach(i, function (e) {
                    s = s[e];
                  }),
                  s);
              var o, i, s;
            }),
            (r.onScrollChange = function (e, t, o, i, s, n, a) {
              (r.topIndex = e), (r.filteredItemCount = n), (r.visibleItems = a);
            }),
            (r.onFocusScrollbox = function (e) {
              o = e;
            }),
            (r.keyDown = function (e) {
              o ||
                (13 === e.which || 38 === e.which || 40 === e.which || 27 === e.which
                  ? e.preventDefault()
                  : 38 === e.which
                  ? 0 === r.focusIdx
                    ? (c.setIndex(r, r.topIndex - r.options.visibleItemCount),
                      (r.focusIdx =
                        r.filteredItemCount < r.options.visibleItemCount
                          ? r.filteredItemCount - 1
                          : r.options.visibleItemCount - 1))
                    : r.focusIdx--
                  : 40 === e.which
                  ? r.focusIdx === r.options.visibleItemCount - 1 || r.focusIdx === r.filteredItemCount - 1
                    ? (c.setIndex(r, r.topIndex + r.options.visibleItemCount), (r.focusIdx = 0))
                    : r.focusIdx++
                  : 27 === e.which && (r.showSelector = !1));
            }),
            (r.clearFilter = function () {
              (r.filterText = ''), r.listFocusEvent();
            });
          var i = r.$watch('filterText', function (e, t) {
            e !== t && n();
          });
          var s = r.$watch('options.items.length', function (e, t) {
            e !== t &&
              l(function () {
                n();
              });
          });
          function n() {
            if (r.options.input.isObject) {
              c.filter(
                r,
                (function (e) {
                  for (
                    var t = r.visiblePropName.split(r.config.DOT_SEPARATOR), o = t.pop(), i = 0, s = e;
                    i < t.length;
                    i++
                  )
                    s = s[t[i]] = {};
                  return (s[o] = r.filterText), e;
                })({}),
              );
            } else c.filter(r, r.filterText);
          }
          function a(e, t) {
            angular.isUndefined(r.options.itemSelectCb) || r.options.itemSelectCb(r.selectedItems, e, t);
          }
          r.$on('$destroy', function () {
            i(), s();
          }),
            (r.visiblePropName = r.options.input.isObject ? r.options.input.visiblePropName : null),
            (r.visibleBefore = r.options.input.isObject ? r.options.input.visibleBefore : null),
            (r.selectedItems = r.options.selectedItems),
            r.$watch('options.selectedItems', function (e, t) {
              r.selectedItems = e;
            });
        },
      };
    },
  ]),
  _vsdd.directive('listFocus', [
    '$timeout',
    function (i) {
      return {
        restrict: 'A',
        scope: !1,
        link: function (e, t, o) {
          e.$on(e.config.LIST_FOCUS_EVENT, function () {
            i(function () {});
          }),
            (e.blur = function () {
              e.focusIdx = -1;
            }),
            (e.focus = function () {
              e.focusIdx = 0;
            });
        },
      };
    },
  ]),
  _vsdd.directive('tooltipWindow', [
    '$compile',
    '$timeout',
    'vsdropdownService',
    function (c, d, u) {
      return {
        restrict: 'A',
        scope: !1,
        link: function (e, t, o) {
          var i = null,
            s = null,
            n = null;
          function a() {
            t[0].scrollWidth > t[0].offsetWidth &&
              (s = d(function () {
                (i = angular.element(u.getTemplate('templates/vsdropdown/vsddtooltip.html'))), t.append(c(i)(e));
              }, e.config.TOOLTIP_OPEN_DELAY));
          }
          function r() {
            d.cancel(s), (s = null), angular.equals(i, null) || (i.remove(), (i = null));
          }
          function l(e, t) {
            angular.equals(e, t) || r();
          }
          (e.closeTooltip = function (e) {
            e.stopPropagation(), r();
          }),
            e.$on('$destroy', function () {
              t.off('mouseenter', a), t.off('mouseleave', r), angular.equals(n, null) || n();
            }),
            e.options.showTooltip && (t.on('mouseenter', a), t.on('mouseleave', r), (n = e.$watch('topIndex', l)));
        },
      };
    },
  ]),
  _vsdd.directive('popoverWindow', [
    '$compile',
    'vsdropdownService',
    function (n, a) {
      return {
        restrict: 'A',
        scope: !1,
        link: function (o, t, e) {
          var i = (o.popover = null);
          function s(e, t) {
            angular.equals(e, t) || o.closeProperties();
          }
          (o.showProperties = function (e) {
            e.stopPropagation(),
              angular.equals(o.popover, null)
                ? ((o.popover = angular.element(a.getTemplate('templates/vsdropdown/vsddpopover.html'))),
                  t.append(n(o.popover)(o)))
                : o.closeProperties();
          }),
            (o.closeProperties = function () {
              angular.equals(o.popover, null) || (o.popover.remove(), (o.popover = null));
            }),
            o.$on('$destroy', function () {
              angular.equals(i, null) || i();
            }),
            (i = o.$watch('topIndex', s));
        },
      };
    },
  ]),
  _vsdd.directive('opacity', [
    '$interval',
    function (n) {
      return {
        restrict: 'A',
        scope: !1,
        link: function (e, t, o) {
          e.opacity = e.options.fadeInEffects ? 0 : 1;
          var i = null;
          function s() {
            e.opacity += 0.05;
          }
          e.$on('$destroy', function () {
            angular.equals(i, null) || n.cancel(i);
          }),
            e.options.fadeInEffects && (i = n(s, 10, 20));
        },
      };
    },
  ]),
  _vsdd.constant('vssbConf', {
    ITEMS_IN_PAGE: 6,
    SCROLLBAR_HEIGHT: 0,
    SCROLLBOX_MIN_HEIGHT: 18,
  }),
  _vsdd.factory('vsddsbEvent', function () {
    var e = {};
    function i(e, t, o) {
      e.$broadcast('vsmessage', {
        type: t,
        value: o,
      });
    }
    return (
      (e.setIndex = function (e, t) {
        i(e, 'setIndex', t);
      }),
      (e.setPosition = function (e, t) {
        i(e, 'setPosition', t);
      }),
      (e.filter = function (e, t) {
        i(e, 'filter', t);
      }),
      (e.addItem = function (e, t, o) {
        i(e, 'addItem', {
          index: t,
          item: o,
        });
      }),
      (e.updateItem = function (e, t, o) {
        i(e, 'updateItem', {
          index: t,
          item: o,
        });
      }),
      (e.deleteItem = function (e, t) {
        i(e, 'deleteItem', t);
      }),
      e
    );
  }),
  _vsdd.service('vsddsbService', function () {
    (this.calcIndex = function (e, t, o) {
      var i = 0;
      return this.checkIsMaxPos(e, o) ? (i = t) : 0 < e && (i = this.validateIndex(Math.round((e / o) * t), t)), i;
    }),
      (this.calcScrollPos = function (e, t, o) {
        var i = 0;
        return 0 < e && (i = this.checkIsMaxIndex(e, t) ? o : Math.round((e / t) * o)), this.validatePos(i, o, e, t);
      }),
      (this.validateIndex = function (e, t) {
        return e <= 0 ? 0 : this.checkIsMaxIndex(e, t) ? t : e;
      }),
      (this.validatePos = function (e, t, o, i) {
        return angular.isUndefined(o) || angular.isUndefined(i)
          ? e <= 0
            ? 0
            : t <= e
            ? t
            : e
          : e <= 0 && 0 < o
          ? 1
          : t <= e && o < i
          ? t - 1
          : e;
      }),
      (this.checkIsMaxIndex = function (e, t) {
        return t <= e;
      }),
      (this.checkIsMaxPos = function (e, t) {
        return t <= e;
      });
  }),
  _vsdd.directive('vsddscrollbar', [
    '$filter',
    '$timeout',
    '$document',
    'vsddsbService',
    'vssbConf',
    function (D, E, O, L, M) {
      return {
        restrict: 'AE',
        scope: {
          ngModel: '=?',
          items: '=items',
          onScrollChangeFn: '&',
          onFocusScrollboxFn: '&',
        },
        transclude: !0,
        templateUrl: 'templates/vsscrollbar/vsscrollbar.html',
        link: function (i, e, t) {
          i.filteredItems = [];
          var o = angular.element(e[0].querySelector('.vsscrollbarcontent')),
            s = angular.element(e[0].querySelector('.vsscrollbar')),
            n = s.children(),
            a = angular.isUndefined(t.itemsInPage) ? M.ITEMS_IN_PAGE : i.$eval(t.itemsInPage),
            r = angular.isUndefined(t.height) ? M.SCROLLBAR_HEIGHT : i.$eval(t.height),
            l = 0,
            c = 0,
            d = 0,
            u = 0,
            p = 0,
            h = '';
          function m(e) {
            (e = e.originalEvent).preventDefault(),
              (l = angular.isUndefined(e.changedTouches) ? e.clientY - u : e.changedTouches[0].clientY - u),
              O.on(angular.isUndefined(e.changedTouches) ? 'mousemove' : 'touchmove', f),
              O.on(angular.isUndefined(e.changedTouches) ? 'mouseup' : 'touchend', _);
          }
          function f(e) {
            e = e.originalEvent;
            var t = angular.isUndefined(e.changedTouches) ? e.clientY - l : e.changedTouches[0].clientY - l;
            T(L.validatePos(t, p)), i.$apply();
          }
          function _(e) {
            e = e.originalEvent;
            O.off(angular.isUndefined(e.changedTouches) ? 'mousemove' : 'touchmove', f),
              O.off(angular.isUndefined(e.changedTouches) ? 'mouseup' : 'touchend', _);
          }
          function g(e) {
            e = e.originalEvent;
            (l = e.changedTouches ? e.changedTouches[0].clientY : ''), O.on('touchmove', v), O.on('touchend', b);
          }
          function v(e) {
            (e = e.originalEvent).preventDefault();
            var t = e.changedTouches ? e.changedTouches[0].clientY : '';
            I((t < l ? a : -a) / a), (l = t), i.$apply();
          }
          function b() {
            O.off('touchmove', v), O.off('touchend', b);
          }
          function y(e) {
            var t = e.offsetY || e.layerY;
            T(L.validatePos(t < i.boxHeight ? 0 : t, p)), i.$apply();
          }
          function w() {
            n[0].focus();
          }
          function $(e) {
            (e = window.event || e).preventDefault(), I((e.wheelDelta || -e.detail) <= 0 ? 1 : -1);
          }
          function x(e) {
            (38 !== e.which && 40 !== e.which) || (e.preventDefault(), I(38 === e.which ? -a : a));
          }
          function k(e, t) {
            var o = (i.$parent.options.filter.filterFunc && i.$parent.options.filter.filterFunc.bind(e)) || e;
            (i.filteredItems = '' === e ? i.items : D('filter')(i.items, o)),
              (i.scrollbarVisible = i.filteredItems.length > a),
              i.$parent.options.filter.filterSort &&
                ('function' == typeof i.$parent.options.filter.filterSort
                  ? (i.filteredItems = D('orderBy')(i.filteredItems, i.$parent.options.filter.filterSort.bind(e)))
                  : (i.filteredItems = D('orderBy')(i.filteredItems, i.$parent.options.filter.filterSort))),
              C(),
              S(t, !1);
          }
          function C() {
            var e = Math.floor(r / (i.filteredItems.length / a));
            (i.boxHeight = e < M.SCROLLBOX_MIN_HEIGHT ? M.SCROLLBOX_MIN_HEIGHT : e),
              (d = i.filteredItems.length - a < 0 ? 0 : i.filteredItems.length - a),
              (p = r - i.boxHeight < 0 ? 0 : r - i.boxHeight);
          }
          function T(e) {
            (e = Math.round(e)) !== u && ((u = e), (c = L.calcIndex(u, d, p)), P());
          }
          function S(e, t) {
            ((e = L.validateIndex(e, d)) === c && t) || ((c = e), (u = L.calcScrollPos(c, d, p)), P());
          }
          function I(e) {
            S(c + e, !0), i.$apply();
          }
          function P() {
            var e;
            n.css('top', u + 'px'),
              (e = {
                topIndex: c,
                maxIndex: d,
                topPos: u,
                maxPos: p,
                filteredPageCount: i.filteredItems.length / a,
                filteredItemCount: i.filteredItems.length,
                visibleItems: i.filteredItems.slice(c, c + a),
              }),
              i.onScrollChangeFn(e),
              (i.ngModel = e);
          }
          function A() {
            (r = o.prop('offsetHeight')), s.css('height', r + 'px'), C();
          }
          (i.boxHeight = M.SCROLLBOX_MIN_HEIGHT),
            (i.scrollbarVisible = !0),
            n.on('mousedown touchstart', m),
            o.on('touchstart', g),
            s.on('click', y),
            n.on('click', w),
            o.on('mousewheel DOMMouseScroll', $),
            s.on('mousewheel DOMMouseScroll', $),
            n.on('keydown', x),
            i.$on('vsmessage', function (e, t) {
              'setIndex' === t.type && t.value !== c && 0 <= t.value
                ? S(Math.round(t.value), !0)
                : 'setPosition' === t.type && t.value !== u && 0 <= t.value
                ? T(L.validatePos(Math.round(t.value), p))
                : 'filter' === t.type
                ? k((h = t.value), 0)
                : 'addItem' === t.type && 0 <= t.value.index && t.value.index <= i.items.length
                ? (i.items.splice(t.value.index, 0, t.value.item), k(h, c))
                : 'updateItem' === t.type && 0 <= t.value.index && t.value.index < i.items.length
                ? ((i.items[t.value.index] = t.value.item), k(h, c))
                : 'deleteItem' === t.type &&
                  0 <= t.value &&
                  t.value < i.items.length &&
                  (i.items.splice(t.value, 1), k(h, c));
            }),
            i.$on('$destroy', function () {
              n.off('mousedown touchstart', m),
                o.off('touchstart', g),
                s.off('click', y),
                n.off('click', w),
                o.off('mousewheel DOMMouseScroll', $),
                s.off('mousewheel DOMMouseScroll', $),
                n.off('keydown', x);
            }),
            (i.scrollBoxFocus = function () {
              i.onFocusScrollboxFn({
                focused: !0,
              });
            }),
            (i.scrollBoxBlur = function () {
              i.onFocusScrollboxFn({
                focused: !1,
              });
            }),
            (i.filteredItems = i.items),
            0 === r ? E(A, 0) : (s.css('height', r + 'px'), C()),
            S(0, !1);
        },
      };
    },
  ]),
  (function () {
    var e = {
      exports: null,
    };
    function t(e) {
      var t = [],
        o = 0;
      if (
        ((this.trie = this.createTrie(e.patterns)),
        (this.leftMin = e.leftmin),
        (this.rightMin = e.rightmin),
        (this.exceptions = {}),
        e.exceptions)
      )
        for (t = e.exceptions.split(/,\s?/g); o < t.length; o += 1)
          this.exceptions[t[o].replace(/\u2027/g, '').toLowerCase()] = new RegExp(
            '(' + t[o].split('‧').join(')(') + ')',
            'i',
          );
    }
    (t.prototype.createTrie = function (e) {
      var t,
        o = 0,
        i = 0,
        s = 0,
        n = 0,
        a = null,
        r = null,
        l = null,
        c = null,
        d = {
          _points: [],
        };
      for (o in e)
        if (e.hasOwnProperty(o))
          for (t = e[o].match(new RegExp('.{1,' + +o + '}', 'g')), i = 0; i < t.length; i += 1) {
            for (a = t[i].replace(/[0-9]/g, '').split(''), r = t[i].split(/\D/), c = d, s = 0; s < a.length; s += 1)
              c[(l = a[s].charCodeAt(0))] || (c[l] = {}), (c = c[l]);
            for (c._points = [], n = 0; n < r.length; n += 1) c._points[n] = r[n] || 0;
          }
      return d;
    }),
      (t.prototype.hyphenateText = function (e, t) {
        t = t || 4;
        for (
          var o = e.split(
              /([a-zA-Z0-9_\u0027\u00DF-\u00EA\u00EC-\u00EF\u00F1-\u00F6\u00F8-\u00FD\u0101\u0103\u0105\u0107\u0109\u010D\u010F\u0111\u0113\u0117\u0119\u011B\u011D\u011F\u0123\u0125\u012B\u012F\u0131\u0135\u0137\u013C\u013E\u0142\u0144\u0146\u0148\u0151\u0153\u0155\u0159\u015B\u015D\u015F\u0161\u0165\u016B\u016D\u016F\u0171\u0173\u017A\u017C\u017E\u017F\u0219\u021B\u02BC\u0390\u03AC-\u03CE\u03F2\u0401\u0410-\u044F\u0451\u0454\u0456\u0457\u045E\u0491\u0531-\u0556\u0561-\u0587\u0902\u0903\u0905-\u090B\u090E-\u0910\u0912\u0914-\u0928\u092A-\u0939\u093E-\u0943\u0946-\u0948\u094A-\u094D\u0982\u0983\u0985-\u098B\u098F\u0990\u0994-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BE-\u09C3\u09C7\u09C8\u09CB-\u09CD\u09D7\u0A02\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A14-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A82\u0A83\u0A85-\u0A8B\u0A8F\u0A90\u0A94-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABE-\u0AC3\u0AC7\u0AC8\u0ACB-\u0ACD\u0B02\u0B03\u0B05-\u0B0B\u0B0F\u0B10\u0B14-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3E-\u0B43\u0B47\u0B48\u0B4B-\u0B4D\u0B57\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C02\u0C03\u0C05-\u0C0B\u0C0E-\u0C10\u0C12\u0C14-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3E-\u0C43\u0C46-\u0C48\u0C4A-\u0C4D\u0C82\u0C83\u0C85-\u0C8B\u0C8E-\u0C90\u0C92\u0C94-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBE-\u0CC3\u0CC6-\u0CC8\u0CCA-\u0CCD\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3E-\u0D43\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D60\u0D61\u0D7A-\u0D7F\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB2-\u1FB4\u1FB6\u1FB7\u1FBD\u1FBF\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD2\u1FD3\u1FD6\u1FD7\u1FE2-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u200D\u2019]+)/g,
            ),
            i = 0;
          i < o.length;
          i += 1
        )
          -1 !== o[i].indexOf('/')
            ? 0 === i || i === o.length - 1 || /\s+\/|\/\s+/.test(o[i]) || (o[i] += '​')
            : o[i].length > t && (o[i] = this.hyphenate(o[i]).join('­'));
        return o.join('');
      }),
      (t.prototype.hyphenate = function (e) {
        var t,
          o,
          i,
          s,
          n,
          a,
          r,
          l,
          c,
          d = [],
          u = [],
          p = e.toLowerCase(),
          h = Math.max,
          m = this.trie,
          f = [''];
        if (this.exceptions.hasOwnProperty(p)) return e.match(this.exceptions[p]).slice(1);
        if (-1 !== e.indexOf('­')) return [e];
        for (t = (e = '_' + e + '_').toLowerCase().split(''), o = e.split(''), r = t.length, i = 0; i < r; i += 1)
          (u[i] = 0), (d[i] = t[i].charCodeAt(0));
        for (i = 0; i < r; i += 1)
          for (a = m, s = i; s < r && (a = a[d[s]]); s += 1)
            if ((l = a._points)) for (n = 0, c = l.length; n < c; n += 1) u[i + n] = h(u[i + n], l[n]);
        for (i = 1; i < r - 1; i += 1)
          i > this.leftMin && i < r - this.rightMin && u[i] % 2 ? f.push(o[i]) : (f[f.length - 1] += o[i]);
        return f;
      }),
      (e.exports = t),
      (window.Hypher = e.exports),
      (window.Hypher.languages = {});
  })(),
  (jQuery.fn.hyphenate = function (o) {
    if (window.Hypher.languages[o])
      return this.each(function () {
        for (var e = 0, t = this.childNodes.length; e < t; e += 1)
          3 === this.childNodes[e].nodeType &&
            (this.childNodes[e].nodeValue = window.Hypher.languages[o].hyphenateText(this.childNodes[e].nodeValue));
      });
  }),
  (function () {
    var e = {
        exports: null,
        exports: {
          id: 'ru',
          leftmin: 2,
          rightmin: 2,
          patterns: {
            2: '1г1ж1м1п1ф1ц1ш1щъ1ы1ь11э1ю',
            3: 'а1ба1да1еа1иа1ка1уа1ча1я1баб1вбг21бе2бжб1л1боб1т2бф2бц2бш2бщ1бы1бь1бя1вав1дв1л2вмвф22вц2вш2вщвъ21вы1вяг2а2ггг2и2гп2гф1дадв21де1дид1л1до2дп1ду2дфд1х2дщ2дъ1ды1дяе1а2ебе1ее1и2еоеэ2е1яжг2ж2м2жф2жц2жъ2зг1зе1зиз1лз1н2зт1зу2зцз1ч2зш1зы1зяи1аи1еи1ии1ки1л2ипи1ри1ти1чи1я2й1йд2йя12кг1ке2кмк2о2кп2кск2у2кф2кц2кш1кьк2ю2лб1ли2лм1ло2лпл1т2лцл1чл2ю1ля2мж2мм2мп2мф2мц2мщ2мэм2ю1на2нг1не1нин1л1но1нун1х2нц2нш2нщ1нын2э1няо1вог2о1ео3и2ойо1ко1т2оюо1япе1пх22пц2пш2пщ2рг2рз2рм2рп2рф2рх2рц2рш2рщ2рър2ю1сасг2с1зс2мс1н1сосп21ср1сусч2сш21сы1ся2тг2тжтм22тф4тц2тщ2тъ2ть2тэт2юу1ау1еу1иу1оу1у2уэу1я2фгф4и2фм2фф1ха2хг1хе1хи1хохп22хшца12цгци12цм3цу2цц3цыцю11чач1в1чеч2ж1чи1чм3чо1чуч2хш2в2шм2шфш1х2шц2шь2щмъю2ъя2ые2ыи2ыу2ьб2ь2еь2оь2юь2яэ1в2эгэ2мэ2нэ2пэс1э2фэх2э2цэя2ю1аю1бю1вю1ею1ию1к2юмю1хю1чю1яя1ея1ия1кя1ля1уа1ё1бё1дёе1ё2ёб1зёи1ё1кё1нёо1ёпё1у1ё1чёь2ёю1ё',
            4: '_аи2_ау2_ии2_ио2_ис3_ль2_оз4_ск2_ст2_уб2_уд2_уе2_ук2_уо3_уп2_ус2_ую2_юс14а3ааа2паа2раа2ца3буав1ва1веа1виа1воа2вта1вуа2вх2агаа2гд2агоа3гу2адва2длад2цае2ла2епае2сазв2азг2аз1ра2ихак1в1аккак2лак1са1лаа1леа3лиа1луа1лыа1лю2амаамб42амоа2мчан1ра1нь2а1оао2дао2као2рао2с2апоа1раа1реа1риа1роа1руар1ха1рыа1рюа1ряа1таа1тиа1тоа1туат2ха1тыа1тюа1тяа2убау2дау2хау2чауэ1ах2аах3с2ачаа2члач1та2шла2эрая2бая2вая2зба1зба2о2б1ббвы22б1д3бев3бее3бец2бещб1з21б2и3биаби2б2биж3бик3биоби1х2б3к2блы2бля2б3н3бот2бр_2брсб1ру2брьб1ряб3скбс4л1б2убу1с2б1х2б1чбы2с2бь_2бьс2бьтбэ1р3б2ю3вагва1звах13вац3вая2в1бв1вив1вр2вг21вев3вег1вее1вез1вес1вец1вею1веявзг2взд2взъ21визви1овиу3ви2ф2в1квк2лв2ла2вли2влю2вля1вме2в1нвно1в3нывов21вод1воквоп21вох1вою2вп22вр_1врюв1ряв1т21вуаву3г2вуиву3п1вхо2в1чвып2вых22вь_1вье2вьс2вьт1вью1вья1в2юга1зга2у2г3бгба2г1ви3ге_2г3ж2г1з2г1кг1ле2г3мг3няго1з3гойг2ол3гою2гр_2грюг4саг4сб2г3тгу1вгу1с2г1ч2г3ш2г3эда1зда2о2д1бд1ве1двид3вкд1вл2двя2дг23дез2дж_2джсдип2диу3ди1х2д1к2д1нд3надо1здоп2до1с2др_д1ред1рид1рыд1рядск22д1тду3гду2оду1х2дцу2дцы2д1ч2дыг2дыд2дыт2дыщ2дь_1дье2дьк2дьт1дью1дья1д2юеа2деа2зе1вее1вие1вое2вте1вуе1вхе1вьег2дед2жее2хе2жг2ежее3зее3зяеи2деи2меи2ое1каек2зе1кие1куе1лае1лее1луе1лые1люе3ляе2мче3наенс2е1нэе1оде2оие2омеоп2еос22епее2пле4пн2епое4пте1рае2рве1рее1рие1рое1руе1рые1рюе1ряе1сге1ск2есле3со2еспе1сте1тае1тие1тоет1ре1туе1тые1тюе1тяе1у22еубеуз2еф2л2ецве1чле2шлею2гея2зжа1з2ж1в2жгаж2гиж2гу2ж1дж2диждо3жду14ждь3жев2жжаж2жежи1о2ж1к2ж1лж3ма2ж1нжно1жоу32жп2жпо1ж2ру2ж1с2ж1ч2жь_2жьс2жьт1за1заа2заб2заг4зап2зас2зат2зау2зах2зая2з1б2з1вез1виз1воз1вр1звуз1вьз3га2зж2з3з23зи_3зис3зич2з1кзко12зм2з3мн2зне2зно2зну1зов1зое1зои1зон1зоозос21зохзош21зоэ1зоюз1раз1роз1руз2рюз1ря2з1сз1ти3зу_зу1в3зуе2зупзы2з2зыщ1зье1зьи1зью3зья1з2юи2аби2авиаг2иао2и2апи2аф2и1би1вии1ву2ивыиг2ди3ге2игли2гни1двид1ри1дьие2гие2дие2ри1зоиз1рийс2и3кои3куилп2и2ль2имаи3мии2мчинд21инжинс21инф1инъи1оби2оги1оди1ози1они1ори1ошип3ни2рви2рж1ирри2сби2сдис1ки4сси1сти2тми1у2иу3пиф1ли2фри1хуи2штию4лию2нию2тия2дйно1йп2лй2сбй2снй2сшй2тмй2хм1кавк2ад1кае1кай1кам1кан1кат1ках1каю2к1бк1вик1ву2к1дкда22кеа2к1з1кивки1о1киткк3ск3лы2кль1клю2к1н1ков1код1коз1кос1кош2кр_кс3гкс3мк3сок3су2к1ткт2р3куе1куй3кум1кур1кут2к1ч1ла_1лаел2аклау11лаял1брл1вел1вил1вол1вул2гллго11ле_1лен1лехл1зо2л1клк2в2л1лл2льллю12л1нлс3б1лу_лу1влу3г1луе1лунлу1с1лую1лы_1лые1лыж1лый1лым4ль_2льд3лье3льи2льк2льм2льн3льо2льт2льц2льч3лью3лья1лю_1люж3ля_2ляд3лям3лях3магма2умаф23мач4м1бм3бимб2л2мг22м1д3мкн2м1л2м1н3мод3мон3моп3мофмп2л2мрим1ры2м1смс2кмс2н2м1тмфи32м1х2мш2мым1мы2с2мь_2мьсмью1мэ1рмя1р2нач2нащ3ная2н1внг4лнг2р2н1днд2жн2длн2дцнег23недне3енеи23неунея23нийниу3ни1х3ниц3нищ2н1кнк2внк2лнк1с2н1нноб2ноэ2н3п2н1ро2н1сн2сгн2слн2сн2н1тн2тмну1х3ную2нф2нхо12н1чн2члнш2т3ны_2нь_1нье1ньи2ньк1ньо2ньс2ньт2ньч1нью1нья1н2юо3авоап12оба1обмоб1р1объ2обьов2то2вхо1дьое1бое2дое1оое2цо1зооие3ои2зои2мои2оойс2ок2в1окто3лао1лео3лоо1луо1лыо1люо3ляо3ма2омеом2чо2мьо3наонд2о1нронс2о1о2о2оло2офо1рао1рео1рио1ро2орцо1рыо1рюо1ряос2бо1ст2осхотв21отг1отдо3тио2тм1отхо1у2оуп2о3фе2охио1хро1хуо2цооч2ло1чтош2тоя2воя2доя2зпа3ф2п1дпе2з4п3к2пл_2п1нп3нап3ны3пой2пп22пр_при12прсп2руп3со2п1тп3ту3пуб2пф24п3ч2пь_2пьтп2ю11ра_раа21раю1рая2р1бр1вир1вор1вьр2гвр2гнрг2р2р1дрд2жр2длр2дц1ре_р1зори3ариб2р2ин1риу1риц1риш2р1кр2кврк1ср2льрлю1р3ляр2мч2р1н1ро_1роу2р1р4р1срс2кр2снрс2п2р1тр2тм1ру_1рулрф2лр2хврх1лрх1рр2цв2р1чр2члр2чмрш2т1ры_1рыб2рыз1рым2рь_1рье1рьи2рьк2рьс2рьт1рью1рьярэ1л1рю_1рюс1ряю1сб2с2бы2сбю1с2вс2гис2гнс2го1сд2с2дас2дес3дис2до1с2е1с2ж1с2и3сизси1х4ск_ск2л2скнск2рск1с2сль2снос2овсо1дс3пн2спь2ср_2с1сс2сбсс2лс2снсс2псст2сс2ч2ст_2стбс2те1сти2стк2стм2стн2стп2стс2стф2стц1стыс4тьсу2бсу1всу2зсу1хс1х22сца2сцо1счас1чл2счос3шн1съ2сы2зсы2с2сь_1сье2ськ2сьт1сью1сьясэ1рс2эс1с2юсю1с2сяз1тагт2ан1тас1тащ2тв_2тви2тву2твы2твя2т1д1т2ете1д2т1зтии2тик23ткн2т1лт2льт3мщ2т1нто1д1тощ2тп22трб2трв2трг2трд2трм2трн2трп2трр2трф2трщ2трът1рыт2сб2т1тт2тм1тущ2т1х2т1ч2тш24ть_3тье3тьить2м4тьттью1тю1т1тяг1тяж1тяпу2асуб1ру1виув2лу1воу1вуу2гву2глу2гнуд2ву3дууе2дуе2луе1суе2ху2жжу1зоу1каук1ву1киу1коу1лау1леу1луу1люу2мчу3нау1ньуо2буо2вуо2куо2пуо2суо2фу2плу1рау1реу1риу1роу3руу1рыу1рюу1ряу1сгус2лу1сму2снус2пус3су1сф2усцу2счу2сьу1тау1тиу1тоу1туу1ты1утюу1тяууг2уу2су3фиуф1лу2фру2хвух1лух1р1учру1чьу3шеу3шиу2шлу2шпуя2зфа2х3фашфаэ12ф1б2ф1в2ф1дфи2жфи1о3фит2ф1кф2лаф2лиф2ло2ф1н3фон3фотф1риф1роф1ру2ф3с2ф1тф2тм2фуф2ф1ч2фш22фь_ф2ю1ха2дхао32х1б1х2вх3вых3д2хео3х1з2хие2х1к2х1лу2х1нхоп2хоф2хоя2х1рых1ря2х1т1ху_2хуе2хуй1хун1хус1хуш2хуюх1х2хью13ца_3цам3цах2ц1бц2ве2цвы2ц1дце1зце1кце1т2ц1зцип2циу32ц1л2ц1н2цп22ц1р2ц1с2ц1тцы2п2ч1б2ч1дче1очжо23чик3чиц2ч1кч2ле2чли2чма2чмеч2мо2ч1н2ч1сч2те2чтм3чук2ч1ч2чь_1чье1чьи2чьс2чьт1чью1чья2ш1бше1кш1лыш2лю2ш1н4шниш2п2ш3пр2ш1р2ш1сш1ти2штс2ш1ч4шь_3шье3шьи3шью3шьяш2ю1щеи2ще1сще1хщеш22щ1н2щ1р2щь_ъе2гъе2дъе2лъе2съя3ны2блы3гаы3гиыг2лы2гны2длыз2ды2злы2зныиг1ык2лык1сы2льы2мчы3поыр2вы3саы3сеы2сны3соыс2пы2схыс2чы2сшыт2ры3шьь2вяь2дцье1кь2знь2и1ь2кльмо1ьс2кь2снь2тмьхо2ь2щаь2щеь2щуья1вэв1рэд1рэк1лэкс1э3маэ3ньэо2зэ1реэ1риэ1руэ1рыэск2эс3мэ2соэ2теэхо3ю2бвю2блю1дьюз2гю1зою1лаю1лею2лию1люю2мчю2нью1о1ю1раю1рею1рию1рою1рую1рыю1тию1тою1тую1тыю2щья2бря1воя1вуя2гняд1вяд1ря1зояк1ся2лья2мья3наянс2я1рая1рия1роя1рьяс1кяс1ляс2тя1таят3вя3тия1тоя1туя1тыя1тяях1ля1хуяце1я2шл2яю_2я1я6зь_й2кь6тр_а1вёа1лёа1рё1веё1вёз1вёс1вмё1вьёг1лёд1вёд1рё1дьёе1вё2ежёе3зёе1лё2епёе1рёё1веё1воё1ву2ёжеё3зеё1каё1киё1куё1лаё1леё1луё1лыё2мчё3наёнс22ёпеё2плё4пн2ёпоё4птё1раё1реё1риё1роё1руё1рыё1ск2ёслё3соё1стё1таё1тиё1тоёт1рё1туё1тыё1тюё1тя3жёвж2жёз1вё2знё3зуё1каё3куё1лён1лёх1луё3льёне3ё1ньёо1лё2омёо1рёо3фё1рьёс2дё1с2ёс2тё1сьё1т2ё3тьё_уё2у1лёу1рёу3шёц2вёч2тё1чьё3шьёы3сёь2щё_не88не_8бъ_8въ_8гъ_8дъ_8жъ_8зъ_8къ_8лъ_8мъ_8нъ_8пъ_8ръ_8съ_8тъ_8фъ_8хъ_8цъ_8чъ_8шъ_8щъ_',
            5: '_аб1р_ади2_ак1р_би2о_го2ф_дек2_ди1о_до3п_епи3_за3п_иг1р_изг2_из3н_ик1р_ле2о_на1в_на3т_не3т_ово1_ог3н_ос2п_от1в_ри2ч_ро2х_су2ж_тиа3_ти2г_ти2о_ум2ч_ур2в_ут2ра3блааб2люаб1риав3зоави2ааво1са2вотав1раав2сеа2глеаг2лиа2двеад2жиад1роаду3ча2дынае2гоае2диае2реаз1влаз1драз1обаи2г1аи3глако3т2акриа3лаг2алекало1залу2ша2льщ2аметамои2а2нафан2спанс1уаост1а3плаап2ра1аргуар2жа2ас1кас3миас3ноа1сьи1атакат3ваат1виат1ву2атезато2шат1риа1тьеа3тьюа3тьяау3доа2улеаут1рау3чьа2ф1лахми2аэ2лиаю1таба2бвба2дрба3зубалю1бас3мба1стба1трбе2глбе2гн3бе2збе3зибез3нбез1рбес3пби2обби2одби2онби2орби2тв1благб2ланб3ленб2луд2б2льб2людб2люеб2люлбо3вшбо2гдбо1з2бо2мчбо3мшбону1бо1рубо2сабо1скбо2твбот2рбоя2рб3рабб2равб2ран1брасб1рахб1рейб1рекб2ремб2рехб2ридб1рол1б2рю2б1с2бук1лбы2г1быс1кбыст1бю1тава2брвадь2ванс2ва1ства1трв2дохвед1рве3ду3везе3везлвез2у1вей_ве2п12вердвет3р1в2з2взо1бви2азви2акви2арвиа1тви3афви2гвви2гл1винт1винчв2левв2лекв2летв2лечв2лияв2люб4в3нав2несв3ну_во1б2во3вкво1двво1дрво2ерво2жжво3м2во1ру2ворц2ворьвос1кво1смво1снвот2рво1хл2вра_в2равв1рас2врац2вре_1вридв1риив1рикв1рилв1рисв1рит2в1ро2в1ры2в1с23все33в2сп3в2сювто3ш1ву1з2ву1кву1с2вух3вву1члвы3г2вы3знвы3т21вьин1в2э1г3дан2г3диге2б1гено1ге2обге2одге1орги2блги3брги2грги1слгист22гла_г2лавг1лай2глаяг2лет2гли_г2лин2гло_2глов2глог2глое2глой2глою2глую2г1лыг2ляж2глякг2навг2нанг3не_г2невг3ненг3непг3несг2нирг2ноег2ноиг2носго1б2го2влго2злгоз2нгоиг2гоми2го2сдго1сн2готдгоу3тго1члг1раег1райг1рарг1регг1рекг1рецг1рикг1рилг1ринг1рисг1ричг1ровг2розг1рокг1ронг1ропг1ротг1рофгру2пг1рывг1ряег1рялг1рят2г3с2да2б1да2грдат1р2двиз2дводд1воз2д1д23деврде2зиде2зудеио2де1кл3демеде2оддео3пде3плдес2кде2срде1хлд2жамд2ж3м2д1з2ди2аддиа2зди2арди2асди2обди2ордио1сди2пиди3птди3фрд2лев2д3м2днеа2днос24д3ныдо2блдов2лдо1д2до3дндоз2ндои2р2доктдо3плдос2п2дотд2дотл2дотъдо3ть3дохлдо2щуд1рабд1рард1рахд1рачд2раюд2реб2дрезд2релд2ремд2рий2дринд2рипд2рихд1родд1роед1ройд1ролд1ронд1росд1ротд1роюд1руб1друг1дружд1румд1рую2дрывд2рябд2рях2д1с2дс3кндуб3р2д1удду2дадуп1лдус1кд1услду1стду2чидуэ1т2д3це2д3ш2дъе2м2дымедь3яреади3еа3доеат1реба2се1браеб1рие1броеб1ры2евер2еволев1риев2хое2глее2глие2глоег2наег2но2ег2ред1вое1джее2дохе1друе2дуге2дусе2дынее2гиее1с2ее2стеж3дие2ж1резау3езд1реззу3е3зитез1обе1зомез1опез1отез1ошез2ряез1упез1усеи2г1еис1лека2б2е1ко2е1крек2роек1скеми3кемо1с2емуж2емыс2е1нрен3ш2е1о2бео3даео2деео2дое1о2жео3кле1ол_е1олаео3лие1олке1олые1олье1он_е2онае2ониео3ное1онсе1опеео2прео4пуео1ске1осме1оснео3схе1отле1о2че1о2щепат2е3плаеп1луе3плые4п3сер1вее3ре_ере3перо2б2еролер3ске3с2аес2бае2скее1слуе1слые1с4ме2спуе2стле3стует1веет1вие1тво2етечето1сет2ряе1тьее3тьюе3тьяеуб3реф1рееха2тех1обех1реех1ружа2блжа2бржат1в2ж1б23ж2глж2дакж2дачж2деп4ж2дл3ж2дяже3д2же1клже1о2же3п2же1с2же3ск2жжев2ж1з22жирр2ж3мо2ж1обжоу1сз1авуз1адрзае2дзае2хза3з2з1акт3з2анза3назанс2зар2взар2жзаст2за3ткзач2тза3ш2з2вавз2ван2зваяз2везз3в2кз1вла2зволз2глизг2наз2гнуз1д2вз2дешздож3зе2б1зе2евзе2од3зий_з1интзи2оззи1опзиу3мз2лащз2лобз2лопз2лорз2лющ2зна_з2навз2наез2найз2накз2нанз2натз2наю2зная2з3ни2з3ныз2обезо2бизо2глзо1дрзо1з21зой_1зок_з1окс1зол2зо1лгзо1лжзо3м21зом_2зомн2зонрзо2осзо2паз2оплз2опрз1оргз1оснзо1спзо2твз2отез1откз2отозо2шиз2ракзра2сз2рачз2ренз1ресз2риш2зуве2зу2г2зу1к3зумезу2прз1урбзъе2м2зыме2зымчи2агри2адеи2адииа2муи3анаианд2и3атуи2а1хиа2цеи2б1р2иваж2и1веи2в3з2и1вои1в2ри3в2сив2хои2глеи2глиигни3иг1роиг1руиг1рыи2дейи1д2жие3деие2зуи3ениие1о2иепи1и3ж2диз1в21из1дизо2ои3к2аик2ваи2квии2кляик1роик1скильт2имои2им3пли2м1рим2чаино1с1инсп1инсуио2боио2врио2деио3зои1окси1олеи1опти3ораио1руио2саи1отаи1отки1отсиоуг2ио2хоипат2ип2ляириу3ис3кеис3киис1лыис3меис3муис3нои2стли1сьиита2вит3ваит1виит1вуи2т1ри3тьюи3тьяиф2люиха3ди3х2оихо3ких1реих1рииш2лии2шлыию3тай2д3вй2о1сйо2трй3скайс2кейс4мой2с3фйх2с3ка2блказ3нка1зо1кал_1кало1калс3к2аска1стк2вакк2васк2вашк2возке2глкед1ркиос1ки2пл2к1к22клемк3ленк1леок2ликк2линк3лияк2лозк3ломкло3т1клук2кля_2клям2кляхк2ноп3ковако1др3конскоп2рко1руко1сккос3мко1сп1котнко2фрк1релкре1ок1реч1крибк1ридк2ризк2ритк1рихк1роак1робк2роек1рокк1роок1рорк1роск1рофк1рохк1роэкру1ск1рядк2с3вк2с3дк2сибк1скикс1клк1скокс3тек1стокс1трк1стукта2ккто1ску1ве1кулякуп1лку3рокус1кку1стку3ть1куче1куют3кующ2к1х22лабела2бл2лагола2грла1золак2р1лам_ла2усла2фр1ла1х2л3д2ле1влле1джле3доле1зрлек1л2лемнле2сбле2скле1твле1хрлиа2м3ливо3ливылиг2ллие3рли2кв2лимплио1сли2пллис3мли2твлиу3мли1хлли1хрл2к1ллни2ело2блло2влло1др2лоенло1звло2клло2рвло1рулос1к2лотдлот2рло2шл2л1с2лу1брлу1знлу1крлуо2длу3ть2л3ф22л1х2л2х3в1лых_2льск1льща1льще1льщу1люсьлю1таля1ви3ляво3лявыля1реля1рума2взма2гнма2дрма2дьма1зомас3лма2чтм3бля2м3в23м2глмеан2ме2егме2елме1зомеч1т2м1з2ми1зв2миздми1знми2крми2озми2ор2м1к2м2леем2лел4м3намне1д4мноем2нож4мной4мномм2нор4мноюм2нут4м3нымо1б2мо3влмо1дрмо2жжмо1звмо1зрмо3м2мо1румо1сммо1сн3мотим1раб2м1рому1стмут1рму3тьм2чавм2чалм2читм2чиш3м2щемы2мрмя1стнаб2рнаг2нна3ждна1з2на2илна2ин4наккнап2лна1с2на1твна1х2наэ1р2н1б2н2г1внги2онго1сн2дакн2д1внде3знде2сн3д2знд2рен2дрянд2спне1б22невннед2оне3дунее2дне1звне1знне1зоне1зрне1клне2олне3п2нес2кнест2не2фрне1хрне3шк2н1з2нзо1сни3б2ни2енни2клнила2ни1слнис3пнкоб2но1брно2влно1двно1дрно2ерно1звно2здно1зрно3кн3номеном3шно2рвно1руно2сч2нотдно3ф22н1ре2н1рин2с3внс2кен3слан2с3мнст2рнсу2рн2с3фн2съ3н2т1внт2рант2рент2рунт2рынут1рня1ви2о1а22обиоо1блюобо2с2обото3влаов3ноов2се2о3гео3гря2одано3де_о2дыно2дьбое2жиое1с2ое2сто2етоо3жди2озавоз2вио1здрозе1ооз3но2озоно2зопоз1уго2зымо3зысои2г1оиг2нои3мо2ок2ло3клюоко1бок1ск2окти2окумом2блом1риом2шео3мьяоно1боо3псоос3мо2отио3пако3паро2плиоп2лоо2пляоп2риоп2тоо1р2вор2тро1руео1руко1русо3садо2скеос1кио1с2лос3миос2пяос2свос2тао2сучо1с2чот3ваот1веот1виот1вло3терот1риот3смоту2ао3тьюо3тьяоус2коу3таоу3то2офаш2офит2офон2офото2фриох1лыо2хляох2ме2охороча1соч1лео3члиош3ваош2лаоэ1тиоя2рипави3пав3лпа2вьпа2дрпа2енпа1зопас1лпа2унпа1хупа2шт2п1в2пе2двпе3запе3зопе2льпе4плпе2снпе2сцпе2счпе2трпе2шт3пинк3пися4пла_пла1с2пленп1лею2плив2пло_2плов2плог2плый2плымп1лынп1лых2плю_п1лютп2лясп2ляшп3но1по1б2по3влпое2лпое2хпо1знпои2щ3полкп1оргпор2жпо1рупо1с43послпо3сспот2впот2рпо1х2поэ3мппо1д3превпре1зпрей2пре1л3претпри3вприг2при3кпри3лприп2п2риц3проипро3п2п1с2п3синп2т3впуг3нпу1стпу3тьпэ1рара2бл1рабора2гвра2глрад2жра2дцрак2в1ралг1рамк1рамн1раслрас3прас1трат1в2рахи1ращи2раятрб2лар2блерб2лорб2люрбо3ср3вакр3варр3вежр2вео1рветр3винр2витр2г1лрда1ср2д1врди2ардос2ре1вррег2нрее2врее2дрее2л1резкре1зррез2у1рейш1рекш3ремо1ренк1реньре1онре1опре1ох1репьре3р2ре1слре1счре1твре1чтре3шлр3жа_р3жамр3жанр3ж2др1з2ври3бр2риги2риджрие2лрие3рриз2врик2р1ринсрио2зрио2сри1отри3р2ри1с2ри3сб2риспри2флри3фрри1хлр2к1л2р1л2рнас4рне3оро2влро1двро1длро1др1родьрое2лрое2мрое2хро1зр1рокрро3псро1руро1ск1рослро1смрос2ф1росш1росю1роткроуг2ро2фрро1хлрош2лро3шн1роязрп2лор2плюрств2р2т1врт3варт2влрт1рарт1рерт1риртус1р3тьюрт1яч1рубаруг3н2руксрус1крус3лру3ть1руха1рухо1ручнр3ш2мры2двры2клры2х1ря1виса2блса2дьса2квса2клс1аппса1трса2унса1х22с3бусег2нсе1з2се1квсек1лсекс4семи1се2сксе2стси1омси1опси2пл2скам2скахск2вас2квис2кляс1кон2скошс1кра2скуе1слав1сладс1ламс3левс3леес1лейслео2с1летс3лею2слицс2ложс1люс2с3ля1смесс4меяс3мурс2нас2сная2сную2с3нысов2рсо1з2со3м2со1русо1сксо2сьсот2рсо1члсош2лс2павс2пеес2пелс2пенс2пехс2пешс2пеюс2пим2сполс2посс2рабсра2сс1ратсс3во4с5сис3с2к1ста_4ств_2ствлст2вя1стей1стелсте3хс3тешс2тиес2тиис2тичс2тиюст2ла2стли2стля1сто_1стов1стог1стод1стое1сток1стом1стон1стос1стотс2тоц1стою2стр_с1тут1стуюс2тыв2сть_2стьс3стью1стья1стям1стяхсуб1осу3глсу2евсу1крсума1супе2сус3лсус3псу1стсут1рсу2ф31с2фе1с2хе2с3цис2часс3чив2счикс2читсъе3дсъе3лсы2г1ся3тьта2блтаб2рта2гнта1з2та2плта1стта1тр2т1б22т2ват1вейт1велт1ветт1воет1вос2твою2т1врте2гнте1зо3текатек1л3текште1ох3терзтер3к3терятест2те2хотиа2мти2блти3д2тиис1т1импт1инд2тинж2тинфти1хр2т1к2тло2бтми2с2тобъто2влто1з2ток2р2томс2тонг1торг1торж1торсто1ру1торш2тотдто3тктпа1ттрдо2т1реат1регт1редт1реет1рецт1рею1трибт1ривт1рилт1римтри1от1риттри3фт1рищ2тройт1рортро3т2трою1трубт2руд2трукт2румт2рутт1ря_т1рявт1ряет1ряжт1ряйт3рякт1рятт1рящт1ряя4т1с2т2с3дтсеп2т2с3мт2с3пту2грту1слту1стту2фл1туша1тушо1тушьты2г12тя2чу2алеу3белубо1дубос21убрауб3рюу1ве_уг2науг2неуг1реуг1ряуда1суд1роуес2лу1з2вузо3пуко1бу1ку1у1лыху2озауост1уо2т1уп1люу3проурке3у2родурт2ру2садус1каус1киуск3лу1скрус3лиу1стеу1стяу3сьяу3терут2ляут1риу1тьеу3тьюуф2ляух1адуха2тух3ляу2чебуш1лафа2б1фа2гнфа1зофан2дфа1трфев1рфед1рфе1о3фи2глфи2зо2фобъфо2рвфо1руфос1кф1рабфра1зфра1сф1ратф2ренфре2сф2рижф2ризф2ронф2торфу3тлха2бл2х1акхан2дх1арш2х3ве2х3вихиат1хи1с2х1лавх1ласх1латх1лац1хлебх2лесх1летх3ло_х2лоп1х2му3х2ныхо2пехо1рух1осмхох1лх1раз1хранх1рейх2рисх1ров1хром2х1с2х1у2гх1у2рху3ра2х1ч2ца2плце1отцеп1лцес2лци2к1цик3лци2олци2скциф1р2ц1к2ц1о2б2ц1от2ц3ш2цып3лча2дрча2дцча2ер3чато3чатыче1влче2глчер2сче1сл1ч2лач3легч3лежч2ли_1ч2ло2ч1таша2блша2гнша2дрша1стш3венше2глше1о2ше3плше1с2ши2блши2плшиф1р2ш1к22шленш2ли_2шлив2шлилш2линш2лисш2лифш2ло_2шловш2лог2шляе2шлякш2ляп2шлят2шляч2шляю3ш2мыш2нуршу2евшуст12щ3в2ще2глщед1рщеис1ще3шкъе3доъ2е2ръе2хиыд2реы2дряы3ж2дыз2ваыз2наы2к1выко1зыре2хыс1киыс1куыт1виы3тьюы3тьяы2ш1лье1зоьми3дьми3кьне2оь2п1ль2стиь2стяьти3мь2тотьт2реьт2руьт2рыьхоз1ь3ягсэк2стэле1оэпи3кэс3теэт1раюзи2кю2к1вюре4мю2с1кю1стаю1стею1стою1стяюха1сяб1раяб3реяб1рияб3рюя1в2хя2г1ляз2гня2к1вя2к1ляст3вя1стояст1ряти1зя3тьюя3тьяа2ньшгст4ре2мьдзаи2лзао2ззаю2лз2рятзу2мьпое2ж2стьт6хуя_ы2рьмыя2вяьбат2а2двё2алёк2амёта1тьёб3лёнб2люёб1рёкб2рёмб2рёх3везёвёд1р2вёрдв2лёкв2лётв2нёс3всё3г2лётг2нёвг3нёнг2ноёд2рёбд2рёмдъё2м2евёре2глёер1вёет1вёе1тьёё1браёб1рыё1друё1зом2ё1ко2ё1крёк2ро2ёмужёпат2ё3плаёп1луё3плыё3ре_ёр3скё3с2аё2скеё3сту2ётечёто1сёха2тёх1ружё1с2з2вёзз2наёз2отёзъё2м2зымё2и1вёих1рёк3лёнк2роёлё3долёк1ллё2ск2лоён1льщё3м2щёнд2рёнё1б23номёоё2жио2скёот1вёо3тёрпё2тр2плёнп1лёюпоё2ж3прётр2блё1рвёт1рёзкрёз2у1рёкш3рёмо1рёнкроё2мсёкс4сё2ст2скуёс1лёт1стёлстё3хс3тёшт1вёлт1воётё2гнтё1зо3тёкатёк1л3тёкштёр3ктё2хоуг2нёуг1рёу1стёу3тёру1тьёу2чёб2х3вё1хлёбх2лёсчёр2с2шлёнъ2ё2рыд2рёырё2хьё1зояб3рё',
            6: '_аг1ро_аль3я_ас1то_аст1р_де1кв_ди2ак_до3т2_зав2р_ио4на_лес1к_люст1_ми1ом_мо2к1_на3ш2_не3вн_не1др_не1з2_не1сл_нос1к_нук1л_ос2ка_ос3пи_от1ро_от1ру_от1уж_по3в2_по3ж2_поз2н_прос2_ре2бр_ри2ск_септ2_те2о3_тиг1р_уз2наабе3ста3в2чеага1с2а2гитиа2глосаг2лотади2ода2д1руаза4ш3аз3веза2зовьа2зольа1зориаз2о1сак3лемако1б22аконсалуш1та2минтам2нетамо1з2ана2дцан2драан2сура2н1узап2ломапо4всап1релара2стар2бокар2валаре1дваре1олар2торар2т1р1ассигаст1вуас3темас2тинас2тияас1тооас1туха1стьеас2шедас2шесат1обеа2томнат1рахба2г1рбе2д1рбез1а2без5д4без1о2бе2с1кбе2с1тбес3тебес3ти1б2лазб3лази1б2лее1б2лея1б2луж2б3лю_бо1брабо1драбо1л2жбо1льсбо3м2лбо3скобо3стибра1зо1б2рал2б1рамб2рать1б2рач2б3рая1б2редб2ритоб2ритыб1ром_3брукс2б3рю_бу2г1рва2д1рва3ж2два2стрве2с1квзъе3д3в2кус2в3лаб3в2нук3в2нучвои2с1вос3пево2стрво3х2т2в1рам2в1рах2в1рен1в2ризвро3т2в3ская4в3ски4в3скувто1б2ву2х1а3в2шиввы3ш2лга1ст2г1лами2глась3г2лифг3лоблгнит2рго3ж2дго2с1аго1склго1спагу2с1кда2гендаст1р2д1вид2двинт2двинч2д1вис2д1вит1дворьде1б2лде1б2рдез1о2дерас2де2с3вди2алиди2алодио3деди1отиди3фто3дневн4д3но1дно3д23д2няшдо3в2мдо3ж2д2долимдо2м1р2допледо2предо2рубдот2ридо2ш3вдо3ш2кдо2шлы1дравш2дразвд1ране2д3реж1дрема1дремлдрем3н1дремы2д3рендре2скд2ресс1д2рож2д3роз1д2рыг1д2рягду2ста2дут1рды2г1р2ды2с1еб1ренеб1рове2б3рюе3в2меев2нимев2нятевра1с2е1вреев1рееев1рейев1реяега1с2е2гланедноу3ед1опре2дотве2д1още2дру_е2ду2бед1убое2дувеед1уст2е3душе2евидее2в1реест1ре4ждевеза2вре1з2ваез1о2гез1о2рез1у2дез1у2кезу2соезу2сыез1у2хез1учаеис1трек1стееле3скеле1сцеми3д2ен2д1реоб2рое2о3глео2гроеоде3зе2о3роеост1реот2руепа1трепис2кеп1лешеп1лющер1актере3доере1дрере1к2ере1х4ерио3зер1обл2ерови2ерокреро3ф2ес1кале2сковес1ласес2линес2ловес2ломес2пекес3полес2танес2четеук2лоефи3б2ех1атоех3валех3лопех1опоех1у2ч3ж2дел4ждемеже1к2вза2вруза3ж2дза3мнеза3р2д2з3ва_з3валь1з2вон2з1вуюзи2онози3т2рзко3п2зо3в2мзо2о3пзот2резот2ризро2с3зу2б3р2з1уз3з1у2моз1у2тезу2час2зы2г12зы2с1иа2зовиа2налиа1с2киа1стаиа1стоиат1роиг1рени2г1ряиди1омиди1оти2еводиз2гнеиз2налика1с2ик2с1тило1ски2менои2мену2имень1инстии3оновио3склио1с2пио2т1випа1трипо3к2ира2сти2р1ауири2скиро1з2ис3ка_ис3камис3кахис3ковис3ку_и2сламисо2ски2с3при2ст1вис1тязи2т1веит2ресит3роми2т1учи2х1асих2ло2ихлор1й2с3мука2брика3днека2д1рка2п1лка2прекар3трка1т2рка2ш1тке2с1кке2ст12к3ла_2к3ле_к3лем_2к3ли_2к3лив2к3лис2к3ло_2к3лос2к3лю_3к2ниж3к2няж1кольс2коминко2р3вкре2слкри2о3ксанд2к1стамк1стан3к2то_ку2п1рла3ж2д1лами_ла1сталаст1вла1стела1стола1стула1стяла1т2р1л2галлев1рале2г1лле1онтле1о2сле4скале1с2лле1спеле1т2рли2гро2л1испли2х3вло1б2р2ловия3ловодло2г3длого1слок3ла3лопас2л1оргло1с2плу1д4р1льсти1льстяма2к1р2м1аллма1с4тма2тобма2т1рме2с1кми2гремик1рими1опими1с2л3м2нешмоис1тмо2к3вмос1камо1с2пмо2т1рм2с1ор3м2стиму1с2кму1с4лнаби1она1в2рна3м2нна1рвана1т2рн1а2фрна3ш2лнд1рагнд1ражнд2риане1в2дне3вняне1д2лне2дране1дроне3ж2дне1з2лне1к2вне3м2н3не1о2не2одане1р2жне3с2нне1с2пне1с2хне1с2чне1т2вне3т2лне1т2р2нинспнист2рнко3п2н2к1ронно3п2но3з2оно1склно2слино1с2пн2сконн2с1окн3с2пентр1ажн2трарнтрас2н2тривн2трокнтр1удн2т1ря2н3ю2роб2левоб2лемобо3м2о2бра_о1браво1брано3в2лоо2в1риов3скоог3ла_ог3ли_ог3ло_од1вое2оди3а2о3димод2литодо3про2досио1драгод1ражод1разод1рако1дралод3ребо1дробод1рово2дымао2дымуо2е1вло3ежеко3ж2дуо1з2ваоз2вено1з2вяоз2глооз2доро2з1обозо1ру2о3кан2о3колол2ган1олимполу3д2о3множоне3ф2он2труоост1ро2пле_оп2литоп3лю_о3плясопо4всопоз2но3п2теора2с3ор2б3л2о3регоре2скор1испор1уксоса3ж2о2с3баос3кароск1воо2ски_о2сковос1койос1комос1коюос1куюос3лейос3логос3лыхос3мосос2нялос2пасо1с2пуос2с3мо3страос2цен2о3тек2о3техо3ткалот1работ1радот1разотра2сот1режот1рекот1речот1решот1родот1роеот1рокот1росот1рочот1ругот1у2чо2форио2ч1топас1тапа1степас1топас1тупа1тропери1опе2с1кпиаст1пи2ж3мпи2к1рп1лем_п1лемсп2ленкп1ле2оплес1к3п2ликпо3в2спод1вопо1звепо1здопо1з2лпо3мнопо3мну3по3п2по2шлопо2шлыпо2шляпре1огпри3д2приль2про1блпрод2лпро3ж2про1з2п1розопрофо23п2сал3п2сих3п2тихпус1кура2б1р1равняра2журра2зийра2зуб1ракизра2к3лра2нохран2сцра2п1лрас3к21растара2такра1т2р1р2вавр3ватарег2ляре2досре3ж2дре1з2лре1зна1ре1зоре1к2лре3мноре1о2рре1о2фре1о2црес1кире1с2пре3старе3сторе1т2рреуч3три3в2нри2глори3г2нри1д2рри3м2нри3м2чри3стври3т2рриэти2рне1с2рно3слро2блюро1б2р1рогол1рогруро3д2зрод2ле1розарро1з2в3розысрои2с31рокон1ролис1ролиц1ромор1ронаж1ронап1роносрооп1рро2плю2р1оргро1р2жро2скиро2скуро1с2п1рот2врот2рир3ствлр2таккр2т1обрт1оргрт2ранру2дар1ружейру1старуст1рр2х1инр1х2лор2х1опры2с1к2с1арк2с1атлса2ф1рсбезо3сбе3с22с3венсе2к1рсере2бсе3стасе3стесест1рс2канд1с2каф3скиноск3ляв2сконас2копс2скриб2с3ла_2с3лая2с3ли_2с3ло_с3лому2с3лос2с3лую2с3лые2с3лый2с3лым1с2наб1с2неж2с3никсно1з2со1б2рсо1л2гсо2риесо1с2п1с2пец2списяспо1з2сре2б1сре3доссанд2с3с2нес2сорист1верст2вол1с4те_1стен_с3тет_с3тете2стимп2стинд2стинф2стинъс2тишкс3т2лест2лилст2литс2то1б3с2тои2сторг2сторж2сторсстрас24страя2стредст1рей2стривст1риз2стрил2стрищст1роаст1родст1рохст2рубст1рушсуб1а2с2ценасы2п1лсыс1ката1вритак3лет1во1з2т1войтеле1отем2б1те2о3дте4п1лте2рактере2оте2скате2скути1знатила2м2т1инвти1с2лти3ствти3ф2р3т2кав3т2кан3т2кеттмист1то2бесто1б2лто3д2р2т1оммто1с2нто1с2пто1с2цт1рага2т1раж1требо1требут1ребьт1ревет1ревшт1резат1резнтреп1л3тре2стрес1кт1рестт1ретут2решь4тринст1роглт1роидтро3плт1росо4т3роц2т1рядту2жинты2с1к1у2бытуд1рамуе2с1кун2д1руро2длус1комус1ку_у3х4вофанд1рфе2с1кфиа2к1фи2нин2ф1оргфор3трфото3п2ф1у2п2х1изы1х2лор2х1о2кхо2пор2х1оснхри2плхро2мч2цетат2ц1о2дча2евоча2евычаст1вча1стеча1стуча1стячерст1ша2г1ршан2кршар3т2ша1тро3ш2кол2ш1лейш2лите4ш3мы_ще1б2лщи2п1лы2д1роы2к3лоынос3лыра2с3ье2с1кь3п2тоь2трабэри4трэро1с2эс2т1рэтил1аю2б1рею2идалюри2ск3явиксям2б3л_вст2р_реа2нбезу2свиз2гнвыб2редос2ня4ж3дик4ж3дичла2б1рлу3с4нни4сь_о2плюсоти4днпти4днреж4ди2стче_сы2мит2сься_аз3вёзам2нётас3тёмбё2д1р2в1рён2доплёдо2прё2д3рёж1дрёма1дрёмы2д3рёнеб1рён2е1врёерё3доерё1к2ес2чёт2ё1вре2ё3душёз1о2гён2д1рёс2танёх1атоёх3валёх3лопёх1опоза3мнёзот2рёиг1рёнла1стёлё4ска3м2нёшод3рёб2о3тёкот1рёкот1рёшп2лёнкплёс1к_рё2бррё1зна1рё1зорё3старё3стород2лёсе3стёсёст1р1стён_с3тёт_с3тётес3т2лётё4п1лтё2скатё2ску3т2кётт1ревёт2рёшьчёрст1',
            7: '_во2б3л_во3ж2д_за3м2н_ле2п3р_му2шт1_не1с2ц_обо3ж2_ра2с3т_ре2з3в_ро2з3в_ро2с3л_хо2р3в_че2с1ка2д1облаз2о1бра2н1о2бан1о2храпо3ч2тбили3т2б2лес1к2б3люсь1б2роди1б2росибро2с1кве2ст1вви2а1с2ви1с2ниво2б3лагри4в3нде2з1а2ди2с1тр2д1обладо1б2рад1о2сенд1о2син2д1осно2д1отря1д2разнд1ра2с3дро2г3неан2д1ре1д2лине1о2свие3п2лодере3м2не2р1у2пе2с1ка_е4с1ку_2ж1о2т1за2в1ри1з2о3ре2з1у2беи2л1а2ци2л1у2пино2к3лино3п2лисан2д1ки1с2ни2к3ласько1б2рикохо2р3ла2д1аглан2д1рла2ст1рле1з2о3лу3п2ломан2д1рме2ж1атме2ст1рна2и1с2на1р2вине2р1отни2л1ални2л1ам2н1инстнти1о2кобо1л2го3в2нуш1о2деяло2д1отчо2д1у2чоза2б3воко3п2ло3м2немо3м2нето2п1лейопо2ш3лоро2с3ло2с1ка_о1с2копо2с1ку_о1с2нимо1с2шивошпа2к3па2с1тыпе2д1инпе2к1лапе2ст1рподо3м2радо1б2рас3т2лрво1з2дремо2г3рес2с3мро2д1отро2ф1акр2т1акт2с1альп2сбе3з2сто2г3нс4т1ровсче2с1кте2с1ките2с1ко3т2ре2хтри2г1л2т1у2пруре2т3русла4ж3уто3п2сх1ра1с2ь2т1амп_бо2дра_об2люю_об2рее_об2рей_об2рею_об2рив_об2рил_об2рит_пом2ну_со2плаатро2скбино2скдро2ж3ж2дружейилло3к2ме2динсмис4с3ннар2ватне2о3рен2трассо4ж3девойс4ково2м3че_он2тратосо4м3нпо2додепо2стинпрем2норедо4плроб2лею2сбрук1б2лёс1кё2с1ка_ё4с1ку_1з2о3рёлё1з2о3о3м2нёмо3м2нёто2п1лёйпё2ст1рсчё2с1ктё2с1китё2с1ко3т2рё2х_чё2с1к',
            8: '_ар2т1о2_ме2ж1у2а2н1а2ме2д1о2бедло2к1а2ун2тр1а2го2д1о2пео2д1о2пыпо2д1о2кре2д1о2пр2т1у2чи_доб2рел_до1б2ри_па2н1ис_ро2с3пиди1с2лове2о3позиере3с2со2з1а2хавни1с2коло1и2с1трони3л2ампере1с2нсо2стритсо3т2калтро2етес_доб2рёлтро2етёс',
            9: 'е2о3платои2л1а2минме2д1о2сммети2л1амо2д1о2болпо2д1у2роприче2с1крни3л2а3мпричё2с1к',
            10: 'но4л1а2мин',
          },
        },
      },
      t = new window.Hypher(e.exports);
    'string' == typeof e.exports.id && (e.exports.id = [e.exports.id]);
    for (var o = 0; o < e.exports.id.length; o += 1) window.Hypher.languages[e.exports.id[o]] = t;
  })(),
  (function (e) {
    'use strict';
    'function' == typeof define && define.amd
      ? define(['jquery'], e)
      : 'undefined' != typeof exports
      ? (module.exports = e(require('jquery')))
      : e(jQuery);
  })(function (c) {
    'use strict';
    var s,
      a = window.Slick || {};
    (s = 0),
      ((a = function (e, t) {
        var o,
          i = this;
        (i.defaults = {
          accessibility: !0,
          adaptiveHeight: !1,
          appendArrows: c(e),
          appendDots: c(e),
          arrows: !0,
          asNavFor: null,
          prevArrow:
            '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
          nextArrow:
            '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
          autoplay: !1,
          autoplaySpeed: 3e3,
          centerMode: !1,
          centerPadding: '50px',
          cssEase: 'ease',
          customPaging: function (e, t) {
            return (
              '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' +
              (t + 1) +
              '</button>'
            );
          },
          dots: !1,
          dotsClass: 'slick-dots',
          draggable: !0,
          easing: 'linear',
          edgeFriction: 0.35,
          fade: !1,
          focusOnSelect: !1,
          infinite: !0,
          initialSlide: 0,
          lazyLoad: 'ondemand',
          mobileFirst: !1,
          pauseOnHover: !0,
          pauseOnDotsHover: !1,
          respondTo: 'window',
          responsive: null,
          rows: 1,
          rtl: !1,
          slide: '',
          slidesPerRow: 1,
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          swipe: !0,
          swipeToSlide: !1,
          touchMove: !0,
          touchThreshold: 5,
          useCSS: !0,
          variableWidth: !1,
          vertical: !1,
          verticalSwiping: !1,
          waitForAnimate: !0,
          zIndex: 1e3,
        }),
          (i.initials = {
            animating: !1,
            dragging: !1,
            autoPlayTimer: null,
            currentDirection: 0,
            currentLeft: null,
            currentSlide: 0,
            direction: 1,
            $dots: null,
            listWidth: null,
            listHeight: null,
            loadIndex: 0,
            $nextArrow: null,
            $prevArrow: null,
            slideCount: null,
            slideWidth: null,
            $slideTrack: null,
            $slides: null,
            sliding: !1,
            slideOffset: 0,
            swipeLeft: null,
            $list: null,
            touchObject: {},
            transformsEnabled: !1,
            unslicked: !1,
          }),
          c.extend(i, i.initials),
          (i.activeBreakpoint = null),
          (i.animType = null),
          (i.animProp = null),
          (i.breakpoints = []),
          (i.breakpointSettings = []),
          (i.cssTransitions = !1),
          (i.hidden = 'hidden'),
          (i.paused = !1),
          (i.positionProp = null),
          (i.respondTo = null),
          (i.rowCount = 1),
          (i.shouldClick = !0),
          (i.$slider = c(e)),
          (i.$slidesCache = null),
          (i.transformType = null),
          (i.transitionType = null),
          (i.visibilityChange = 'visibilitychange'),
          (i.windowWidth = 0),
          (i.windowTimer = null),
          (o = c(e).data('slick') || {}),
          (i.options = c.extend({}, i.defaults, o, t)),
          (i.currentSlide = i.options.initialSlide),
          (i.originalSettings = i.options),
          void 0 !== document.mozHidden
            ? ((i.hidden = 'mozHidden'), (i.visibilityChange = 'mozvisibilitychange'))
            : void 0 !== document.webkitHidden &&
              ((i.hidden = 'webkitHidden'), (i.visibilityChange = 'webkitvisibilitychange')),
          (i.autoPlay = c.proxy(i.autoPlay, i)),
          (i.autoPlayClear = c.proxy(i.autoPlayClear, i)),
          (i.changeSlide = c.proxy(i.changeSlide, i)),
          (i.clickHandler = c.proxy(i.clickHandler, i)),
          (i.selectHandler = c.proxy(i.selectHandler, i)),
          (i.setPosition = c.proxy(i.setPosition, i)),
          (i.swipeHandler = c.proxy(i.swipeHandler, i)),
          (i.dragHandler = c.proxy(i.dragHandler, i)),
          (i.keyHandler = c.proxy(i.keyHandler, i)),
          (i.autoPlayIterator = c.proxy(i.autoPlayIterator, i)),
          (i.instanceUid = s++),
          (i.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
          i.registerBreakpoints(),
          i.init(!0),
          i.checkResponsive(!0);
      }).prototype.addSlide = a.prototype.slickAdd =
        function (e, t, o) {
          var i = this;
          if ('boolean' == typeof t) (o = t), (t = null);
          else if (t < 0 || t >= i.slideCount) return !1;
          i.unload(),
            'number' == typeof t
              ? 0 === t && 0 === i.$slides.length
                ? c(e).appendTo(i.$slideTrack)
                : o
                ? c(e).insertBefore(i.$slides.eq(t))
                : c(e).insertAfter(i.$slides.eq(t))
              : !0 === o
              ? c(e).prependTo(i.$slideTrack)
              : c(e).appendTo(i.$slideTrack),
            (i.$slides = i.$slideTrack.children(this.options.slide)),
            i.$slideTrack.children(this.options.slide).detach(),
            i.$slideTrack.append(i.$slides),
            i.$slides.each(function (e, t) {
              c(t).attr('data-slick-index', e);
            }),
            (i.$slidesCache = i.$slides),
            i.reinit();
        }),
      (a.prototype.animateHeight = function () {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
          var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
          e.$list.animate(
            {
              height: t,
            },
            e.options.speed,
          );
        }
      }),
      (a.prototype.animateSlide = function (e, t) {
        var o = {},
          i = this;
        i.animateHeight(),
          !0 === i.options.rtl && !1 === i.options.vertical && (e = -e),
          !1 === i.transformsEnabled
            ? !1 === i.options.vertical
              ? i.$slideTrack.animate(
                  {
                    left: e,
                  },
                  i.options.speed,
                  i.options.easing,
                  t,
                )
              : i.$slideTrack.animate(
                  {
                    top: e,
                  },
                  i.options.speed,
                  i.options.easing,
                  t,
                )
            : !1 === i.cssTransitions
            ? (!0 === i.options.rtl && (i.currentLeft = -i.currentLeft),
              c({
                animStart: i.currentLeft,
              }).animate(
                {
                  animStart: e,
                },
                {
                  duration: i.options.speed,
                  easing: i.options.easing,
                  step: function (e) {
                    (e = Math.ceil(e)),
                      !1 === i.options.vertical
                        ? (o[i.animType] = 'translate(' + e + 'px, 0px)')
                        : (o[i.animType] = 'translate(0px,' + e + 'px)'),
                      i.$slideTrack.css(o);
                  },
                  complete: function () {
                    t && t.call();
                  },
                },
              ))
            : (i.applyTransition(),
              (e = Math.ceil(e)),
              !1 === i.options.vertical
                ? (o[i.animType] = 'translate3d(' + e + 'px, 0px, 0px)')
                : (o[i.animType] = 'translate3d(0px,' + e + 'px, 0px)'),
              i.$slideTrack.css(o),
              t &&
                setTimeout(function () {
                  i.disableTransition(), t.call();
                }, i.options.speed));
      }),
      (a.prototype.asNavFor = function (t) {
        var e = this.options.asNavFor;
        e && null !== e && (e = c(e).not(this.$slider)),
          null !== e &&
            'object' == typeof e &&
            e.each(function () {
              var e = c(this).slick('getSlick');
              e.unslicked || e.slideHandler(t, !0);
            });
      }),
      (a.prototype.applyTransition = function (e) {
        var t = this,
          o = {};
        !1 === t.options.fade
          ? (o[t.transitionType] = t.transformType + ' ' + t.options.speed + 'ms ' + t.options.cssEase)
          : (o[t.transitionType] = 'opacity ' + t.options.speed + 'ms ' + t.options.cssEase),
          !1 === t.options.fade ? t.$slideTrack.css(o) : t.$slides.eq(e).css(o);
      }),
      (a.prototype.autoPlay = function () {
        var e = this;
        e.autoPlayTimer && clearInterval(e.autoPlayTimer),
          e.slideCount > e.options.slidesToShow &&
            !0 !== e.paused &&
            (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed));
      }),
      (a.prototype.autoPlayClear = function () {
        this.autoPlayTimer && clearInterval(this.autoPlayTimer);
      }),
      (a.prototype.autoPlayIterator = function () {
        var e = this;
        !1 === e.options.infinite
          ? 1 === e.direction
            ? (e.currentSlide + 1 === e.slideCount - 1 && (e.direction = 0),
              e.slideHandler(e.currentSlide + e.options.slidesToScroll))
            : (e.currentSlide - 1 == 0 && (e.direction = 1), e.slideHandler(e.currentSlide - e.options.slidesToScroll))
          : e.slideHandler(e.currentSlide + e.options.slidesToScroll);
      }),
      (a.prototype.buildArrows = function () {
        var e = this;
        !0 === e.options.arrows &&
          ((e.$prevArrow = c(e.options.prevArrow).addClass('slick-arrow')),
          (e.$nextArrow = c(e.options.nextArrow).addClass('slick-arrow')),
          e.slideCount > e.options.slidesToShow
            ? (e.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex'),
              e.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex'),
              e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows),
              e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows),
              !0 !== e.options.infinite && e.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true'))
            : e.$prevArrow.add(e.$nextArrow).addClass('slick-hidden').attr({
                'aria-disabled': 'true',
                tabindex: '-1',
              }));
      }),
      (a.prototype.buildDots = function () {
        var e,
          t,
          o = this;
        if (!0 === o.options.dots && o.slideCount > o.options.slidesToShow) {
          for (t = '<ul class="' + o.options.dotsClass + '">', e = 0; e <= o.getDotCount(); e += 1)
            t += '<li>' + o.options.customPaging.call(this, o, e) + '</li>';
          (t += '</ul>'),
            (o.$dots = c(t).appendTo(o.options.appendDots)),
            o.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');
        }
      }),
      (a.prototype.buildOut = function () {
        var e = this;
        (e.$slides = e.$slider.children(e.options.slide + ':not(.slick-cloned)').addClass('slick-slide')),
          (e.slideCount = e.$slides.length),
          e.$slides.each(function (e, t) {
            c(t)
              .attr('data-slick-index', e)
              .data('originalStyling', c(t).attr('style') || '');
          }),
          (e.$slidesCache = e.$slides),
          e.$slider.addClass('slick-slider'),
          (e.$slideTrack =
            0 === e.slideCount
              ? c('<div class="slick-track"/>').appendTo(e.$slider)
              : e.$slides.wrapAll('<div class="slick-track"/>').parent()),
          (e.$list = e.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent()),
          e.$slideTrack.css('opacity', 0),
          (!0 !== e.options.centerMode && !0 !== e.options.swipeToSlide) || (e.options.slidesToScroll = 1),
          c('img[data-lazy]', e.$slider).not('[src]').addClass('slick-loading'),
          e.setupInfinite(),
          e.buildArrows(),
          e.buildDots(),
          e.updateDots(),
          e.setSlideClasses('number' == typeof e.currentSlide ? e.currentSlide : 0),
          !0 === e.options.draggable && e.$list.addClass('draggable');
      }),
      (a.prototype.buildRows = function () {
        var e,
          t,
          o,
          i,
          s,
          n,
          a,
          r = this;
        if (((i = document.createDocumentFragment()), (n = r.$slider.children()), 1 < r.options.rows)) {
          for (a = r.options.slidesPerRow * r.options.rows, s = Math.ceil(n.length / a), e = 0; e < s; e++) {
            var l = document.createElement('div');
            for (t = 0; t < r.options.rows; t++) {
              var c = document.createElement('div');
              for (o = 0; o < r.options.slidesPerRow; o++) {
                var d = e * a + (t * r.options.slidesPerRow + o);
                n.get(d) && c.appendChild(n.get(d));
              }
              l.appendChild(c);
            }
            i.appendChild(l);
          }
          r.$slider.html(i),
            r.$slider
              .children()
              .children()
              .children()
              .css({
                width: 100 / r.options.slidesPerRow + '%',
                display: 'inline-block',
              });
        }
      }),
      (a.prototype.checkResponsive = function (e, t) {
        var o,
          i,
          s,
          n = this,
          a = !1,
          r = n.$slider.width(),
          l = window.innerWidth || c(window).width();
        if (
          ('window' === n.respondTo
            ? (s = l)
            : 'slider' === n.respondTo
            ? (s = r)
            : 'min' === n.respondTo && (s = Math.min(l, r)),
          n.options.responsive && n.options.responsive.length && null !== n.options.responsive)
        ) {
          for (o in ((i = null), n.breakpoints))
            n.breakpoints.hasOwnProperty(o) &&
              (!1 === n.originalSettings.mobileFirst
                ? s < n.breakpoints[o] && (i = n.breakpoints[o])
                : s > n.breakpoints[o] && (i = n.breakpoints[o]));
          null !== i
            ? null !== n.activeBreakpoint
              ? (i !== n.activeBreakpoint || t) &&
                ((n.activeBreakpoint = i),
                'unslick' === n.breakpointSettings[i]
                  ? n.unslick(i)
                  : ((n.options = c.extend({}, n.originalSettings, n.breakpointSettings[i])),
                    !0 === e && (n.currentSlide = n.options.initialSlide),
                    n.refresh(e)),
                (a = i))
              : ((n.activeBreakpoint = i),
                'unslick' === n.breakpointSettings[i]
                  ? n.unslick(i)
                  : ((n.options = c.extend({}, n.originalSettings, n.breakpointSettings[i])),
                    !0 === e && (n.currentSlide = n.options.initialSlide),
                    n.refresh(e)),
                (a = i))
            : null !== n.activeBreakpoint &&
              ((n.activeBreakpoint = null),
              (n.options = n.originalSettings),
              !0 === e && (n.currentSlide = n.options.initialSlide),
              n.refresh(e),
              (a = i)),
            e || !1 === a || n.$slider.trigger('breakpoint', [n, a]);
        }
      }),
      (a.prototype.changeSlide = function (e, t) {
        var o,
          i,
          s = this,
          n = c(e.target);
        switch (
          (n.is('a') && e.preventDefault(),
          n.is('li') || (n = n.closest('li')),
          (o =
            s.slideCount % s.options.slidesToScroll != 0
              ? 0
              : (s.slideCount - s.currentSlide) % s.options.slidesToScroll),
          e.data.message)
        ) {
          case 'previous':
            (i = 0 === o ? s.options.slidesToScroll : s.options.slidesToShow - o),
              s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide - i, !1, t);
            break;
          case 'next':
            (i = 0 === o ? s.options.slidesToScroll : o),
              s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide + i, !1, t);
            break;
          case 'index':
            var a = 0 === e.data.index ? 0 : e.data.index || n.index() * s.options.slidesToScroll;
            s.slideHandler(s.checkNavigable(a), !1, t), n.children().trigger('focus');
            break;
          default:
            return;
        }
      }),
      (a.prototype.checkNavigable = function (e) {
        var t, o;
        if (((o = 0), e > (t = this.getNavigableIndexes())[t.length - 1])) e = t[t.length - 1];
        else
          for (var i in t) {
            if (e < t[i]) {
              e = o;
              break;
            }
            o = t[i];
          }
        return e;
      }),
      (a.prototype.cleanUpEvents = function () {
        var e = this;
        e.options.dots &&
          null !== e.$dots &&
          (c('li', e.$dots).off('click.slick', e.changeSlide),
          !0 === e.options.pauseOnDotsHover &&
            !0 === e.options.autoplay &&
            c('li', e.$dots)
              .off('mouseenter.slick', c.proxy(e.setPaused, e, !0))
              .off('mouseleave.slick', c.proxy(e.setPaused, e, !1))),
          !0 === e.options.arrows &&
            e.slideCount > e.options.slidesToShow &&
            (e.$prevArrow && e.$prevArrow.off('click.slick', e.changeSlide),
            e.$nextArrow && e.$nextArrow.off('click.slick', e.changeSlide)),
          e.$list.off('touchstart.slick mousedown.slick', e.swipeHandler),
          e.$list.off('touchmove.slick mousemove.slick', e.swipeHandler),
          e.$list.off('touchend.slick mouseup.slick', e.swipeHandler),
          e.$list.off('touchcancel.slick mouseleave.slick', e.swipeHandler),
          e.$list.off('click.slick', e.clickHandler),
          c(document).off(e.visibilityChange, e.visibility),
          e.$list.off('mouseenter.slick', c.proxy(e.setPaused, e, !0)),
          e.$list.off('mouseleave.slick', c.proxy(e.setPaused, e, !1)),
          !0 === e.options.accessibility && e.$list.off('keydown.slick', e.keyHandler),
          !0 === e.options.focusOnSelect && c(e.$slideTrack).children().off('click.slick', e.selectHandler),
          c(window).off('orientationchange.slick.slick-' + e.instanceUid, e.orientationChange),
          c(window).off('resize.slick.slick-' + e.instanceUid, e.resize),
          c('[draggable!=true]', e.$slideTrack).off('dragstart', e.preventDefault),
          c(window).off('load.slick.slick-' + e.instanceUid, e.setPosition),
          c(document).off('ready.slick.slick-' + e.instanceUid, e.setPosition);
      }),
      (a.prototype.cleanUpRows = function () {
        var e;
        1 < this.options.rows && ((e = this.$slides.children().children()).removeAttr('style'), this.$slider.html(e));
      }),
      (a.prototype.clickHandler = function (e) {
        !1 === this.shouldClick && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault());
      }),
      (a.prototype.destroy = function (e) {
        var t = this;
        t.autoPlayClear(),
          (t.touchObject = {}),
          t.cleanUpEvents(),
          c('.slick-cloned', t.$slider).detach(),
          t.$dots && t.$dots.remove(),
          t.$prevArrow &&
            t.$prevArrow.length &&
            (t.$prevArrow
              .removeClass('slick-disabled slick-arrow slick-hidden')
              .removeAttr('aria-hidden aria-disabled tabindex')
              .css('display', ''),
            t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
          t.$nextArrow &&
            t.$nextArrow.length &&
            (t.$nextArrow
              .removeClass('slick-disabled slick-arrow slick-hidden')
              .removeAttr('aria-hidden aria-disabled tabindex')
              .css('display', ''),
            t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
          t.$slides &&
            (t.$slides
              .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
              .removeAttr('aria-hidden')
              .removeAttr('data-slick-index')
              .each(function () {
                c(this).attr('style', c(this).data('originalStyling'));
              }),
            t.$slideTrack.children(this.options.slide).detach(),
            t.$slideTrack.detach(),
            t.$list.detach(),
            t.$slider.append(t.$slides)),
          t.cleanUpRows(),
          t.$slider.removeClass('slick-slider'),
          t.$slider.removeClass('slick-initialized'),
          (t.unslicked = !0),
          e || t.$slider.trigger('destroy', [t]);
      }),
      (a.prototype.disableTransition = function (e) {
        var t = {};
        (t[this.transitionType] = ''), !1 === this.options.fade ? this.$slideTrack.css(t) : this.$slides.eq(e).css(t);
      }),
      (a.prototype.fadeSlide = function (e, t) {
        var o = this;
        !1 === o.cssTransitions
          ? (o.$slides.eq(e).css({
              zIndex: o.options.zIndex,
            }),
            o.$slides.eq(e).animate(
              {
                opacity: 1,
              },
              o.options.speed,
              o.options.easing,
              t,
            ))
          : (o.applyTransition(e),
            o.$slides.eq(e).css({
              opacity: 1,
              zIndex: o.options.zIndex,
            }),
            t &&
              setTimeout(function () {
                o.disableTransition(e), t.call();
              }, o.options.speed));
      }),
      (a.prototype.fadeSlideOut = function (e) {
        var t = this;
        !1 === t.cssTransitions
          ? t.$slides.eq(e).animate(
              {
                opacity: 0,
                zIndex: t.options.zIndex - 2,
              },
              t.options.speed,
              t.options.easing,
            )
          : (t.applyTransition(e),
            t.$slides.eq(e).css({
              opacity: 0,
              zIndex: t.options.zIndex - 2,
            }));
      }),
      (a.prototype.filterSlides = a.prototype.slickFilter =
        function (e) {
          var t = this;
          null !== e &&
            (t.unload(),
            t.$slideTrack.children(this.options.slide).detach(),
            t.$slidesCache.filter(e).appendTo(t.$slideTrack),
            t.reinit());
        }),
      (a.prototype.getCurrent = a.prototype.slickCurrentSlide =
        function () {
          return this.currentSlide;
        }),
      (a.prototype.getDotCount = function () {
        var e = this,
          t = 0,
          o = 0,
          i = 0;
        if (!0 === e.options.infinite)
          for (; t < e.slideCount; )
            ++i,
              (t = o + e.options.slidesToShow),
              (o +=
                e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow);
        else if (!0 === e.options.centerMode) i = e.slideCount;
        else
          for (; t < e.slideCount; )
            ++i,
              (t = o + e.options.slidesToShow),
              (o +=
                e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow);
        return i - 1;
      }),
      (a.prototype.getLeft = function (e) {
        var t,
          o,
          i,
          s = this,
          n = 0;
        return (
          (s.slideOffset = 0),
          (o = s.$slides.first().outerHeight(!0)),
          !0 === s.options.infinite
            ? (s.slideCount > s.options.slidesToShow &&
                ((s.slideOffset = s.slideWidth * s.options.slidesToShow * -1), (n = o * s.options.slidesToShow * -1)),
              s.slideCount % s.options.slidesToScroll != 0 &&
                e + s.options.slidesToScroll > s.slideCount &&
                s.slideCount > s.options.slidesToShow &&
                (n =
                  e > s.slideCount
                    ? ((s.slideOffset = (s.options.slidesToShow - (e - s.slideCount)) * s.slideWidth * -1),
                      (s.options.slidesToShow - (e - s.slideCount)) * o * -1)
                    : ((s.slideOffset = (s.slideCount % s.options.slidesToScroll) * s.slideWidth * -1),
                      (s.slideCount % s.options.slidesToScroll) * o * -1)))
            : e + s.options.slidesToShow > s.slideCount &&
              ((s.slideOffset = (e + s.options.slidesToShow - s.slideCount) * s.slideWidth),
              (n = (e + s.options.slidesToShow - s.slideCount) * o)),
          s.slideCount <= s.options.slidesToShow && (n = s.slideOffset = 0),
          !0 === s.options.centerMode && !0 === s.options.infinite
            ? (s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2) - s.slideWidth)
            : !0 === s.options.centerMode &&
              ((s.slideOffset = 0), (s.slideOffset += s.slideWidth * Math.floor(s.options.slidesToShow / 2))),
          (t = !1 === s.options.vertical ? e * s.slideWidth * -1 + s.slideOffset : e * o * -1 + n),
          !0 === s.options.variableWidth &&
            ((t = (i =
              s.slideCount <= s.options.slidesToShow || !1 === s.options.infinite
                ? s.$slideTrack.children('.slick-slide').eq(e)
                : s.$slideTrack.children('.slick-slide').eq(e + s.options.slidesToShow))[0]
              ? -1 * i[0].offsetLeft
              : 0),
            !0 === s.options.centerMode &&
              ((t = (i =
                !1 === s.options.infinite
                  ? s.$slideTrack.children('.slick-slide').eq(e)
                  : s.$slideTrack.children('.slick-slide').eq(e + s.options.slidesToShow + 1))[0]
                ? -1 * i[0].offsetLeft
                : 0),
              (t += (s.$list.width() - i.outerWidth()) / 2))),
          t
        );
      }),
      (a.prototype.getOption = a.prototype.slickGetOption =
        function (e) {
          return this.options[e];
        }),
      (a.prototype.getNavigableIndexes = function () {
        var e,
          t = this,
          o = 0,
          i = 0,
          s = [];
        for (
          e =
            !1 === t.options.infinite
              ? t.slideCount
              : ((o = -1 * t.options.slidesToScroll), (i = -1 * t.options.slidesToScroll), 2 * t.slideCount);
          o < e;

        )
          s.push(o),
            (o = i + t.options.slidesToScroll),
            (i +=
              t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow);
        return s;
      }),
      (a.prototype.getSlick = function () {
        return this;
      }),
      (a.prototype.getSlideCount = function () {
        var o,
          i,
          s = this;
        return (
          (i = !0 === s.options.centerMode ? s.slideWidth * Math.floor(s.options.slidesToShow / 2) : 0),
          !0 === s.options.swipeToSlide
            ? (s.$slideTrack.find('.slick-slide').each(function (e, t) {
                if (t.offsetLeft - i + c(t).outerWidth() / 2 > -1 * s.swipeLeft) return (o = t), !1;
              }),
              Math.abs(c(o).attr('data-slick-index') - s.currentSlide) || 1)
            : s.options.slidesToScroll
        );
      }),
      (a.prototype.goTo = a.prototype.slickGoTo =
        function (e, t) {
          this.changeSlide(
            {
              data: {
                message: 'index',
                index: parseInt(e),
              },
            },
            t,
          );
        }),
      (a.prototype.init = function (e) {
        var t = this;
        c(t.$slider).hasClass('slick-initialized') ||
          (c(t.$slider).addClass('slick-initialized'),
          t.buildRows(),
          t.buildOut(),
          t.setProps(),
          t.startLoad(),
          t.loadSlider(),
          t.initializeEvents(),
          t.updateArrows(),
          t.updateDots()),
          e && t.$slider.trigger('init', [t]),
          !0 === t.options.accessibility && t.initADA();
      }),
      (a.prototype.initArrowEvents = function () {
        var e = this;
        !0 === e.options.arrows &&
          e.slideCount > e.options.slidesToShow &&
          (e.$prevArrow.on(
            'click.slick',
            {
              message: 'previous',
            },
            e.changeSlide,
          ),
          e.$nextArrow.on(
            'click.slick',
            {
              message: 'next',
            },
            e.changeSlide,
          ));
      }),
      (a.prototype.initDotEvents = function () {
        var e = this;
        !0 === e.options.dots &&
          e.slideCount > e.options.slidesToShow &&
          c('li', e.$dots).on(
            'click.slick',
            {
              message: 'index',
            },
            e.changeSlide,
          ),
          !0 === e.options.dots &&
            !0 === e.options.pauseOnDotsHover &&
            !0 === e.options.autoplay &&
            c('li', e.$dots)
              .on('mouseenter.slick', c.proxy(e.setPaused, e, !0))
              .on('mouseleave.slick', c.proxy(e.setPaused, e, !1));
      }),
      (a.prototype.initializeEvents = function () {
        var e = this;
        e.initArrowEvents(),
          e.initDotEvents(),
          e.$list.on(
            'touchstart.slick mousedown.slick',
            {
              action: 'start',
            },
            e.swipeHandler,
          ),
          e.$list.on(
            'touchmove.slick mousemove.slick',
            {
              action: 'move',
            },
            e.swipeHandler,
          ),
          e.$list.on(
            'touchend.slick mouseup.slick',
            {
              action: 'end',
            },
            e.swipeHandler,
          ),
          e.$list.on(
            'touchcancel.slick mouseleave.slick',
            {
              action: 'end',
            },
            e.swipeHandler,
          ),
          e.$list.on('click.slick', e.clickHandler),
          c(document).on(e.visibilityChange, c.proxy(e.visibility, e)),
          e.$list.on('mouseenter.slick', c.proxy(e.setPaused, e, !0)),
          e.$list.on('mouseleave.slick', c.proxy(e.setPaused, e, !1)),
          !0 === e.options.accessibility && e.$list.on('keydown.slick', e.keyHandler),
          !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on('click.slick', e.selectHandler),
          c(window).on('orientationchange.slick.slick-' + e.instanceUid, c.proxy(e.orientationChange, e)),
          c(window).on('resize.slick.slick-' + e.instanceUid, c.proxy(e.resize, e)),
          c('[draggable!=true]', e.$slideTrack).on('dragstart', e.preventDefault),
          c(window).on('load.slick.slick-' + e.instanceUid, e.setPosition),
          c(document).on('ready.slick.slick-' + e.instanceUid, e.setPosition);
      }),
      (a.prototype.initUI = function () {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()),
          !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show(),
          !0 === e.options.autoplay && e.autoPlay();
      }),
      (a.prototype.keyHandler = function (e) {
        e.target.tagName.match('TEXTAREA|INPUT|SELECT') ||
          (37 === e.keyCode && !0 === this.options.accessibility
            ? this.changeSlide({
                data: {
                  message: 'previous',
                },
              })
            : 39 === e.keyCode &&
              !0 === this.options.accessibility &&
              this.changeSlide({
                data: {
                  message: 'next',
                },
              }));
      }),
      (a.prototype.lazyLoad = function () {
        var e,
          t,
          o = this;
        function i(e) {
          c('img[data-lazy]', e).each(function () {
            var e = c(this),
              t = c(this).attr('data-lazy'),
              o = document.createElement('img');
            (o.onload = function () {
              e.animate(
                {
                  opacity: 0,
                },
                100,
                function () {
                  e.attr('src', t).animate(
                    {
                      opacity: 1,
                    },
                    200,
                    function () {
                      e.removeAttr('data-lazy').removeClass('slick-loading');
                    },
                  );
                },
              );
            }),
              (o.src = t);
          });
        }
        o.options.lazyImagesLoad
          ? !0 === o.options.centerMode
            ? (t =
                !0 === o.options.infinite
                  ? (e = o.currentSlide + (o.options.lazyImagesLoad / 2 + 1)) + o.options.lazyImagesLoad + 2
                  : ((e = Math.max(0, o.currentSlide - (o.options.lazyImagesLoad / 2 + 1))),
                    o.options.lazyImagesLoad / 2 + 1 + 2 + o.currentSlide))
            : ((t =
                (e = o.options.infinite ? o.options.lazyImagesLoad + o.currentSlide : o.currentSlide) +
                o.options.lazyImagesLoad),
              !0 === o.options.fade && (0 < e && e--, t <= o.slideCount && t++))
          : !0 === o.options.centerMode
          ? (t =
              !0 === o.options.infinite
                ? (e = o.currentSlide + (o.options.slidesToShow / 2 + 1)) + o.options.slidesToShow + 2
                : ((e = Math.max(0, o.currentSlide - (o.options.slidesToShow / 2 + 1))),
                  o.options.slidesToShow / 2 + 1 + 2 + o.currentSlide))
          : ((t =
              (e = o.options.infinite ? o.options.slidesToShow + o.currentSlide : o.currentSlide) +
              o.options.slidesToShow),
            !0 === o.options.fade && (0 < e && e--, t <= o.slideCount && t++)),
          i(o.$slider.find('.slick-slide').slice(e, t)),
          o.slideCount <= o.options.slidesToShow
            ? i(o.$slider.find('.slick-slide'))
            : o.currentSlide >= o.slideCount - o.options.slidesToShow
            ? i(o.$slider.find('.slick-cloned').slice(0, o.options.slidesToShow))
            : 0 === o.currentSlide && i(o.$slider.find('.slick-cloned').slice(-1 * o.options.slidesToShow));
      }),
      (a.prototype.loadSlider = function () {
        var e = this;
        e.setPosition(),
          e.$slideTrack.css({
            opacity: 1,
          }),
          e.$slider.removeClass('slick-loading'),
          e.initUI(),
          'progressive' === e.options.lazyLoad && e.progressiveLazyLoad();
      }),
      (a.prototype.next = a.prototype.slickNext =
        function () {
          this.changeSlide({
            data: {
              message: 'next',
            },
          });
        }),
      (a.prototype.orientationChange = function () {
        this.checkResponsive(), this.setPosition();
      }),
      (a.prototype.pause = a.prototype.slickPause =
        function () {
          this.autoPlayClear(), (this.paused = !0);
        }),
      (a.prototype.play = a.prototype.slickPlay =
        function () {
          (this.paused = !1), this.autoPlay();
        }),
      (a.prototype.postSlide = function (e) {
        var t = this;
        t.$slider.trigger('afterChange', [t, e]),
          (t.animating = !1),
          t.setPosition(),
          !(t.swipeLeft = null) === t.options.autoplay && !1 === t.paused && t.autoPlay(),
          !0 === t.options.accessibility && t.initADA();
      }),
      (a.prototype.prev = a.prototype.slickPrev =
        function () {
          this.changeSlide({
            data: {
              message: 'previous',
            },
          });
        }),
      (a.prototype.preventDefault = function (e) {
        e.preventDefault();
      }),
      (a.prototype.progressiveLazyLoad = function () {
        var e,
          t = this;
        0 < c('img[data-lazy]', t.$slider).length &&
          (e = c('img[data-lazy]', t.$slider).first())
            .attr('src', e.attr('data-lazy'))
            .removeClass('slick-loading')
            .load(function () {
              e.removeAttr('data-lazy'), t.progressiveLazyLoad(), !0 === t.options.adaptiveHeight && t.setPosition();
            })
            .error(function () {
              e.removeAttr('data-lazy'), t.progressiveLazyLoad();
            });
      }),
      (a.prototype.refresh = function (e) {
        var t = this,
          o = t.currentSlide;
        t.destroy(!0),
          c.extend(t, t.initials, {
            currentSlide: o,
          }),
          t.init(),
          e ||
            t.changeSlide(
              {
                data: {
                  message: 'index',
                  index: o,
                },
              },
              !1,
            );
      }),
      (a.prototype.registerBreakpoints = function () {
        var e,
          t,
          o,
          i = this,
          s = i.options.responsive || null;
        if ('array' === c.type(s) && s.length) {
          for (e in ((i.respondTo = i.options.respondTo || 'window'), s))
            if (((o = i.breakpoints.length - 1), (t = s[e].breakpoint), s.hasOwnProperty(e))) {
              for (; 0 <= o; ) i.breakpoints[o] && i.breakpoints[o] === t && i.breakpoints.splice(o, 1), o--;
              i.breakpoints.push(t), (i.breakpointSettings[t] = s[e].settings);
            }
          i.breakpoints.sort(function (e, t) {
            return i.options.mobileFirst ? e - t : t - e;
          });
        }
      }),
      (a.prototype.reinit = function () {
        var e = this;
        (e.$slides = e.$slideTrack.children(e.options.slide).addClass('slick-slide')),
          (e.slideCount = e.$slides.length),
          e.currentSlide >= e.slideCount &&
            0 !== e.currentSlide &&
            (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
          e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
          e.registerBreakpoints(),
          e.setProps(),
          e.setupInfinite(),
          e.buildArrows(),
          e.updateArrows(),
          e.initArrowEvents(),
          e.buildDots(),
          e.updateDots(),
          e.initDotEvents(),
          e.checkResponsive(!1, !0),
          !0 === e.options.focusOnSelect && c(e.$slideTrack).children().on('click.slick', e.selectHandler),
          e.setSlideClasses(0),
          e.setPosition(),
          e.$slider.trigger('reInit', [e]),
          !0 === e.options.autoplay && e.focusHandler();
      }),
      (a.prototype.resize = function () {
        var e = this;
        c(window).width() !== e.windowWidth &&
          (clearTimeout(e.windowDelay),
          (e.windowDelay = window.setTimeout(function () {
            (e.windowWidth = c(window).width()), e.checkResponsive(), e.unslicked || e.setPosition();
          }, 50)));
      }),
      (a.prototype.removeSlide = a.prototype.slickRemove =
        function (e, t, o) {
          var i = this;
          if (
            ((e = 'boolean' == typeof e ? (!0 === (t = e) ? 0 : i.slideCount - 1) : !0 === t ? --e : e),
            i.slideCount < 1 || e < 0 || e > i.slideCount - 1)
          )
            return !1;
          i.unload(),
            !0 === o ? i.$slideTrack.children().remove() : i.$slideTrack.children(this.options.slide).eq(e).remove(),
            (i.$slides = i.$slideTrack.children(this.options.slide)),
            i.$slideTrack.children(this.options.slide).detach(),
            i.$slideTrack.append(i.$slides),
            (i.$slidesCache = i.$slides),
            i.reinit();
        }),
      (a.prototype.setCSS = function (e) {
        var t,
          o,
          i = this,
          s = {};
        !0 === i.options.rtl && (e = -e),
          (t = 'left' == i.positionProp ? Math.ceil(e) + 'px' : '0px'),
          (o = 'top' == i.positionProp ? Math.ceil(e) + 'px' : '0px'),
          (s[i.positionProp] = e),
          !1 === i.transformsEnabled ||
            (!(s = {}) === i.cssTransitions
              ? (s[i.animType] = 'translate(' + t + ', ' + o + ')')
              : (s[i.animType] = 'translate3d(' + t + ', ' + o + ', 0px)')),
          i.$slideTrack.css(s);
      }),
      (a.prototype.setDimensions = function () {
        var e = this;
        !1 === e.options.vertical
          ? !0 === e.options.centerMode &&
            e.$list.css({
              padding: '0px ' + e.options.centerPadding,
            })
          : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow),
            !0 === e.options.centerMode &&
              e.$list.css({
                padding: e.options.centerPadding + ' 0px',
              })),
          (e.listWidth = e.$list.width()),
          (e.listHeight = e.$list.height()),
          !1 === e.options.vertical && !1 === e.options.variableWidth
            ? ((e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow)),
              e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children('.slick-slide').length)))
            : !0 === e.options.variableWidth
            ? e.$slideTrack.width(5e3 * e.slideCount)
            : ((e.slideWidth = Math.ceil(e.listWidth)),
              e.$slideTrack.height(
                Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children('.slick-slide').length),
              ));
        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
        !1 === e.options.variableWidth && e.$slideTrack.children('.slick-slide').width(e.slideWidth - t);
      }),
      (a.prototype.setFade = function () {
        var o,
          i = this;
        i.$slides.each(function (e, t) {
          (o = i.slideWidth * e * -1),
            !0 === i.options.rtl
              ? c(t).css({
                  position: 'relative',
                  right: o,
                  top: 0,
                  zIndex: i.options.zIndex - 2,
                  opacity: 0,
                })
              : c(t).css({
                  position: 'relative',
                  left: o,
                  top: 0,
                  zIndex: i.options.zIndex - 2,
                  opacity: 0,
                });
        }),
          i.$slides.eq(i.currentSlide).css({
            zIndex: i.options.zIndex - 1,
            opacity: 1,
          });
      }),
      (a.prototype.setHeight = function () {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
          var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
          e.$list.css('height', t);
        }
      }),
      (a.prototype.setOption = a.prototype.slickSetOption =
        function (e, t, o) {
          var i,
            s,
            n = this;
          if ('responsive' === e && 'array' === c.type(t))
            for (s in t)
              if ('array' !== c.type(n.options.responsive)) n.options.responsive = [t[s]];
              else {
                for (i = n.options.responsive.length - 1; 0 <= i; )
                  n.options.responsive[i].breakpoint === t[s].breakpoint && n.options.responsive.splice(i, 1), i--;
                n.options.responsive.push(t[s]);
              }
          else n.options[e] = t;
          !0 === o && (n.unload(), n.reinit());
        }),
      (a.prototype.setPosition = function () {
        var e = this;
        e.setDimensions(),
          e.setHeight(),
          !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(),
          e.$slider.trigger('setPosition', [e]);
      }),
      (a.prototype.setProps = function () {
        var e = this,
          t = document.body.style;
        (e.positionProp = !0 === e.options.vertical ? 'top' : 'left'),
          'top' === e.positionProp ? e.$slider.addClass('slick-vertical') : e.$slider.removeClass('slick-vertical'),
          (void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition) ||
            (!0 === e.options.useCSS && (e.cssTransitions = !0)),
          e.options.fade &&
            ('number' == typeof e.options.zIndex
              ? e.options.zIndex < 3 && (e.options.zIndex = 3)
              : (e.options.zIndex = e.defaults.zIndex)),
          void 0 !== t.OTransform &&
            ((e.animType = 'OTransform'),
            (e.transformType = '-o-transform'),
            (e.transitionType = 'OTransition'),
            void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
          void 0 !== t.MozTransform &&
            ((e.animType = 'MozTransform'),
            (e.transformType = '-moz-transform'),
            (e.transitionType = 'MozTransition'),
            void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)),
          void 0 !== t.webkitTransform &&
            ((e.animType = 'webkitTransform'),
            (e.transformType = '-webkit-transform'),
            (e.transitionType = 'webkitTransition'),
            void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)),
          void 0 !== t.msTransform &&
            ((e.animType = 'msTransform'),
            (e.transformType = '-ms-transform'),
            (e.transitionType = 'msTransition'),
            void 0 === t.msTransform && (e.animType = !1)),
          void 0 !== t.transform &&
            !1 !== e.animType &&
            ((e.animType = 'transform'), (e.transformType = 'transform'), (e.transitionType = 'transition')),
          (e.transformsEnabled = null !== e.animType && !1 !== e.animType);
      }),
      (a.prototype.setSlideClasses = function (e) {
        var t,
          o,
          i,
          s,
          n = this;
        (o = n.$slider
          .find('.slick-slide')
          .removeClass('slick-active slick-center slick-current')
          .attr('aria-hidden', 'true')),
          n.$slides.eq(e).addClass('slick-current'),
          !0 === n.options.centerMode
            ? ((t = Math.floor(n.options.slidesToShow / 2)),
              !0 === n.options.infinite &&
                (t <= e && e <= n.slideCount - 1 - t
                  ? n.$slides
                      .slice(e - t, e + t + 1)
                      .addClass('slick-active')
                      .attr('aria-hidden', 'false')
                  : ((i = n.options.slidesToShow + e),
                    o
                      .slice(i - t + 1, i + t + 2)
                      .addClass('slick-active')
                      .attr('aria-hidden', 'false')),
                0 === e
                  ? o.eq(o.length - 1 - n.options.slidesToShow).addClass('slick-center')
                  : e === n.slideCount - 1 && o.eq(n.options.slidesToShow).addClass('slick-center')),
              n.$slides.eq(e).addClass('slick-center'))
            : 0 <= e && e <= n.slideCount - n.options.slidesToShow
            ? n.$slides
                .slice(e, e + n.options.slidesToShow)
                .addClass('slick-active')
                .attr('aria-hidden', 'false')
            : o.length <= n.options.slidesToShow
            ? o.addClass('slick-active').attr('aria-hidden', 'false')
            : ((s = n.slideCount % n.options.slidesToShow),
              (i = !0 === n.options.infinite ? n.options.slidesToShow + e : e),
              n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - e < n.options.slidesToShow
                ? o
                    .slice(i - (n.options.slidesToShow - s), i + s)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false')
                : o
                    .slice(i, i + n.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false')),
          'ondemand' === n.options.lazyLoad && n.lazyLoad();
      }),
      (a.prototype.setupInfinite = function () {
        var e,
          t,
          o,
          i = this;
        if (
          (!0 === i.options.fade && (i.options.centerMode = !1),
          !0 === i.options.infinite && !1 === i.options.fade && ((t = null), i.slideCount > i.options.slidesToShow))
        ) {
          for (
            o = !0 === i.options.centerMode ? i.options.slidesToShow + 1 : i.options.slidesToShow, e = i.slideCount;
            e > i.slideCount - o;
            e -= 1
          )
            (t = e - 1),
              c(i.$slides[t])
                .clone(!0)
                .attr('id', '')
                .attr('data-slick-index', t - i.slideCount)
                .prependTo(i.$slideTrack)
                .addClass('slick-cloned');
          for (e = 0; e < o; e += 1)
            (t = e),
              c(i.$slides[t])
                .clone(!0)
                .attr('id', '')
                .attr('data-slick-index', t + i.slideCount)
                .appendTo(i.$slideTrack)
                .addClass('slick-cloned');
          i.$slideTrack
            .find('.slick-cloned')
            .find('[id]')
            .each(function () {
              c(this).attr('id', '');
            });
        }
      }),
      (a.prototype.setPaused = function (e) {
        var t = this;
        !0 === t.options.autoplay &&
          !0 === t.options.pauseOnHover &&
          ((t.paused = e) ? t.autoPlayClear() : t.autoPlay());
      }),
      (a.prototype.selectHandler = function (e) {
        var t = this,
          o = c(e.target).is('.slick-slide') ? c(e.target) : c(e.target).parents('.slick-slide'),
          i = parseInt(o.attr('data-slick-index'));
        if ((i || (i = 0), t.slideCount <= t.options.slidesToShow)) return t.setSlideClasses(i), void t.asNavFor(i);
        t.slideHandler(i);
      }),
      (a.prototype.slideHandler = function (e, t, o) {
        var i,
          s,
          n,
          a,
          r,
          l = this;
        if (
          ((t = t || !1),
          (!0 !== l.animating || !0 !== l.options.waitForAnimate) &&
            !((!0 === l.options.fade && l.currentSlide === e) || l.slideCount <= l.options.slidesToShow))
        )
          if (
            (!1 === t && l.asNavFor(e),
            (i = e),
            (r = l.getLeft(i)),
            (a = l.getLeft(l.currentSlide)),
            (l.currentLeft = null === l.swipeLeft ? a : l.swipeLeft),
            !1 === l.options.infinite &&
              !1 === l.options.centerMode &&
              (e < 0 || e > l.getDotCount() * l.options.slidesToScroll))
          )
            !1 === l.options.fade &&
              ((i = l.currentSlide),
              !0 !== o
                ? l.animateSlide(a, function () {
                    l.postSlide(i);
                  })
                : l.postSlide(i));
          else if (
            !1 === l.options.infinite &&
            !0 === l.options.centerMode &&
            (e < 0 || e > l.slideCount - l.options.slidesToScroll)
          )
            !1 === l.options.fade &&
              ((i = l.currentSlide),
              !0 !== o
                ? l.animateSlide(a, function () {
                    l.postSlide(i);
                  })
                : l.postSlide(i));
          else {
            if (
              (!0 === l.options.autoplay && clearInterval(l.autoPlayTimer),
              (s =
                i < 0
                  ? l.slideCount % l.options.slidesToScroll != 0
                    ? l.slideCount - (l.slideCount % l.options.slidesToScroll)
                    : l.slideCount + i
                  : i >= l.slideCount
                  ? l.slideCount % l.options.slidesToScroll != 0
                    ? 0
                    : i - l.slideCount
                  : i),
              (l.animating = !0),
              l.$slider.trigger('beforeChange', [l, l.currentSlide, s]),
              (n = l.currentSlide),
              (l.currentSlide = s),
              l.setSlideClasses(l.currentSlide),
              l.updateDots(),
              l.updateArrows(),
              !0 === l.options.fade)
            )
              return (
                !0 !== o
                  ? (l.fadeSlideOut(n),
                    l.fadeSlide(s, function () {
                      l.postSlide(s);
                    }))
                  : l.postSlide(s),
                void l.animateHeight()
              );
            !0 !== o
              ? l.animateSlide(r, function () {
                  l.postSlide(s);
                })
              : l.postSlide(s);
          }
      }),
      (a.prototype.startLoad = function () {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()),
          !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(),
          e.$slider.addClass('slick-loading');
      }),
      (a.prototype.swipeDirection = function () {
        var e,
          t,
          o,
          i,
          s = this;
        return (
          (e = s.touchObject.startX - s.touchObject.curX),
          (t = s.touchObject.startY - s.touchObject.curY),
          (o = Math.atan2(t, e)),
          (i = Math.round((180 * o) / Math.PI)) < 0 && (i = 360 - Math.abs(i)),
          i <= 45 && 0 <= i
            ? !1 === s.options.rtl
              ? 'left'
              : 'right'
            : i <= 360 && 315 <= i
            ? !1 === s.options.rtl
              ? 'left'
              : 'right'
            : 135 <= i && i <= 225
            ? !1 === s.options.rtl
              ? 'right'
              : 'left'
            : !0 === s.options.verticalSwiping
            ? 35 <= i && i <= 135
              ? 'left'
              : 'right'
            : 'vertical'
        );
      }),
      (a.prototype.swipeEnd = function (e) {
        var t,
          o = this;
        if (((o.dragging = !1), (o.shouldClick = !(10 < o.touchObject.swipeLength)), void 0 === o.touchObject.curX))
          return !1;
        if (
          (!0 === o.touchObject.edgeHit && o.$slider.trigger('edge', [o, o.swipeDirection()]),
          o.touchObject.swipeLength >= o.touchObject.minSwipe)
        )
          switch (o.swipeDirection()) {
            case 'left':
              (t = o.options.swipeToSlide
                ? o.checkNavigable(o.currentSlide + o.getSlideCount())
                : o.currentSlide + o.getSlideCount()),
                o.slideHandler(t),
                (o.currentDirection = 0),
                (o.touchObject = {}),
                o.$slider.trigger('swipe', [o, 'left']);
              break;
            case 'right':
              (t = o.options.swipeToSlide
                ? o.checkNavigable(o.currentSlide - o.getSlideCount())
                : o.currentSlide - o.getSlideCount()),
                o.slideHandler(t),
                (o.currentDirection = 1),
                (o.touchObject = {}),
                o.$slider.trigger('swipe', [o, 'right']);
          }
        else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), (o.touchObject = {}));
      }),
      (a.prototype.swipeHandler = function (e) {
        var t = this;
        if (
          !(
            !1 === t.options.swipe ||
            ('ontouchend' in document && !1 === t.options.swipe) ||
            (!1 === t.options.draggable && -1 !== e.type.indexOf('mouse'))
          )
        )
          switch (
            ((t.touchObject.fingerCount =
              e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1),
            (t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold),
            !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold),
            e.data.action)
          ) {
            case 'start':
              t.swipeStart(e);
              break;
            case 'move':
              t.swipeMove(e);
              break;
            case 'end':
              t.swipeEnd(e);
          }
      }),
      (a.prototype.swipeMove = function (e) {
        var t,
          o,
          i,
          s,
          n,
          a = this;
        return (
          (n = void 0 !== e.originalEvent ? e.originalEvent.touches : null),
          !(!a.dragging || (n && 1 !== n.length)) &&
            ((t = a.getLeft(a.currentSlide)),
            (a.touchObject.curX = void 0 !== n ? n[0].pageX : e.clientX),
            (a.touchObject.curY = void 0 !== n ? n[0].pageY : e.clientY),
            (a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2)))),
            !0 === a.options.verticalSwiping &&
              (a.touchObject.swipeLength = Math.round(
                Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2)),
              )),
            'vertical' !== (o = a.swipeDirection())
              ? (void 0 !== e.originalEvent && 4 < a.touchObject.swipeLength && e.preventDefault(),
                (s = (!1 === a.options.rtl ? 1 : -1) * (a.touchObject.curX > a.touchObject.startX ? 1 : -1)),
                !0 === a.options.verticalSwiping && (s = a.touchObject.curY > a.touchObject.startY ? 1 : -1),
                (i = a.touchObject.swipeLength),
                (a.touchObject.edgeHit = !1) === a.options.infinite &&
                  ((0 === a.currentSlide && 'right' === o) || (a.currentSlide >= a.getDotCount() && 'left' === o)) &&
                  ((i = a.touchObject.swipeLength * a.options.edgeFriction), (a.touchObject.edgeHit = !0)),
                !1 === a.options.vertical
                  ? (a.swipeLeft = t + i * s)
                  : (a.swipeLeft = t + i * (a.$list.height() / a.listWidth) * s),
                !0 === a.options.verticalSwiping && (a.swipeLeft = t + i * s),
                !0 !== a.options.fade &&
                  !1 !== a.options.touchMove &&
                  (!0 === a.animating ? ((a.swipeLeft = null), !1) : void a.setCSS(a.swipeLeft)))
              : void 0)
        );
      }),
      (a.prototype.swipeStart = function (e) {
        var t,
          o = this;
        if (1 !== o.touchObject.fingerCount || o.slideCount <= o.options.slidesToShow) return !(o.touchObject = {});
        void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]),
          (o.touchObject.startX = o.touchObject.curX = void 0 !== t ? t.pageX : e.clientX),
          (o.touchObject.startY = o.touchObject.curY = void 0 !== t ? t.pageY : e.clientY),
          (o.dragging = !0);
      }),
      (a.prototype.unfilterSlides = a.prototype.slickUnfilter =
        function () {
          var e = this;
          null !== e.$slidesCache &&
            (e.unload(),
            e.$slideTrack.children(this.options.slide).detach(),
            e.$slidesCache.appendTo(e.$slideTrack),
            e.reinit());
        }),
      (a.prototype.unload = function () {
        var e = this;
        c('.slick-cloned', e.$slider).remove(),
          e.$dots && e.$dots.remove(),
          e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(),
          e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(),
          e.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');
      }),
      (a.prototype.unslick = function (e) {
        this.$slider.trigger('unslick', [this, e]), this.destroy();
      }),
      (a.prototype.updateArrows = function () {
        var e = this;
        Math.floor(e.options.slidesToShow / 2),
          !0 === e.options.arrows &&
            e.slideCount > e.options.slidesToShow &&
            !e.options.infinite &&
            (e.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'),
            e.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'),
            0 === e.currentSlide
              ? (e.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true'),
                e.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'))
              : e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode
              ? (e.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true'),
                e.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'))
              : e.currentSlide >= e.slideCount - 1 &&
                !0 === e.options.centerMode &&
                (e.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true'),
                e.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false')));
      }),
      (a.prototype.updateDots = function () {
        var e = this;
        null !== e.$dots &&
          (e.$dots.find('li').removeClass('slick-active').attr('aria-hidden', 'true'),
          e.$dots
            .find('li')
            .eq(Math.floor(e.currentSlide / e.options.slidesToScroll))
            .addClass('slick-active')
            .attr('aria-hidden', 'false'));
      }),
      (a.prototype.visibility = function () {
        var e = this;
        document[e.hidden]
          ? ((e.paused = !0), e.autoPlayClear())
          : !0 === e.options.autoplay && ((e.paused = !1), e.autoPlay());
      }),
      (a.prototype.initADA = function () {
        var t = this;
        t.$slides
          .add(t.$slideTrack.find('.slick-cloned'))
          .attr({
            'aria-hidden': 'true',
            tabindex: '-1',
          })
          .find('a, input, button, select')
          .attr({
            tabindex: '-1',
          }),
          t.$slideTrack.attr('role', 'listbox'),
          t.$slides.not(t.$slideTrack.find('.slick-cloned')).each(function (e) {
            c(this).attr({
              role: 'option',
              'aria-describedby': 'slick-slide' + t.instanceUid + e,
            });
          }),
          null !== t.$dots &&
            t.$dots
              .attr('role', 'tablist')
              .find('li')
              .each(function (e) {
                c(this).attr({
                  role: 'presentation',
                  'aria-selected': 'false',
                  'aria-controls': 'navigation' + t.instanceUid + e,
                  id: 'slick-slide' + t.instanceUid + e,
                });
              })
              .first()
              .attr('aria-selected', 'true')
              .end()
              .find('button')
              .attr('role', 'button')
              .end()
              .closest('div')
              .attr('role', 'toolbar'),
          t.activateADA();
      }),
      (a.prototype.activateADA = function () {
        var e = this.$slider.find('*').is(':focus');
        this.$slideTrack
          .find('.slick-active')
          .attr({
            'aria-hidden': 'false',
            tabindex: '0',
          })
          .find('a, input, button, select')
          .attr({
            tabindex: '0',
          }),
          e && this.$slideTrack.find('.slick-active').focus();
      }),
      (a.prototype.focusHandler = function () {
        var o = this;
        o.$slider.on('focus.slick blur.slick', '*', function (e) {
          e.stopImmediatePropagation();
          var t = c(this);
          setTimeout(function () {
            o.isPlay && (t.is(':focus') ? (o.autoPlayClear(), (o.paused = !0)) : ((o.paused = !1), o.autoPlay()));
          }, 0);
        });
      }),
      (c.fn.slick = function () {
        for (
          var e, t = this, o = arguments[0], i = Array.prototype.slice.call(arguments, 1), s = t.length, n = 0;
          n < s;
          n++
        )
          if (
            ('object' == typeof o || void 0 === o
              ? (t[n].slick = new a(t[n], o))
              : (e = t[n].slick[o].apply(t[n].slick, i)),
            void 0 !== e)
          )
            return e;
        return t;
      });
  }),
  (function s(n, a, r) {
    function l(o, e) {
      if (!a[o]) {
        if (!n[o]) {
          var t = 'function' == typeof require && require;
          if (!e && t) return t(o, !0);
          if (c) return c(o, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        var i = (a[o] = {
          exports: {},
        });
        n[o][0].call(
          i.exports,
          function (e) {
            var t = n[o][1][e];
            return l(t || e);
          },
          i,
          i.exports,
          s,
          n,
          a,
          r,
        );
      }
      return a[o].exports;
    }
    for (var c = 'function' == typeof require && require, e = 0; e < r.length; e++) l(r[e]);
    return l;
  })(
    {
      1: [
        function (e, t) {
          function o(e, t, o) {
            (this.widget = e), (this.likely = t), (this.options = a.merge(o)), this.init();
          }
          var s = e('./services'),
            i = e('./config'),
            n = e('./fetch'),
            a = e('./utils'),
            r = e('./dom'),
            l = '<span class="{className}">{content}</span>';
          (o.prototype = {
            init: function () {
              this.detectService(),
                this.detectParams(),
                this.service && (this.initHtml(), setTimeout(this.initCounter.bind(this), 0));
            },
            update: function (e) {
              var t = '.' + i.prefix + 'counter';
              (counters = r.findAll(t, this.widget)),
                a.extend(
                  this.options,
                  a.merge(
                    {
                      forceUpdate: !1,
                    },
                    e,
                  ),
                ),
                a.toArray(counters).forEach(function (e) {
                  e.parentNode.removeChild(e);
                }),
                this.initCounter();
            },
            detectService: function () {
              var e = this.widget,
                t = a.getDataset(e).service;
              if (!t) {
                for (var o = e.className.split(' '), i = 0; i < o.length && !(o[i] in s); i++);
                t = o[i];
              }
              t && ((this.service = t), a.extend(this.options, s[t]));
            },
            detectParams: function () {
              var e = this.options,
                t = a.getDataset(this.widget);
              if (t.counter) {
                var o = parseInt(t.counter, 10);
                isNaN(o) ? (e.counterUrl = t.counter) : (e.counterNumber = o);
              }
              (e.title = t.title || e.title), (e.url = t.url || e.url);
            },
            initHtml: function () {
              var e = this.options,
                t = this.widget,
                o = t.innerHTML;
              t.addEventListener('click', this.click.bind(this)),
                t.classList.remove(this.service),
                (t.className += ' ' + this.className('widget'));
              var i = a.template(l, {
                  className: this.className('button'),
                  content: o,
                }),
                s = a.template(l, {
                  className: this.className('icon'),
                  content: r.wrapSVG(e.svgi),
                });
              t.innerHTML = s + i;
            },
            initCounter: function () {
              var e = this.options;
              e.counters && e.counterNumber
                ? this.updateCounter(e.counterNumber)
                : e.counterUrl && n(this.service, e.url, e)(this.updateCounter.bind(this));
            },
            className: function (e) {
              var t = i.prefix + e;
              return t + ' ' + t + '_' + this.service;
            },
            updateCounter: function (e) {
              e = parseInt(e, 10) || 0;
              var t = r.find('.' + i.name + '__counter', this.widget);
              t && t.parentNode.removeChild(t);
              var o = {
                className: this.className('counter'),
                content: e,
              };
              e || this.options.zeroes || ((o.className += ' ' + i.prefix + 'counter_empty'), (o.content = '')),
                this.widget.appendChild(r.createNode(a.template(l, o))),
                this.likely.updateCounter(this.service, e);
            },
            click: function () {
              var e = this.options;
              if (e.click.call(this)) {
                var t = a.makeUrl(e.popupUrl, {
                  url: e.url,
                  title: e.title,
                });
                r.openPopup(this.addAdditionalParamsToUrl(t), i.prefix + this.service, e.popupWidth, e.popupHeight);
              }
              return !1;
            },
            addAdditionalParamsToUrl: function (e) {
              var t = a.query(a.merge(this.widget.dataset, this.options.data)),
                o = -1 === e.indexOf('?') ? '?' : '&';
              return '' === t ? e : e + o + t;
            },
          }),
            (t.exports = o);
        },
        {
          './config': 2,
          './dom': 3,
          './fetch': 6,
          './services': 11,
          './utils': 17,
        },
      ],
      2: [
        function (e, t) {
          var o = 'https:' === window.location.protocol;
          t.exports = {
            name: 'likely',
            prefix: 'likely__',
            secure: o,
            protocol: o ? 'https:' : 'http:',
          };
        },
        {},
      ],
      3: [
        function (e, t) {
          var o = document.createElement('div'),
            i = 0,
            s = (t.exports = {
              wrapSVG: function (e) {
                return (
                  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M' +
                  e +
                  'z"/></svg>'
                );
              },
              createNode: function (e) {
                return (o.innerHTML = e), o.children[0];
              },
              getScript: function (e) {
                var t = document.createElement('script'),
                  o = document.head;
                (t.type = 'text/javascript'), (t.src = e), o.appendChild(t), o.removeChild(t);
              },
              getJSON: function (e, t) {
                var o = encodeURIComponent('random_fun_' + ++i);
                (e = e.replace(/callback=(\?)/, 'callback=' + o)), (window[o] = t), s.getScript(e);
              },
              find: function (e, t) {
                return (t || document).querySelector(e);
              },
              findAll: function (e, t) {
                return (t || document).querySelectorAll(e);
              },
              openPopup: function (e, t, o, i) {
                var s = Math.round(screen.width / 2 - o / 2),
                  n = 0;
                screen.height > i && (n = Math.round(screen.height / 3 - i / 2));
                var a =
                    'left=' +
                    s +
                    ',top=' +
                    n +
                    ',width=' +
                    o +
                    ',height=' +
                    i +
                    ',personalbar=0,toolbar=0,scrollbars=1,resizable=1',
                  r = window.open(e, t, a);
                return r ? (r.focus(), r) : (location.href = e);
              },
            });
        },
        {},
      ],
      4: [
        function (e, t) {
          t.exports = function (o) {
            var i = [];
            return function (t) {
              var e = typeof t;
              return 'undefined' == e
                ? o
                : void ('function' == e
                    ? i.push(t)
                    : ((o = t),
                      i.forEach(function (e) {
                        e(t);
                      })));
            };
          };
        },
        {},
      ],
      5: [
        function (e) {
          var t = e('./index.js');
          (window.likely = t), window.addEventListener('load', t.initiate);
        },
        {
          './index.js': 7,
        },
      ],
      6: [
        function (e, t) {
          var a = e('./services'),
            r = e('./factory'),
            l = e('./utils'),
            c = (e('./dom'), {});
          t.exports = function (e, t, o) {
            c[e] || (c[e] = {});
            var i = c[e],
              s = i[t];
            s = r();
            var n = l.makeUrl(o.counterUrl, {
              url: t,
            });
            return a[e].counter(n, s, t), (i[t] = s);
          };
        },
        {
          './dom': 3,
          './factory': 4,
          './services': 11,
          './utils': 17,
        },
      ],
      7: [
        function (e, t) {
          'use strict';
          var i = e('./widget'),
            s = e('./config'),
            n = e('./utils'),
            o = e('./dom'),
            a = function (e, t) {
              t = t || {};
              var o = e[s.name];
              return o ? o.update(t) : (e[s.name] = new i(e, n.merge({}, a.defaults, t, n.bools(e)))), o;
            };
          (a.initiate = a.initate =
            function () {
              var e = o.findAll('.' + s.name);
              n.toArray(e).forEach(a);
            }),
            (a.defaults = {
              counters: !0,
              timeout: 1e3,
              zeroes: !1,
              title: document.title,
              wait: 500,
              url: window.location.href.replace(window.location.hash, ''),
            }),
            (t.exports = a);
        },
        {
          './config': 2,
          './dom': 3,
          './utils': 17,
          './widget': 18,
        },
      ],
      8: [
        function (e, t) {
          var i = e('./dom'),
            o = function (e, t) {
              var o = this;
              i.getJSON(e, function (e) {
                try {
                  'function' == typeof o.convertNumber && (e = o.convertNumber(e)), t(e);
                } catch (e) {}
              });
            };
          t.exports = function (e) {
            (e.counter = e.counter || o),
              (e.click =
                e.click ||
                function () {
                  return !0;
                });
          };
        },
        {
          './dom': 3,
        },
      ],
      9: [
        function (e, t) {
          t.exports = {
            counterUrl:
              'https://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=?',
            convertNumber: function (e) {
              return e.data[0].total_count;
            },
            popupUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
            popupWidth: 600,
            popupHeight: 500,
          };
        },
        {},
      ],
      10: [
        function (e, t) {
          var o =
            (e('../config'),
            e('../utils'),
            e('../dom'),
            {
              counterUrl: 'https://share.yandex.net/counter/gpp/?url={url}&callback=?',
              gid: 0,
              promises: {},
              popupUrl: 'https://plus.google.com/share?url={url}',
              popupWidth: 700,
              popupHeight: 500,
            });
          t.exports = o;
        },
        {
          '../config': 2,
          '../dom': 3,
          '../utils': 17,
        },
      ],
      11: [
        function (e, t) {
          var o = e('../service'),
            i = e('../utils'),
            s = e('../svg.json'),
            n = {
              odnoklassniki: e('./odnoklassniki'),
              vkontakte: e('./vk'),
              pinterest: e('./pinterest'),
              facebook: e('./facebook'),
              twitter: e('./twitter'),
              gplus: e('./gplus'),
            };
          i.each(n, function (e, t) {
            o(e), (e.svgi = s[t]), (e.name = t);
          }),
            (t.exports = n);
        },
        {
          '../service': 8,
          '../svg.json': 16,
          '../utils': 17,
          './facebook': 9,
          './gplus': 10,
          './odnoklassniki': 12,
          './pinterest': 13,
          './twitter': 14,
          './vk': 15,
        },
      ],
      12: [
        function (e, t) {
          var o = e('../config'),
            i = e('../utils'),
            s = e('../dom'),
            n = {
              counterUrl: o.secure ? void 0 : 'http://connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}',
              counter: function (e, t) {
                this.promises.push(t),
                  s.getScript(
                    i.makeUrl(e, {
                      index: this.promises.length - 1,
                    }),
                  );
              },
              promises: [],
              popupUrl: 'http://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}',
              popupWidth: 640,
              popupHeight: 400,
            };
          i.set(window, 'ODKL.updateCount', function (e, t) {
            n.promises[e](t);
          }),
            (t.exports = n);
        },
        {
          '../config': 2,
          '../dom': 3,
          '../utils': 17,
        },
      ],
      13: [
        function (e, t) {
          var o = e('../config');
          t.exports = {
            counterUrl: o.protocol + '//api.pinterest.com/v1/urls/count.json?url={url}&callback=?',
            convertNumber: function (e) {
              return e.count;
            },
            popupUrl: o.protocol + '//pinterest.com/pin/create/button/?url={url}&description={title}',
            popupWidth: 630,
            popupHeight: 270,
          };
        },
        {
          '../config': 2,
        },
      ],
      14: [
        function (e, t) {
          t.exports = {
            popupUrl: 'https://twitter.com/intent/tweet?url={url}&text={title}',
            popupWidth: 600,
            popupHeight: 450,
            click: function () {
              return /[\.\?:\-–—]\s*$/.test(this.options.title) || (this.options.title += ':'), !0;
            },
          };
        },
        {},
      ],
      15: [
        function (e, t) {
          var o = e('../config'),
            i = e('../utils'),
            s = e('../dom'),
            n = {
              counterUrl: 'https://vk.com/share.php?act=count&url={url}&index={index}',
              counter: function (e, t) {
                this.promises.push(t),
                  s.getScript(
                    i.makeUrl(e, {
                      index: this.promises.length - 1,
                    }),
                  );
              },
              promises: [],
              popupUrl: o.protocol + '//vk.com/share.php?url={url}&title={title}',
              popupWidth: 550,
              popupHeight: 330,
            };
          i.set(window, 'VK.Share.count', function (e, t) {
            n.promises[e](t);
          }),
            (t.exports = n);
        },
        {
          '../config': 2,
          '../dom': 3,
          '../utils': 17,
        },
      ],
      16: [
        function (e, t) {
          t.exports = {
            facebook:
              '13 0H3C1 0 0 1 0 3v10c0 2 1 3 3 3h5V9H6V7h2V5c0-2 2-2 2-2h3v2h-3v2h3l-.5 2H10v7h3c2 0 3-1 3-3V3c0-2-1-3-3-3',
            twitter:
              '15.96 3.42c-.04.153-.144.31-.237.414l-.118.058v.118l-.59.532-.237.295c-.05.036-.398.21-.413.237V6.49h-.06v.473h-.058v.294h-.058v.296h-.06v.235h-.06v.237h-.058c-.1.355-.197.71-.295 1.064h-.06v.116h-.06c-.02.1-.04.197-.058.296h-.06c-.04.118-.08.237-.118.355h-.06c-.038.118-.078.236-.117.353l-.118.06-.06.235-.117.06v.116l-.118.06v.12h-.06c-.02.057-.038.117-.058.175l-.118.06v.117c-.06.04-.118.08-.177.118v.118l-.237.177v.118l-.59.53-.532.592h-.117c-.06.078-.118.156-.177.236l-.177.06-.06.117h-.118l-.06.118-.176.06v.058h-.118l-.06.118-.353.12-.06.117c-.078.02-.156.04-.235.058v.06c-.118.038-.236.078-.354.118v.058H8.76v.06h-.12v.06h-.176v.058h-.118v.06H8.17v.058H7.99v.06l-.413.058v.06h-.237c-.667.22-1.455.293-2.36.293h-.886v-.058h-.53v-.06H3.27v-.06h-.295v-.06H2.68v-.057h-.177v-.06h-.236v-.058H2.09v-.06h-.177v-.058h-.177v-.06H1.56v-.058h-.12v-.06l-.294-.06v-.057c-.118-.04-.236-.08-.355-.118v-.06H.674v-.058H.555v-.06H.437v-.058H.32l-.06-.12H.142v-.058c-.13-.08-.083.026-.177-.118H1.56v-.06c.294-.04.59-.077.884-.117v-.06h.177v-.058h.237v-.06h.118v-.06h.177v-.057h.118v-.06h.177v-.058l.236-.06v-.058l.236-.06c.02-.038.04-.078.058-.117l.237-.06c.02-.04.04-.077.058-.117h.118l.06-.118h.118c.036-.025.047-.078.118-.118V12.1c-1.02-.08-1.84-.54-2.303-1.183-.08-.058-.157-.118-.236-.176v-.117l-.118-.06v-.117c-.115-.202-.268-.355-.296-.65.453.004.987.008 1.354-.06v-.06c-.254-.008-.47-.08-.65-.175v-.058H2.32v-.06c-.08-.02-.157-.04-.236-.058l-.06-.118h-.117l-.118-.178h-.12c-.077-.098-.156-.196-.235-.294l-.118-.06v-.117l-.177-.12c-.35-.502-.6-1.15-.59-2.006h.06c.204.234.948.377 1.357.415v-.06c-.257-.118-.676-.54-.827-.768V5.9l-.118-.06c-.04-.117-.08-.236-.118-.354h-.06v-.118H.787c-.04-.196-.08-.394-.118-.59-.06-.19-.206-.697-.118-1.005h.06V3.36h.058v-.177h.06v-.177h.057V2.83h.06c.04-.118.078-.236.117-.355h.118v.06c.12.097.237.196.355.295v.118l.118.058c.08.098.157.197.236.295l.176.06.354.413h.118l.177.236h.118l.06.117h.117c.04.06.08.118.118.177h.118l.06.118.235.06.06.117.356.12.06.117.53.176v.06h.118v.058l.236.06v.06c.118.02.236.04.355.058v.06h.177v.058h.177v.06h.176v.058h.236v.06l.472.057v.06l1.417.18v-.237c-.1-.112-.058-.442-.057-.65 0-.573.15-.99.354-1.358v-.117l.118-.06.06-.235.176-.118v-.118c.14-.118.276-.236.414-.355l.06-.117h.117l.12-.177.235-.06.06-.117h.117v-.058H9.7v-.058h.177v-.06h.177v-.058h.177v-.06h.296v-.058h1.063v.058h.294v.06h.177v.058h.178v.06h.177v.058h.118v.06h.118l.06.117c.08.018.158.038.236.058.04.06.08.118.118.177h.118l.06.117c.142.133.193.163.472.178.136-.12.283-.05.472-.118v-.06h.177v-.058h.177v-.06l.236-.058v-.06h.177l.59-.352v.176h-.058l-.06.295h-.058v.117h-.06v.118l-.117.06v.118l-.177.118v.117l-.118.06-.354.412h-.117l-.177.236h.06c.13-.112.402-.053.59-.117l1.063-.353',
            vkontakte:
              '13 0H3C1 0 0 1 0 3v10c0 2 1 3 3 3h10c2 0 3-1 3-3V3c0-2-1-3-3-3zm.452 11.394l-1.603.022s-.345.068-.8-.243c-.598-.41-1.164-1.48-1.604-1.342-.446.144-.432 1.106-.432 1.106s.003.206-.1.315c-.11.12-.326.144-.326.144H7.87s-1.582.095-2.975-1.356c-1.52-1.583-2.862-4.723-2.862-4.723s-.078-.206.006-.305c.094-.112.35-.12.35-.12l1.716-.01s.162.026.277.11c.095.07.15.202.15.202s.276.7.643 1.335c.716 1.238 1.05 1.508 1.293 1.376.353-.193.247-1.75.247-1.75s.006-.565-.178-.817c-.145-.194-.415-.25-.534-.267-.096-.014.062-.238.267-.338.31-.15.853-.16 1.497-.153.502.004.646.035.842.083.59.143.39.694.39 2.016 0 .422-.075 1.018.23 1.215.13.085.453.013 1.256-1.352.38-.647.666-1.407.666-1.407s.062-.136.16-.194c.098-.06.232-.04.232-.04l1.804-.012s.542-.065.63.18c.092.257-.203.857-.94 1.84-1.21 1.612-1.345 1.46-.34 2.394.96.89 1.16 1.325 1.192 1.38.4.66-.44.71-.44.71',
            gplus:
              '8,6.5v3h4.291c-0.526,2.01-2.093,3.476-4.315,3.476C5.228,12.976,3,10.748,3,8c0-2.748,2.228-4.976,4.976-4.976c1.442,0,2.606,0.623,3.397,1.603L13.52,2.48C12.192,0.955,10.276,0,8,0C3.582,0,0,3.582,0,8s3.582,8,8,8s7.5-3.582,7.5-8V6.5H8',
            pinterest:
              '7.99 0c-4.417 0-8 3.582-8 8 0 3.39 2.11 6.284 5.086 7.45-.07-.633-.133-1.604.028-2.295.145-.624.938-3.977.938-3.977s-.24-.48-.24-1.188c0-1.112.645-1.943 1.448-1.943.683 0 1.012.512 1.012 1.127 0 .686-.437 1.713-.663 2.664-.19.796.398 1.446 1.184 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.255-3.343-3.255-2.276 0-3.612 1.707-3.612 3.472 0 .688.265 1.425.595 1.826.065.08.075.15.055.23-.06.252-.195.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.835-4.84 5.287-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.74 4.976-4.152 4.976-.81 0-1.573-.42-1.834-.92l-.498 1.903c-.18.695-.668 1.566-.994 2.097.75.232 1.544.357 2.37.357 4.417 0 8-3.582 8-8s-3.583-8-8-8',
            odnoklassniki:
              '8 6.107c.888 0 1.607-.72 1.607-1.607 0-.888-.72-1.607-1.607-1.607s-1.607.72-1.607 1.607c0 .888.72 1.607 1.607 1.607zM13 0H3C1 0 0 1 0 3v10c0 2 1 3 3 3h10c2 0 3-1 3-3V3c0-2-1-3-3-3zM8 .75c2.07 0 3.75 1.68 3.75 3.75 0 2.07-1.68 3.75-3.75 3.75S4.25 6.57 4.25 4.5C4.25 2.43 5.93.75 8 .75zm3.826 12.634c.42.42.42 1.097 0 1.515-.21.208-.483.313-.758.313-.274 0-.548-.105-.758-.314L8 12.59 5.69 14.9c-.42.418-1.098.418-1.516 0s-.42-1.098 0-1.516L6.357 11.2c-1.303-.386-2.288-1.073-2.337-1.11-.473-.354-.57-1.025-.214-1.5.354-.47 1.022-.567 1.496-.216.03.022 1.4.946 2.698.946 1.31 0 2.682-.934 2.693-.943.474-.355 1.146-.258 1.5.213.355.474.26 1.146-.214 1.5-.05.036-1.035.723-2.338 1.11l2.184 2.184',
          };
        },
        {},
      ],
      17: [
        function (e, t) {
          var n = {
              yes: !0,
              no: !1,
            },
            a = {
              each: function (e, t) {
                for (var o in e) e.hasOwnProperty(o) && t(e[o], o);
              },
              toArray: function (e) {
                return Array.prototype.slice.call(e);
              },
              merge: function () {
                for (var e = {}, t = 0; t < arguments.length; t++) {
                  var o = arguments[t];
                  if (o) for (var i in o) e[i] = o[i];
                }
                return e;
              },
              extend: function (e, t) {
                for (var o in t) e[o] = t[o];
              },
              getDataset: function (e) {
                if ('object' == typeof e.dataset) return e.dataset;
                var t,
                  o,
                  i = {},
                  s = e.attributes,
                  n = function (e) {
                    return e.charAt(1).toUpperCase();
                  };
                for (t = s.length - 1; 0 <= t; t--)
                  (o = s[t]) &&
                    o.name &&
                    /^data-\w[\w\-]*$/.test(o.name) &&
                    (i[o.name.substr(5).replace(/-./g, n)] = o.value);
                return i;
              },
              bools: function (e) {
                var t = {},
                  o = a.getDataset(e);
                for (var i in o) {
                  var s = o[i];
                  t[i] = n[s] || s;
                }
                return t;
              },
              template: function (e, o) {
                return e
                  ? e.replace(/\{([^\}]+)\}/g, function (e, t) {
                      return t in o ? o[t] : e;
                    })
                  : '';
              },
              makeUrl: function (e, t) {
                for (var o in t) t[o] = encodeURIComponent(t[o]);
                return a.template(e, t);
              },
              query: function (e) {
                var t = encodeURIComponent,
                  o = [];
                for (var i in e) 'object' != typeof e[i] && o.push(t(i) + '=' + t(e[i]));
                return o.join('&');
              },
              set: function (o, e, t) {
                var i = e.split('.'),
                  s = null;
                i.forEach(function (e, t) {
                  void 0 === o[e] && (o[e] = {}), t !== i.length - 1 && (o = o[e]), (s = e);
                }),
                  (o[s] = t);
              },
            };
          t.exports = a;
        },
        {},
      ],
      18: [
        function (e, t) {
          function o(e, t) {
            (this.container = e),
              (this.options = t),
              (this.countersLeft = 0),
              (this.buttons = []),
              (this.number = 0),
              this.init();
          }
          var i = e('./button'),
            s = (e('./services'), e('./config')),
            n = e('./utils');
          (o.prototype = {
            init: function () {
              n.toArray(this.container.children).forEach(this.addButton.bind(this)),
                this.options.counters
                  ? ((this.timer = setTimeout(this.appear.bind(this), this.options.wait)),
                    (this.timeout = setTimeout(this.ready.bind(this), this.options.timeout)))
                  : this.appear();
            },
            addButton: function (e) {
              var t = new i(e, this, this.options);
              this.buttons.push(t), t.options.counterUrl && this.countersLeft++;
            },
            update: function (t) {
              (t.forceUpdate || t.url !== this.options.url) &&
                ((this.countersLeft = this.buttons.length),
                (this.number = 0),
                this.buttons.forEach(function (e) {
                  e.update(t);
                }));
            },
            updateCounter: function (e, t) {
              t && (this.number += t), this.countersLeft--, 0 === this.countersLeft && (this.appear(), this.ready());
            },
            appear: function () {
              this.container.classList.add(s.name + '_visible');
            },
            ready: function () {
              this.timeout && (clearTimeout(this.timeout), this.container.classList.add(s.name + '_ready'));
            },
          }),
            (t.exports = o);
        },
        {
          './button': 1,
          './config': 2,
          './services': 11,
          './utils': 17,
        },
      ],
    },
    {},
    [5],
  ),
  $(function () {
    (authPopup = {
      init: function () {
        $(document).on('click', '.b-auth__close', function () {
          authPopup.closePopup();
        }),
          $('.b-head__user-link-text').on('click', function (e) {
            -1 !== navigator.userAgent.indexOf('iPad') ||
              (e.preventDefault(), 0 === $('.b-auth_inline_yes').length && authPopup.getPopup());
          });
      },
      getPopup: function () {
        $.ajax({
          method: 'get',
          url: '/login/popup/',
          success: function (e) {
            var t = $.parseHTML(e);
            $('.b-body__popups').html(t);
            for (
              var o = location.pathname + location.search + location.hash,
                i = $('.b-auth__social-link'),
                s = 0,
                n = i.length;
              s < n;
              s++
            ) {
              var a = $(i[s]).attr('href') + '?next=' + encodeURIComponent(o);
              $(i[s]).attr('href', a);
            }
            $('.b-auth').attr('action', '/login/?next=' + encodeURIComponent(o)), authPopup.showPopup();
          },
        });
      },
      closePopup: function () {
        var e = $('.b-auth');
        e.hasClass('b-auth_inline_yes') ||
          ($('.b-body__content').removeClass('b-body__content_blurred_yes'),
          $('.b-body__overlay').removeClass('b-body__overlay_show_yes'),
          e.removeClass('b-auth_show_yes'));
      },
      showPopup: function () {
        $('.b-body__overlay').addClass('b-body__overlay_show_yes'),
          $('.b-auth').addClass('b-auth_show_yes'),
          $('.b-auth__text-input[name="username"]').focus();
      },
    }),
      authPopup.init();
  }),
  $(function () {
    $(window).on('load resize', function () {
      var e = window.innerHeight;
      $('.b-body').css({
        'min-height': e,
      });
      var t = $('.return-mobile');
      if (t.length) {
        var o = window.innerWidth;
        t.width(o);
      }
    });
    var e = $('.b-body');
    'True' === e.data('auth') && e.addClass('b-body_authenticated_yes');
  }),
  $(function () {
    $(document).on('keydown', function (e) {
      27 === e.keyCode && (s(), authPopup.closePopup());
    });
    var e = $('.pass-changer');
    if (0 < e.length) {
      var t = e.clone();
      e.remove(), $('.b-body').append(t);
    }
    function s() {
      $('.b-body__content').removeClass('b-body__content_blurred_yes'),
        $('.b-body__overlay').removeClass('b-body__overlay_show_yes'),
        $('.pass-changer').removeClass('pass-changer_show_yes');
    }
    $('.pass-changer__close').on('click', function () {
      s();
    }),
      $('.b-my-profile-about__link__pass').on('click', function (e) {
        e.preventDefault(),
          $('.b-body__content').addClass('b-body__content_blurred_yes'),
          $('.b-body__overlay').addClass('b-body__overlay_show_yes'),
          $('.pass-changer').addClass('pass-changer_show_yes');
      });
    var i = !0;
    $('.pass-changer__showpass').on('click', function () {
      var e,
        t = $('.pass-changer__hidden-pass'),
        o = $('.pass-changer__show-pass');
      o.removeClass('pass-changer_active_field'),
        t.removeClass('pass-changer_active_field'),
        i
          ? ((i = !1), (e = o.val()), t.val(e), t.addClass('pass-changer_active_field'), t.show(), o.hide())
          : ((i = !0), (e = t.val()), o.val(e), o.addClass('pass-changer_active_field'), o.show(), t.hide());
    }),
      $('.pass-changer').on('submit', function (e) {
        e.preventDefault();
        var o = [],
          t = $(this).serializeArray();
        $.each(t, function (e, t) {
          'new_password' !== t.name && o.push(t);
        });
        var i = {
          name: 'new_password',
          value: $('.pass-changer_active_field').val(),
        };
        o.push(i),
          $.ajax({
            method: 'post',
            url: '/password_change/',
            data: o,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            traditional: !0,
          }).done(function (e) {
            var t = e.status;
            if ('success' === t) {
              s(),
                $('.pass-changer__errors').html(''),
                $('input[name=csrfmiddlewaretoken]').val($.cookie('csrftoken')),
                $('.pass-changer__text-input').val('');
              var o = $('.b-my-profile-about__messages');
              o.removeClass('b-my-profile-about__messages_show_yes').addClass('b-my-profile-about__messages_show_yes'),
                o.html('Вы успешно изменили пароль');
            } else if ('error' === t) {
              var i = e.message;
              $('.pass-changer__errors').html(i);
            }
          });
      });
  }),
  $(function () {
    function s() {
      var e = $('.b-comments-form'),
        t = $.ajax({
          method: 'post',
          url: e.attr('action'),
          data: e.serializeArray(),
          contentType: 'application/x-www-form-urlencoded; charset=utf-8',
          traditional: !0,
        });
      t.done(function (e) {
        var t,
          o,
          i = e.status;
        if (($('.b-comments-form__error').remove(), 'success' === i)) {
          if (1 == e.data.status) {
            $('.b-comments-form__moderation').remove();
            var s = $('<div>', {
              class: 'b-comments-form__moderation',
            }).html('Ваш комментарий будет опубликован после проверки модератором');
            $('.b-comments-list').append(s);
          } else
            (t = e),
              (o = $('.b-comments-item_template_yes').clone().removeClass('b-comments-item_template_yes'))
                .find('.b-comments-author')
                .text(t.data.username),
              o.find('.b-comments-time').text(t.data.timestring),
              o.find('.b-comments-item-comment').text(t.data.text),
              $('.b-comments-num').text(t.data.total_text),
              o.find('.b-comments-item-image__img').attr('src', t.data.avatar),
              $('.b-comments-list').append(o),
              $('.b-comments-item-comment').hyphenate('ru');
          $('#b-comments-form-checkbox__recommend').attr('checked', !1),
            $('.b-comments-form').find('.b-comments-form-textarea').val('');
        }
      }),
        t.fail(function (e) {
          $('.b-comments-form__error').remove();
          try {
            var t = JSON.parse(e.responseText);
          } catch (o) {
            console.log(o);
          }
          var o = $('<div>', {
            class: 'b-comments-form__error',
          }).html(t.message);
          $('.b-comments-form-controls').append(o);
        }),
        t.always(function () {
          $('.b-comments-form').removeClass('b-comments-form_disabled_yes');
        });
    }
    $('.b-comments-form-textarea').val(''),
      $('.b-comments-item-comment').hyphenate('ru'),
      $(document).on('focus', '.b-comments-form-textarea', function () {
        var e = $(this).closest('.b-comments-form'),
          t = $(this).closest('.b-comments-form-text');
        e.hasClass('b-comments-form_authenticated_yes') &&
          (t.addClass('b-comments-form-text_focused_yes'),
          $('.b-comments-form-textarea-placeholder').remove(),
          $('.b-comments-form-controls').removeClass('b-comments-form-controls_hide_yes'));
      }),
      $(document).on('click touchend', '.b-comments-form-text', function () {
        $(this).closest('.b-comments-form').hasClass('b-comments-form_authenticated_yes') || authPopup.getPopup();
      }),
      $(document).on('blur', '.b-comments-form-textarea', function () {
        $(this).closest('.b-comments-form-text').removeClass('b-comments-form-text_focused_yes');
      }),
      $(document).on('change', '.b-comments-form-textarea', function (e) {
        var t = $(e.target);
        t.val() && ($('.b-body').hasClass('b-body_authenticated_yes') || t.val(''));
      }),
      $(document).on('submit', '.b-comments-form', function (e) {
        var t = $(this),
          o = $('.b-comments-form-textarea').val(),
          i = t.hasClass('b-comments-form_disabled_yes');
        e.preventDefault(), i || '' === o || (t.addClass('b-comments-form_disabled_yes'), s());
      });
  }),
  $(function () {
    var e,
      t = $('.b-exhibition__detail'),
      o = $('.b-exhibition__cover');
    if (0 < t.length) {
      var i = g(),
        s = t.data('exhibition'),
        n = t.hasClass('b-exhibition__detail_preview_yes'),
        a = o.hasClass('b-exhibition__cover_hide_yes'),
        r = '/rest/front/exhibitions-vote/',
        l = 1 == i,
        c = $('.b-exhibition__detail-item').length == i,
        d = 'last' === g(),
        u = parseInt(i, 10);
      function p(e, t) {
        var o = e.votes.down,
          i = e.votes.up,
          s = $('.b-exhibition__end-like'),
          n = $('.b-exhibition__end-dislike');
        s.removeClass('b-exhibition__end-liker_active_yes'),
          n.removeClass('b-exhibition__end-liker_active_yes'),
          t.addClass('b-exhibition__end-liker_active_yes'),
          s.find('.b-exhibition__end-liker-num').text(i),
          n.find('.b-exhibition__end-liker-num').text(o),
          o || i
            ? ($('.b-exhibition__end-liker-thanks').addClass('b-exhibition__end-liker-thanks_show_yes'),
              $('.b-exhibition__end-liker-text').addClass('b-exhibition__end-liker-text_hide_yes'))
            : ($('.b-exhibition__end-liker-thanks').removeClass('b-exhibition__end-liker-thanks_show_yes'),
              $('.b-exhibition__end-liker-text').removeClass('b-exhibition__end-liker-text_hide_yes'));
      }
      function h(e, t) {
        var o = e.votes.down,
          i = e.votes.up;
        t.removeClass('b-exhibition__end-liker_active_yes'),
          $('.b-exhibition__end-like').find('.b-exhibition__end-liker-num').text(i),
          $('.b-exhibition__end-dislike').find('.b-exhibition__end-liker-num').text(o),
          o || i
            ? ($('.b-exhibition__end-liker-thanks').addClass('b-exhibition__end-liker-thanks_show_yes'),
              $('.b-exhibition__end-liker-text').addClass('b-exhibition__end-liker-text_hide_yes'))
            : ($('.b-exhibition__end-liker-thanks').removeClass('b-exhibition__end-liker-thanks_show_yes'),
              $('.b-exhibition__end-liker-text').removeClass('b-exhibition__end-liker-text_hide_yes'));
      }
      function m(e) {
        e = e || parseInt(g(), 10);
        var t = $('.b-exhibition__detail-desc')
            .eq(e - 1)
            .find('.b-exhibition__detail-desc-title')
            .text(),
          o = $('.b-exhibition__detail ').data('exhibition-title');
        $('title').text(t + ' - ' + o);
      }
      function f(e) {
        e += 1;
        var t = $('.b-exhibition__detail-desc'),
          o = $('.b-exhibition__detail-item').length,
          i = (100 * e) / o;
        $('.b-exhibition__progress-bar').width(i + '%'),
          $('.b-exhibition__progress-num').text(e + '/' + o),
          t.hide(),
          t.eq(e - 1).show(),
          $('.b-exhibition__cover').hasClass('b-exhibition__cover_hide_yes') && !c ? m(e) : x(),
          _(e);
      }
      function _(e) {
        window.location.hash = e;
        var t = window.location.pathname + window.location.hash;
        window.yaCounter && yaCounter.hit(t),
          window.ga &&
            ga('send', {
              hitType: 'pageview',
              page: t,
            });
      }
      function g() {
        return location.hash.replace(/[^\w-]/gi, '');
      }
      d && (o.addClass('b-exhibition__cover_hide_yes'), w()),
        0 < $('.b-exhibition__end_own').length &&
          $(window).on('load resize', function () {
            var e = $(window).height() - $('.b-head').height() - ($(document).height() - $(window).height());
            $('.b-exhibition__end-top').height(e);
          }),
        0 < (e = $('.b-exhibition__share-block')).length &&
          Ya.share2(e[0], {
            content: {
              url: e.data('url'),
              title: e.data('title'),
              image: e.data('image'),
              description: e.data('description'),
            },
            theme: {
              services: 'vkontakte,odnoklassniki,pinterest,gplus,twitter',
              counter: !0,
              lang: 'ru',
              size: 's',
            },
          }),
        f(0 < u ? u - 1 : 0);
      var v,
        b = $('.b-exhibition__detail-images');
      function y() {
        var e = $('.b-exhibition__end-top');
        if (n) {
          var t = $(window).height() - (parseInt(e.css('padding-top'), 10) + $('.b-head').height());
          e.height(t);
        }
      }
      function w() {
        $('.b-exhibition__end').addClass('b-exhibition__end_show_yes'),
          x(),
          y(),
          setTimeout(function () {
            $('.b-page__main-content').removeClass('b-page__main-content_height_100'),
              window.yaCounter && yaCounter.reachGoal('EXHIBITION_END_PAGE');
          }, 250);
      }
      function x() {
        var e = $('.b-exhibition__detail ').data('exhibition-title');
        $('title').text(e);
      }
      b.slick({
        lazyLoad: 'ondemand',
        lazyImagesLoad: 3,
        infinite: !1,
        speed: 500,
        initialSlide: 0 < u ? u - 1 : 0,
        cssEase: 'ease-in-out',
        prevArrow: $('.b-exhibition__detail-left'),
        nextArrow: $('.b-exhibition__detail-right'),
      }),
        b.on('afterChange', function (e, t, o) {
          f(o);
          var i = $('.b-exhibition__detail-item').length;
          (l = 0 == o),
            o + 1 == i
              ? setTimeout(function () {
                  (c = !0), (window.location.hash = '');
                }, 300)
              : (c = !1);
        }),
        $(window).on('resize', function () {
          y();
        }),
        $(document).on('click', '.b-exhibition__detail-right.slick-disabled', function () {
          c && w();
        }),
        $(document).on('click', '.b-exhibition__close-preview', function () {
          window.close();
        }),
        $(document).on('click', '.b-exhibition__detail-left.slick-disabled', function () {
          l && (x(), $('.b-exhibition__cover').removeClass('b-exhibition__cover_hide_yes'));
        }),
        $('.b-exhibition__end-like').on('click', function (e) {
          if ($('.b-body').hasClass('b-body_authenticated_yes')) {
            var t,
              o = $(e.currentTarget);
            o.hasClass('b-exhibition__end-liker_active_yes')
              ? ((t = r + s + '/'),
                $.ajax({
                  method: 'delete',
                  url: t,
                  traditional: !0,
                })
                  .done(function (e) {
                    h(e, o);
                  })
                  .fail(function (e) {
                    console.log(e);
                  }))
              : ((t = r + s + '/up/'),
                $('.b-exhibition__end-dislike').removeClass('b-exhibition__end-liker_active_yes'),
                $.ajax({
                  method: 'post',
                  url: t,
                  traditional: !0,
                })
                  .done(function (e) {
                    p(e, o);
                  })
                  .fail(function (e) {
                    console.log(e);
                  }));
          } else _('last'), authPopup.getPopup();
        }),
        $('.b-exhibition__end-dislike').on('click', function (e) {
          if ($('.b-body').hasClass('b-body_authenticated_yes')) {
            var t,
              o = $(e.currentTarget);
            o.hasClass('b-exhibition__end-liker_active_yes')
              ? ((t = r + s + '/'),
                $.ajax({
                  method: 'delete',
                  url: t,
                  traditional: !0,
                })
                  .done(function (e) {
                    h(e, o);
                  })
                  .fail(function (e) {
                    console.log(e);
                  }))
              : ((t = r + s + '/down/'),
                $('.b-exhibition__end-like').removeClass('b-exhibition__end-liker_active_yes'),
                $.ajax({
                  method: 'post',
                  url: t,
                  traditional: !0,
                })
                  .done(function (e) {
                    p(e, o);
                  })
                  .fail(function (e) {
                    console.log(e);
                  }));
          } else _('last'), authPopup.getPopup();
        }),
        $('.b-exhibition__start').on('click', function () {
          m(), $('.b-exhibition__cover').addClass('b-exhibition__cover_hide_yes');
        }),
        $('.b-exhibition__replay').on('click', function () {
          $('.b-page__main-content').addClass('b-page__main-content_height_100'),
            $('.b-exhibition__end').removeClass('b-exhibition__end_show_yes'),
            $('.b-exhibition__detail-images').slick('slickGoTo', 0),
            f(0),
            _(1),
            (a = c = !1),
            $('.b-exhibition__cover').removeClass('b-exhibition__cover_hide_yes');
        }),
        0 < b.length &&
          ($('.b-body__content').addClass('b-body__content_height_100'),
          $('.b-page__main-content').addClass('b-page__main-content_height_100'),
          Mousetrap.bind(['right'], function () {
            (v = $.now()),
              setTimeout(function () {
                if (c) w();
                else {
                  if ($.now() - v < 300) return;
                  a
                    ? $('.b-exhibition__detail-images').slick('slickNext')
                    : ((a = !0), m(), $('.b-exhibition__cover').addClass('b-exhibition__cover_hide_yes'));
                }
              }, 300);
          }),
          Mousetrap.bind(['left'], function () {
            c ||
              ((v = $.now()),
              setTimeout(function () {
                $.now() - v < 300 ||
                  (l && ((a = !1), $('.b-exhibition__cover').removeClass('b-exhibition__cover_hide_yes'), x()),
                  $('.b-exhibition__detail-images').slick('slickPrev'));
              }, 300));
          }),
          $('.b-head__toggle').on('click', function () {
            $('.b-head__toggle').toggleClass('b-head__toggle_rotated_yes'),
              $('.b-head__panel').toggleClass('b-head__panel_hide_yes');
          }));
    }
  }),
  $(function () {
    var n = '.share-type_exhibitions';
    function a(e) {
      for (var t = $(e), o = 0; o < t.length; o++) {
        var i = $(t[o]);
        Ya.share2(i[0], {
          content: {
            url: i.data('url'),
            title: i.data('title'),
            image: i.data('image'),
            description: i.data('description'),
          },
          theme: {
            services: 'vkontakte,odnoklassniki,pinterest,gplus,twitter',
            counter: !0,
            lang: 'ru',
            size: 's',
          },
        });
      }
    }
    if (
      (a(n),
      $(document).on('click', '.b-exhibition__buttons-delete', function (e) {
        e.preventDefault();
        var t = $(this),
          o = t.data('url');
        confirm('Вы уверены?') &&
          $.ajax({
            type: 'post',
            url: o,
            success: function () {
              t.closest('.b-exhibitions__item').remove(),
                0 === $('.b-exhibitions__item').length &&
                  $('.profile-help_type_exhibitions').removeClass('profile-help_hide_yes');
            },
          });
      }),
      0 !== $('.b-exhibitions__head').length)
    ) {
      var d = $('.b-page__main-content'),
        r = $('.b-exhibitions__order-by'),
        l = $('.b-exhibitions__wrapper-photo'),
        e = $('.b-exhibitions__wrapper-video'),
        t = $('.b-exhibitions__photo'),
        o = $('.b-exhibitions__video'),
        c = l,
        u = t,
        p = 'b-exhibitions__wrapper_hidden',
        h = 'b-exhibitions__type_active',
        i = $('.b-exhibitions__type-photo'),
        s = $('.b-exhibitions__type-video'),
        m = 'photo',
        f = 1,
        g = 1,
        v = f,
        b = 'True' !== l.data('has-next'),
        y = 'True' !== e.data('has-next'),
        w = !1,
        x = !1;
      function k(e, t, o, i, s, n, a) {
        e.addClass(h),
          t.removeClass(h),
          o.removeClass(p),
          i.addClass(p),
          (c = o),
          (u = s),
          (v = a),
          'video' === (m = n) ? r.hide() : r.show();
      }
      i.on('click', k.bind(null, i, s, l, e, t, 'photo', f)), s.on('click', k.bind(null, s, i, e, l, o, 'video', g));
      var C = '/exhibitions/ajax/',
        T = '-pub_date';
      function S() {
        var e;
        if (
          $(window).scrollTop() + $(window).innerHeight() * window.devicePixelRatio + $('.footer').height() >=
          document.body.scrollHeight
        ) {
          if (('photo' === m && ((v = ++f), (w = b)), 'video' === m && ((v = ++g), (w = y)), w)) return;
          x = !0;
          var o = 'b-search-result__divider_loading_yes',
            i = $(
              ((e =
                '<div class="b-search-result__divider">   <div class="b-search-result__divider-line"></div>   <div class="b-search-result__divider-pagetext">Страница ' +
                v +
                '</div></div>'),
              $.parseHTML(e)),
            );
          i.addClass(o),
            c.append(i),
            $.ajax({
              method: 'get',
              url: C,
              data: {
                exh_type: m,
                page: v,
                order_by: T,
              },
              contentType: 'application/x-www-form-urlencoded; charset=utf-8',
              traditional: !0,
              success: function (e) {
                (x = !1), e.has_next || ('photo' === m && (b = !0), 'video' === m && (y = !0)), i.removeClass(o);
                var t = $($.parseHTML(e.html));
                c.append(t), a(t.find(n));
              },
              fail: function () {
                (x = !1),
                  setTimeout(function () {
                    i.remove();
                  }, 0);
              },
            });
        }
      }
      function I(e) {
        $('html, body').animate(
          {
            scrollTop: e.offset().top - 40,
          },
          300,
        );
      }
      function P(e) {
        var t,
          o,
          i = $(e.target),
          s = 'b-exhibitions__order-by-item_active_yes';
        $('.b-exhibitions__order-by-item').removeClass(s),
          (T = i.hasClass('b-exhibitions__order-by-item_type_date')
            ? ($('.b-exhibitions__order-by-item_type_date').addClass(s), '-pub_date')
            : ($('.b-exhibitions__order-by-item_type_popular').addClass(s), '-votes_up')),
          (y = b = !(v = g = f = 1)),
          (t = 'photo'),
          (o = l),
          $.ajax({
            method: 'get',
            data: {
              exh_type: t,
              page: v,
              order_by: T,
            },
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            traditional: !0,
            url: C,
            success: function (e) {
              o.html($.parseHTML(e.html)), a(n);
            },
          });
      }
      d.append(
        '<div class="b-search-result__back">\t<div class="b-search-result__back-page">\t\tНа страницу выше\t</div>\t<div class="b-search-result__back-top">\t\tВ начало\t</div></div>',
      ),
        $(document).on('click', '.b-exhibitions__order-by-item_type_date', P),
        $(document).on('click', '.b-exhibitions__order-by-item_type_popular', P),
        (0 === t.length && 0 === o.length) ||
          $(window).on('scroll', function () {
            x || S();
            var o,
              i,
              e,
              s,
              n,
              t = $(window).scrollTop(),
              a =
                ((o = []),
                _.each($(u.selector), function (e) {
                  var t = $(e).offset().top;
                  o.push(t);
                }),
                o),
              r =
                ((i = t),
                (e = a),
                (n = s = null),
                _.each(e, function (e, t) {
                  (null === s || Math.abs(e - i) < Math.abs(s - i)) && ((s = e), (n = t));
                }),
                n),
              l = $('.b-search-result__back'),
              c = 'b-search-result__back_show_yes';
            0 < r ? l.hasClass(c) || l.addClass(c) : l.removeClass(c), d.data('page', r);
          }),
        $(document).on('click', '.b-search-result__back-top', function () {
          I($('.b-body'));
        }),
        $(document).on('click', '.b-search-result__back-page', function () {
          var e = d.data('page');
          I($(u.selector).eq(e - 1));
        });
    }
  }),
  $(function () {
    $('.b-main-slide__items').slick({
      infinite: !0,
      speed: 200,
      slidesToShow: 1,
      centerMode: !0,
      variableWidth: !0,
      lazyLoad: 'progressive',
      prevArrow: $('.b-main-slide__left'),
      nextArrow: $('.b-main-slide__right'),
      dots: !0,
    });
  }),
  $(function () {
    function i() {
      $('.b-my-profile-about__links').removeClass('b-my-profile-about__links_hide_yes'),
        $('.b-my-profile-about').removeClass('b-my-profile-about_hide_yes'),
        $('.b-my-profile-form').removeClass('b-my-profile-form_show_yes'),
        $('.b-my-profile__edit-avatar').addClass('b-my-profile__edit-avatar_hide_yes');
    }
    $(document).on('change', '.b-my-profile__edit-avatar-input', function (e) {
      var t = $('.b-my-profile__edit-avatar .b-my-profile-form__error');
      t.text('');
      var o = e.currentTarget.files;
      if (o && o[0]) {
        var i = o[0];
        if ($.inArray(i.type, ['image/gif', 'image/jpeg', 'image/png']) < 0 || 33554432 < i.size)
          return t.text('Неверный формат или размер файла'), void $(this).val('');
        var s = new FileReader();
        (s.onload = function (e) {
          $('.b-my-profile__image-tag').attr('src', e.target.result);
        }),
          s.readAsDataURL(i);
      }
    }),
      $('.b-my-profile-form__email-change').on('submit', function (e) {
        e.preventDefault(),
          $.ajax({
            url: $(this).attr('action'),
            method: 'post',
            data: $(this).serializeArray(),
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            traditional: !0,
          })
            .done(function (e) {
              var t = e.message,
                o = $('.b-my-profile-about__messages');
              o.html(t),
                i(),
                o.removeClass('b-my-profile-about__messages_error_yes'),
                $('.b-my-profile-form_type_mail').removeClass('b-my-profile-form_show_yes'),
                o.addClass('b-my-profile-about__messages_show_yes');
            })
            .fail(function (e) {
              try {
                var t = JSON.parse(e.responseText);
                $('.b-my-profile-about__error').remove();
                var o = $('<div>', {
                  class: 'b-my-profile-about__error',
                });
                o.html(t.detail), $('.b-my-profile-form_type_mail').append(o);
              } catch (e) {
                console.log(e);
              }
            });
      }),
      $('.b-my-profile-about__link__edit').on('click', function (e) {
        e.preventDefault(),
          $('.b-my-profile-form').hasClass('b-my-profile-form_show_yes') ||
            ($('.b-my-profile-about__links').addClass('b-my-profile-about__links_hide_yes'),
            $('.b-my-profile-about').addClass('b-my-profile-about_hide_yes'),
            $('.b-my-profile-form_type_data').addClass('b-my-profile-form_show_yes'),
            $('.b-my-profile__edit-avatar').removeClass('b-my-profile__edit-avatar_hide_yes'));
      }),
      $('.b-my-profile-about__link__mail').on('click', function (e) {
        e.preventDefault(),
          $('.b-my-profile-about__links').addClass('b-my-profile-about__links_hide_yes'),
          $('.b-my-profile-about').addClass('b-my-profile-about_hide_yes'),
          $('.b-my-profile-form_type_mail').addClass('b-my-profile-form_show_yes'),
          $('.b-my-profile-about__error').remove(),
          $('.b-my-profile-form__email-change #id_password').val('');
      }),
      $('.b-my-profile-form__no-save-button').on('click', function (e) {
        e.preventDefault(), $('.b-my-profile-form__error').remove(), i();
      }),
      $('.b-my-profile-about__birthday-container').datetimepicker({
        lang: 'ru',
        timepicker: !1,
        value: $('#id_date_of_birth').val(),
        yearStart: 1900,
        yearEnd: new Date().getFullYear(),
        format: 'd.m.Y',
        formatDate: 'd.m.Y',
        maxDate: '31.12.' + new Date().getFullYear(),
        onSelectDate: function (e) {
          var t = e.dateFormat('d.m.Y');
          $('.b-my-profile-about__birthday-container').datetimepicker('hide'), $('#id_date_of_birth').val(t);
        },
      });
  }),
  $(function () {
    var e = $('.b-my-profile-form__about-textarea'),
      t = $('.b-my-profile-form__counter'),
      o = '.b-my-profile-form__about',
      i = 'b-my-profile-form__counter_red',
      s = 'b-my-profile-form__about_focused_yes';
    e.on('input', function () {
      var e = 255 - $(this).val().length;
      e < 0 && t.addClass(i), 0 <= e && e <= 255 && t.removeClass(i), t.text(e);
    }),
      e.trigger('input'),
      e.on('focus', function () {
        $(this).closest(o).addClass(s);
      }),
      e.on('blur', function () {
        $(this).closest(o).removeClass(s);
      });
  }),
  $(function () {
    $('.b-my-profile-photos__form').on('submit', function (e) {
      e.preventDefault(),
        $.getJSON('/rest/front/exhibitions-cart/list-ids/').success(function (e) {
          e && 0 < e.photo_ids.length
            ? $('.b-my-profile-photos__form').unbind('submit').submit()
            : !0 !== $('.b-my-profile-photos__form-error').hasClass('b-my-profile-photos__form-error_show_yes') &&
              ($('.b-my-profile-photos__form-error').addClass('b-my-profile-photos__form-error_show_yes'),
              setTimeout(function () {
                $('.b-my-profile-photos__form-error').removeClass('b-my-profile-photos__form-error_show_yes');
              }, 3e3));
        });
    });
  }),
  $(function () {
    var e = 'True' === $('body').data('auth');
    $.ajaxSetup({
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      contentType: 'application/json',
    }),
      ($.selectedPhoto = {
        list: [],
        panelRefresh: function () {
          var e = this.list.length;
          if (0 < e) {
            $('.b-panel-selector__panel-selected>span').text(
              'У вас ' +
                declOfNum(e, ['выбрана', 'выбрано', 'выбрано']) +
                ' ' +
                e +
                ' ' +
                declOfNum(e, ['фотография', 'фотографии', 'фотографий']),
            ),
              $('#b-panel-selector__clear-bucket').removeClass('b-panel-selector__control_state_unactivated'),
              $('.b-panel-selector').show(),
              $('.b-body__content').addClass('b-body__content_panel_yes');
            var t = $('.b-panel-selector__hiddens');
            t.html('');
            for (var o = 0; o < e; o++) t.append('<input type="hidden" value="' + this.list[o] + '" name="id"/>');
          } else
            $('.b-panel-selector__panel-selected>span').text('Нет выбранных фотографий'),
              $('#b-panel-selector__clear-bucket').addClass('b-panel-selector__control_state_unactivated'),
              this.hidePanel();
          clearTimeout(this.timer), (this.timer = setTimeout(this.hidePanel, 7e3));
        },
        hidePanel: function () {
          $('.b-panel-selector').hide(),
            $('.b-body__content').removeClass('b-body__content_panel_yes'),
            $('.b-search-result__back').removeAttr('style');
        },
        setSelected: function (e) {
          var t;
          null == e
            ? ((e = $('.b-search-result__item-button')),
              (t = $('.b-search-result__item-button-small')),
              $('.b-search-result__item-button_checked_yes').removeClass('b-search-result__item-button_checked_yes'),
              $('.b-search-result__item-button-small_checked_yes').removeClass(
                'b-search-result__item-button-small_checked_yes',
              ))
            : (t = (e = e.find('.b-search-result__item-button')).find('.b-search-result__item-button-small'));
          var o = this.list;
          e.each(function () {
            for (var e = $(this), t = 0; t < o.length; t++)
              o[t] == e.data('id') &&
                (e.addClass('b-search-result__item-button_checked_yes'),
                135 < e.closest('.b-search-result__item-desc').prev().width() &&
                  e.find('.b-search-result__item-button-text').text('В избранном'));
          }),
            t.each(function () {
              for (var e = $(this), t = 0; t < o.length; t++)
                o[t] == e.data('id') && e.addClass('b-search-result__item-button-small_checked_yes');
            });
          var i = this;
          $(document).on(
            {
              mouseenter: function () {
                clearTimeout(i.timer);
              },
              mouseleave: function () {
                i.timer = setTimeout(function () {
                  $('.b-panel-selector').hide(),
                    $('.b-body__content').removeClass('b-body__content_panel_yes'),
                    $('.b-search-result__back').removeAttr('style');
                }, 7e3);
              },
            },
            '.b-panel-selector__panel',
          );
        },
      }),
      0 < $('.b-panel-selector').length &&
        e &&
        $.getJSON('/rest/front/exhibitions-cart/list-ids/').success(function (e) {
          ($.selectedPhoto.list = e.photo_ids), $.selectedPhoto.setSelected();
        }),
      $(document).on('click', '#b-panel-selector__clear-bucket', function (e) {
        e.stopPropagation(),
          $(this).hasClass('b-panel-selector__control_state_unactivated') ||
            $.post('/rest/front/exhibitions-cart/clear/').success(function () {
              $('.b-panel-selector form input[type=hidden]').not('input[name=csrfmiddlewaretoken]').remove(),
                $('.b-panel-selector__panel-selected>span').text('Нет выбранных фотографий'),
                $('#b-panel-selector__clear-bucket').addClass('b-panel-selector__control_state_unactivated'),
                ($.selectedPhoto.list = []),
                $.selectedPhoto.panelRefresh(),
                $.selectedPhoto.setSelected();
            });
      });
  }),
  $(function () {
    var o,
      e,
      i,
      a = '/search/photo/ajax/',
      y = '/search/photo/',
      r = '/search/archive/ajax/',
      w = '/search/archive/',
      t = 0 < $('.b-photo__relatives').length,
      x = !1;
    function k() {
      var e = $('.b-photo__share-block');
      Ya.share2(e[0], {
        content: {
          url: e.data('url'),
          title: e.data('title'),
          image: e.data('image'),
        },
        theme: {
          services: 'vkontakte,odnoklassniki,pinterest,gplus,twitter',
          counter: !0,
          lang: 'ru',
          size: 's',
        },
      }),
        (function () {
          if ($('.share-link').length) {
            var n = [];
            $('.b-photo__relatives-item').each(function (e, t) {
              n.push($(t).data('id'));
            }),
              $(document).on('click.share-link', function (e) {
                for (var t = $(e.target), o = window.location.pathname.split('/'), i = '', s = 0; s < o.length; s++)
                  'years' === o[s].substring(0, 5) && (i = '&' + o[s]);
                t.hasClass('share-link')
                  ? ($('.share-link__tooltip').removeClass('share-link__tooltip_hide'),
                    $.ajax({
                      url: '/archive_photos_link',
                      data: {
                        ids: '[' + n + ']',
                        request: window.location.search.substring(1) + i,
                      },
                      success: function (e) {
                        $('.share-link__content').val(window.location.origin + e.url),
                          $('.share-link__tooltip').removeClass('share-link__tooltip_hide');
                      },
                      error: function (e) {
                        console.log('fail (((\n' + e);
                      },
                    }))
                  : 0 === t.closest('.share-link').length &&
                    $('.share-link__tooltip').addClass('share-link__tooltip_hide');
              });
          }
        })();
    }
    if (
      (!1,
      -1 !== (e = navigator.userAgent.toLowerCase()).indexOf('safari') &&
        -1 === e.indexOf('chrome') &&
        ($('.b-body').addClass('safari'), !0),
      new Clipboard('.share-link__button'),
      0 < $('.b-photo').length && k(),
      (i = window.location.pathname.split('/')).forEach(function (e, t) {
        'archive' === e && ((x = !0), (o = i[t + 1]), (w += o + '/'), (r += o + '/'));
      }),
      t || ($('.b-photo__left').hide(), $('.b-photo__right').hide()),
      $(document).on('click', '.b-photo__incart', function () {
        var e = $(this),
          t = $('.b-photo').data('id');
        e.hasClass('b-photo__incart_cart_yes')
          ? $.post(
              '/rest/front/exhibitions-cart/remove/',
              JSON.stringify({
                photo: t,
              }),
              function () {
                e.removeClass('b-photo__incart_cart_yes'),
                  e.text('В избранное'),
                  $('.b-photo__relatives-item_id_' + t).data('incart', !1);
              },
            )
          : $.post(
              '/rest/front/exhibitions-cart/add/',
              JSON.stringify({
                photo: t,
              }),
              function () {
                e.addClass('b-photo__incart_cart_yes'),
                  e.text('Убрать из избранных'),
                  $('.b-photo__relatives-item_id_' + t).data('incart', !0);
              },
            );
      }),
      $(document).on('mouseover', '.b-photo__list-big-photo', function () {
        $('.b-photo__share').hasClass('b-photo__share_show_yes') ||
          $('.b-photo__share').addClass('b-photo__share_show_yes');
      }),
      $(document).on('mouseout', '.b-photo__list-big-photo', function () {
        $('.share-link__tooltip').hasClass('share-link__tooltip_hide') &&
          $('.b-photo__share').removeClass('b-photo__share_show_yes');
      }),
      $(document).on('mouseover', '.b-photo__share', function () {
        $('.b-photo__share').hasClass('b-photo__share_show_yes') ||
          $('.b-photo__share').addClass('b-photo__share_show_yes');
      }),
      $(document).on('mouseout', '.b-photo__share', function () {
        $('.share-link__tooltip').hasClass('share-link__tooltip_hide') &&
          $('.b-photo__share').removeClass('b-photo__share_show_yes');
      }),
      0 < $('.b-photo').length)
    ) {
      1 == localStorage.getItem('locationGallery') ||
        setTimeout(function () {
          v();
        }, 300);
      try {
        localStorage.setItem('locationGallery', 0);
      } catch (e) {
        (Storage.prototype._setItem = Storage.prototype.setItem), (Storage.prototype.setItem = function () {});
      }
      function s(e, t) {
        e.preventDefault();
        var _,
          o,
          i = $('.b-photo__list-item'),
          s = $('.b-photo__relatives-item_current_yes'),
          g = $('.b-photo__list-big-photo').height();
        switch (t) {
          case 'next':
            (o = s.next()), (_ = i.parent().data('next'));
            break;
          case 'prev':
            (o = s.prev()), (_ = i.parent().data('prev'));
        }
        o.hasClass('b-photo__relatives-item')
          ? n(o)
          : ((x = !1),
            'None' !== _ &&
              ($.ajax({
                method: 'get',
                url: _,
                success: function (e) {
                  for (
                    var t = new URL(window.location.origin + _),
                      o = t.pathname.split('/'),
                      i = new DOMParser().parseFromString(e, 'text/html'),
                      s = $(e).find('.b-photo'),
                      n = s.find('.b-photo__title').text(),
                      a = $(i).find('title').html(),
                      r = $(i).find('meta[property="og:title"]').attr('content'),
                      l = $(i).find('meta[name="description"]').attr('content'),
                      c = $(i).find('meta[property="og:description"]').attr('content'),
                      d = $(i).find('.share').data('image'),
                      u = '',
                      p = 0;
                    p < o.length;
                    p++
                  )
                    'years' === o[p].substring(0, 5) && (u = o[p] + '/');
                  var h,
                    m,
                    f = y + u + t.search;
                  $('html').hasClass('lteie9') ? (location.href = f) : history.replaceState({}, n, f),
                    $('.b-photo').replaceWith(s),
                    $('meta[property="og:image"]').first().attr('content', d),
                    $('title').html(a),
                    $('meta[property="og:title"]').attr('content', r),
                    $('meta[name="description"]').attr('content', l),
                    $('meta[property="og:description"]').attr('content', c),
                    (h = g),
                    $('.b-photo__list-item').css('min-height', h),
                    k(),
                    v(),
                    ((m = new Image()).src = $('.b-photo__list-big-photo').attr('src')),
                    (m.onload = function () {
                      $('.b-photo__list-item').removeAttr('style');
                    }),
                    $('.b-photo').trigger('changephoto'),
                    window.yaCounter && window.yaCounter.hit(f),
                    window.ga &&
                      ga('send', {
                        hitType: 'pageview',
                        page: f,
                      });
                },
                fail: function (e) {
                  console.log(e);
                },
              }),
              localStorage.setItem('locationGallery', 1)));
      }
      function C() {
        var e = $('.b-photo__relatives-item_current_yes').next().hasClass('b-photo__relatives-item'),
          t = $('.b-photo__relatives-item_current_yes').prev().hasClass('b-photo__relatives-item'),
          o = $('.b-photo__list').data('next'),
          i = $('.b-photo__list').data('prev');
        e ? $('.b-photo__right').show() : ('' !== o && 'None' !== o) || $('.b-photo__right').hide(),
          t ? $('.b-photo__left').show() : ('' !== i && 'None' !== i) || $('.b-photo__left').hide();
      }
      function n(e) {
        var t = e.data('original'),
          o = e.data('id'),
          i = e.data('incart'),
          s = $('.b-photo__relatives-item').index(e),
          n = e.find('img').attr('alt');
        $('.b-photo').data('id', o),
          $('.b-comments-form-controls').hasClass('b-comments-form-controls_hide_yes') ||
            $('.b-comments-form-controls').addClass('b-comments-form-controls_hide_yes'),
          i
            ? ($('.b-photo__incart').hasClass('b-photo__incart_cart_yes') ||
                $('.b-photo__incart').addClass('b-photo__incart_cart_yes'),
              $('.b-photo__incart').text('Убрать из избранных'))
            : ($('.b-photo__incart').removeClass('b-photo__incart_cart_yes'),
              $('.b-photo__incart').text('В избранное')),
          (function (_) {
            _ = parseInt(_, 10) + 1;
            var g,
              v = new URL(window.location.href),
              e = v.pathname.split('/'),
              b = '';
            v.searchParams.set('index', _);
            for (var t = 0; t < e.length; t++) 'years' === e[t].substring(0, 5) && (b = e[t] + '/');
            (g = (x ? r + b : a + b) + v.search),
              $.ajax({
                method: 'get',
                url: g,
                success: function (e) {
                  var t = e.csrf_token,
                    o = $.parseHTML(e.html['b-photo-information']),
                    i = $.parseHTML(e.html['b-photo']),
                    s = $(o).find('.b-photo__title').text(),
                    n = $(i).find('.share'),
                    a = (x ? w + b : y + b) + v.search,
                    r = $(i).find('.share').data('image'),
                    l = e.html.seo_title,
                    c = e.html.og_title,
                    d = e.html.seo_description,
                    u = e.html.og_description,
                    p = $(i).find('.b-photo__left'),
                    h = $(i).find('.b-photo__right');
                  $('title').text(l), $('.b-photo__left').replaceWith(p), $('.b-photo__right').replaceWith(h);
                  var m = $('.b-photo__relatives-item').eq(_).data('name'),
                    f = $('.b-photo__relatives-item')
                      .eq(_ - 2)
                      .data('name');
                  $('.b-photo__left').attr({
                    title: f,
                  }),
                    $('.b-photo__right').attr({
                      title: m,
                    }),
                    $('.b-photo__list').data('prev', p.attr('href')),
                    $('.b-photo__list').data('next', h.attr('href')),
                    $('meta[property="og:image"]').first().attr('content', r),
                    $('meta[property="og:title"]').attr('content', c),
                    $('meta[name="description"]').attr('content', d),
                    $('meta[property="og:description"]').attr('content', u),
                    $(o[0]).find('input[name=csrfmiddlewaretoken]').val(t),
                    $('html').hasClass('lteie9') ? (location.href = a) : history.replaceState({}, s, a),
                    $('.share').replaceWith(n),
                    $('.b-photo-information').replaceWith(o),
                    setTimeout(function () {
                      k();
                    }, 0),
                    C(),
                    window.yaCounter && window.yaCounter.hit(g),
                    window.ga &&
                      ga('send', {
                        hitType: 'pageview',
                        page: g,
                      });
                },
                fail: function (e) {
                  console.log(e);
                },
              });
          })(s),
          $('.b-photo').trigger('changephoto'),
          $('.b-photo__relatives-item').removeClass('b-photo__relatives-item_current_yes'),
          e.addClass('b-photo__relatives-item_current_yes'),
          v(),
          $('.b-photo__list-big-photo').attr('src', t),
          $('.b-photo__list-big-photo').attr('alt', n),
          $('.b-photo__list-big-photo')
            .one('load', function () {})
            .each(function () {
              $('.b-photo__list-big-photo').animate(
                {
                  opacity: 1,
                },
                300,
              );
            });
      }
      function v() {
        $('html, body')
          .stop()
          .animate(
            {
              scrollTop: $('.b-photo').offset().top,
            },
            700,
          );
      }
      $(document).on('click', '.b-photo__relatives-item', function (e) {
        e.preventDefault(), n($(e.currentTarget));
      }),
        $(document).on('click', '.b-photo__left', function (e) {
          s(e, 'prev');
        }),
        $(document).on('click', '.b-photo__right', function (e) {
          s(e, 'next');
        }),
        t &&
          (Mousetrap.bind(['right'], function (e) {
            s(e, 'next');
          }),
          Mousetrap.bind(['left'], function (e) {
            s(e, 'prev');
          })),
        C();
    }
  }),
  (justifyImages = null),
  (function (u) {
    function p(e, t) {
      return e.map(function (e) {
        return {
          imageItem: e.imageItem,
          height: Math.floor(t),
          width: Math.floor((t / e.height) * e.width),
        };
      });
    }
    function h(e) {
      for (var t = 0, o = 0; o < e.length; ++o) t += e[o].width;
      return t;
    }
    function m(e, t) {
      return e.map(function (e) {
        return {
          imageItem: e.imageItem,
          height: Math.floor(e.height * t),
          width: Math.floor(e.width * t),
        };
      });
    }
    function f(e) {
      for (var t, o = 0; o < e.length; ++o) {
        (t = e[o].imageItem.next().find('.b-search-result__item-button')).length ||
          (t = e[o].imageItem.next().find('.b-search-result__item-button-small')),
          e[o].width < 110
            ? (t.removeClass('b-search-result__item-button').addClass('b-search-result__item-button-small'),
              t.hasClass('b-search-result__item-button_checked_yes') &&
                t
                  .removeClass('b-search-result__item-button_checked_yes')
                  .addClass('b-search-result__item-button-small_checked_yes'),
              t.find('.b-search-result__item-button-text').attr('class', 'b-search-result__item-button-small-image'),
              t
                .find('.b-search-result__item-button-ckecked')
                .attr('class', 'b-search-result__item-button-small-image_checked'))
            : (t.removeClass('b-search-result__item-button-small').addClass('b-search-result__item-button'),
              t.hasClass('b-search-result__item-button-small_checked_yes') &&
                t
                  .removeClass('b-search-result__item-button-small_checked_yes')
                  .addClass('b-search-result__item-button_checked_yes'),
              t.find('.b-search-result__item-button-small-image').attr('class', 'b-search-result__item-button-text'),
              t
                .find('.b-search-result__item-button-small-image_checked')
                .attr('class', 'b-search-result__item-button-ckecked'));
        var i = t.find('.b-search-result__item-button-text'),
          s = 'text',
          n = [
            {
              width: 135,
              text: 'В избр.',
              textChecked: 'В избр.',
            },
            {
              width: 200,
              text: 'В избранное',
              textChecked: 'В избранном',
            },
            {
              text: 'Добавить в избранное',
              textChecked: 'В избранном',
            },
          ];
        switch (
          ((t.hasClass('b-search-result__item-button_checked_yes') ||
            t.hasClass('b-search-result__item-button-small_checked_yes')) &&
            (s = 'textChecked'),
          !0)
        ) {
          case e[o].width < n[0].width:
            i.text(n[0][s]);
            break;
          case e[o].width < n[1].width:
            i.text(n[1][s]);
            break;
          default:
            i.text(n[2][s]);
        }
        e[o].imageItem.width(e[o].width).height(e[o].height);
      }
    }
    justifyImages = function (e, t) {
      var o = e.find('img'),
        i = [],
        s = o.length,
        n = parseInt(e.width(), 10);
      window.innerWidth > document.documentElement.clientWidth || (n -= 20),
        (t = t || Math.ceil(s / 4)),
        o.each(function () {
          var e = u(this);
          i.push({
            imageItem: e,
            width: e.data('width'),
            height: e.data('height'),
          });
        });
      for (
        var a = (function (e, t) {
            for (var o = h(e), i = 0, s = 0, n = [], a = 0, r = 0; r < e.length; ++r) {
              i += e[r].width;
              var l = (s + 1) * (o / t),
                c = a <= l && l <= i,
                d = l - a,
                u = i - l;
              c && d <= u && (s++, (c = !1)),
                void 0 === n[s] && (n[s] = []),
                n[s].push(e[r]),
                c && u <= d && s++,
                (a = i);
            }
            return n;
          })((i = p(i, 100)), t),
          r = 0;
        r < a.length;
        r++
      ) {
        var l = a[r],
          c = h(l),
          d = (n - 10 * (l.length + 1)) / c;
        f((i = s < 4 ? p(l, 350) : m(l, d)));
      }
      setTimeout(function () {
        e.trigger('endgallery');
      }, 0);
    };
  })(jQuery),
  $(function () {
    function e() {
      $('.b-photo-group__photos').each(function () {
        var e = $(this),
          t = e.data('rowsnumber');
        justifyImages(e, t);
      });
    }
    e(),
      $(window).on('resize', function () {
        e();
      });
  }),
  $(function () {
    var t = 0,
      e = window.location.href.match(/sources\/(\d+)/),
      o = e ? e[1] : null;
    $('.b-top').on('searchform', function () {
      t = 0;
    }),
      $(document).on('click', '.b-search-authors__all-authors', function () {
        var e;
        (e = new URL(window.location.href)),
          (t += 30),
          e.searchParams.append('facet_size_author_ids', t),
          o && e.searchParams.append('source_ids', o),
          $.ajax({
            method: 'get',
            url: '/search/ajax/' + e.search,
            success: function (e) {
              var t = e.html.authors;
              $('.b-search-authors').replaceWith(t);
            },
          });
      });
  }),
  $(function () {
    $('.b-search-input__field').on('keydown', function () {
      0 < $('.b-search-input__field').val().length
        ? $('.b-search-input__clear').addClass('b-search-input__clear_show_yes')
        : $('.b-search-input__clear').removeClass('b-search-input__clear_show_yes');
    }),
      $('.b-search-input__clear').on('click', function () {
        $('.b-search-input__field').val(''), $('.b-search-input__clear').removeClass('b-search-input__clear_show_yes');
      });
  }),
  $(function () {
    var p = !1,
      h = !1,
      m = function () {
        return $('.b-search-result');
      },
      f = {
        currentPage: 1,
      };
    window.searchResult = f;
    var e = new URL(window.location.href).searchParams.get('paginate_page');
    if ((e && (f.currentPage = parseInt(e, 10)), 1 != f.currentPage)) {
      var t = function () {
        var e = 1 < f.currentPage ? f.currentPage - 1 : 0,
          t = $('.b-search-result__page').eq(e).offset().top;
        $('body').stop().scrollTop(t);
      };
      $('.b-search-result__item img').each(function () {
        var e = new Image();
        (e.onload = t), (e.src = $(this).attr('src'));
      });
    }
    function c() {
      var e,
        t,
        o,
        i,
        s,
        n,
        a,
        r,
        l = $('.b-search-result__page').hasClass('b-search-result__page_type_myphotos'),
        c = l
          ? $(window).scrollTop() + window.innerHeight >= document.body.scrollHeight - 10
          : ((e = $('.b-search-result__page').last()),
            (t = e.height()),
            (o = e.offset().top + t),
            (i = $(window).scrollTop()),
            (s = i + window.innerHeight / 2 > o),
            (n = i + window.innerHeight >= document.body.scrollHeight - 10),
            s || n);
      if ((1 == f.currentPage && void 0 !== m().data('has-next') && (p = !m().data('has-next')), c && !p)) {
        var d = l
          ? {
              url: window.location.pathname,
              data: $.param(
                {
                  page: f.currentPage + 1,
                },
                !0,
              ),
            }
          : (function () {
              var e = (document.getElementById('b-top__year-from') || {}).value,
                t = (document.getElementById('b-top__year-to') || {}).value,
                o = e && t ? 'years-' + e + '-' + t + '/' : '',
                i = new URL(window.location.href),
                s = {
                  page: f.currentPage + 1,
                  query: i.searchParams.getAll('query').filter(Boolean),
                  author_ids: i.searchParams.getAll('author_ids').filter(Boolean),
                  source_ids: i.searchParams.getAll('source_ids').filter(Boolean),
                  tag_tree_ids: i.searchParams.getAll('tag_tree_ids').filter(Boolean),
                },
                n = $.param(s, !0),
                a = $('.b-top_page_geo')
                  .find(':input')
                  .filter(function () {
                    return '' !== $(this).val();
                  })
                  .serialize();
              a && (n += (n ? '&' : '') + a);
              return {
                url: '/search/ajax/' + o,
                data: n,
              };
            })();
        f.currentPage++;
        var u = $(
          ((a = f.currentPage),
          (r =
            '<div class="b-search-result__divider b-search-result__divider_loading_yes"><div class="b-search-result__divider-line"></div><div class="b-search-result__divider-pagetext">Страница ' +
            a +
            '</div></div>'),
          $.parseHTML(r)),
        );
        m().append(u),
          (h = !0),
          $.ajax({
            method: 'get',
            url: d.url,
            data: d.data,
          })
            .done(function (e) {
              h = !1;
              var t = l ? e.html : e.html.photos,
                o = $($.parseHTML(t));
              1 < f.currentPage &&
                ($.selectedPhoto.setSelected(o),
                m().append(o),
                window.justifyImages(o),
                o.on('endgallery', function () {
                  u.removeClass('b-search-result__divider_loading_yes');
                })),
                e.has_next ||
                  ((p = !0),
                  l &&
                    setTimeout(function () {
                      u.remove();
                    }, 0));
            })
            .fail(function () {
              h = !1;
            });
      }
    }
    function o(e) {
      $('html, body').animate(
        {
          scrollTop: e.offset().top - 40,
        },
        300,
      );
    }
    function i() {
      for (var e = $('.b-search-result__page'), t = e.length, o = 0; o < t; o++) window.justifyImages($(e[o]));
    }
    $(document).on('click', '.b-search-result__item-button, .b-search-result__item-button-small', function (e) {
      e.stopPropagation(),
        e.preventDefault(),
        $('.b-search-result__back').css({
          bottom: '110px',
        }),
        $('.b-panel-selector').show();
      var t = $(this),
        o = t.data('id'),
        i = t.parent().prev().width(),
        s = t.hasClass('b-search-result__item-button_checked_yes'),
        n = t.hasClass('b-search-result__item-button-small_checked_yes'),
        a = t.find('.b-search-result__item-button-text');
      s || n
        ? $.post(
            '/rest/front/exhibitions-cart/remove/',
            JSON.stringify({
              photo: o,
            }),
            function () {
              s
                ? (t.removeClass('b-search-result__item-button_checked_yes'),
                  i < 135 ? a.text('В избр.') : i < 200 ? a.text('В избранное') : a.text('Добавить в избранное'))
                : t.removeClass('b-search-result__item-button-small_checked_yes'),
                ($.selectedPhoto.list = $.grep($.selectedPhoto.list, function (e) {
                  return e !== o;
                })),
                $.selectedPhoto.panelRefresh();
            },
          )
        : $.post(
            '/rest/front/exhibitions-cart/add/',
            JSON.stringify({
              photo: o,
            }),
            function (e) {
              t.hasClass('b-search-result__item-button-small')
                ? t.addClass('b-search-result__item-button-small_checked_yes')
                : (t.addClass('b-search-result__item-button_checked_yes'),
                  i < 135 ? a.text('В избр.') : a.text('В избранном')),
                ($.selectedPhoto.list = e.photo_ids),
                $.selectedPhoto.panelRefresh();
            },
          );
    }),
      $('.b-top').on('searchform', function () {
        f.currentPage = 1;
      }),
      $(window).on('resize', i),
      i(),
      $(window).on('scroll touchmove', function () {
        if (0 < $('.b-search-result__page').length) {
          !h && c();
          var e = $(window).scrollTop(),
            t =
              ((l = []),
              _.each($('.b-search-result__page'), function (e) {
                l.push($(e).offset().top);
              }),
              l),
            o =
              ((s = e),
              (n = t),
              (r = a = null),
              _.each(n, function (e, t) {
                (null === a || Math.abs(e - s) < Math.abs(a - s)) && ((a = e), (r = t));
              }),
              r),
            i = 0 < o ? 'addClass' : 'removeClass';
          $('.b-search-result__back')[i]('b-search-result__back_show_yes'), m().data('page', o);
        }
        var s, n, a, r, l;
      }),
      0 < m().length &&
        ($(document).on('click', '.b-search-result__back-top', function () {
          o(m());
        }),
        $(document).on('click', '.b-search-result__back-page', function () {
          var e = m().data('page');
          o($('.b-search-result__page').eq(e - 1));
        })),
      $(document).on('mouseenter', '.b-search-result__item, .b-photo-group__item, .cart-photo__item', function () {
        var e,
          t = $(this).width(),
          o = $(this).find('.b-search-result__item-title'),
          i = $(this).find('.b-search-result__item-author'),
          s = $(this).find('.b-search-result__item-years'),
          n = i.width(),
          a = o.width(),
          r = s.width();
        t < a + 21 &&
          ((e = a / 40),
          o.addClass('b-search-result__item-title_marquee_yes'),
          o.css({
            animation: 'marquee ' + e + 's linear infinite',
          })),
          t < n + 21 &&
            ((e = n / 40),
            i.addClass('b-search-result__item-author_marquee_yes'),
            i.css({
              animation: 'marquee ' + e + 's linear infinite',
            })),
          t < r + 21 &&
            ((e = r / 40),
            s.addClass('b-search-result__item-years_marquee_yes'),
            s.css({
              animation: 'marquee ' + e + 's linear infinite',
            }));
      }),
      $(document).on('mouseleave', '.b-search-result__item, .b-photo-group__item, .cart-photo__item', function () {
        $(this)
          .find('.b-search-result__item-title')
          .removeClass('b-search-result__item-title_marquee_yes')
          .removeAttr('style'),
          $(this)
            .find('.b-search-result__item-author')
            .removeClass('b-search-result__item-author_marquee_yes')
            .removeAttr('style'),
          $(this)
            .find('.b-search-result__item-years')
            .removeClass('b-search-result__item-years_marquee_yes')
            .removeAttr('style');
      }),
      $(document).on('mousemove', '.b-search-result__item', function () {
        var e = $(this),
          t = e.find('img'),
          o = parseInt(t.css('width'), 10),
          i = parseInt(t.css('height'), 10),
          s = e.find('.b-search-result__item-desc-wrapper');
        if (o < 110 || i < 135) {
          s.hide();
          var n,
            a,
            r = e.offset(),
            l = e.width(),
            c = e.height(),
            d = r.left + l / 2,
            u = r.top + c / 2,
            p = e.find('.b-search-popover-result'),
            h = parseInt(p.css('width'), 10),
            m = parseInt(p.css('height'), 10),
            f = o / 4 - 2.5;
          d - h / 2 <= 0
            ? ($('head:contains(.b-search-popover-result_left:before)').length <= 0 &&
                (a = $('<style>.b-search-popover-result_left:before {left: ' + f + '%;}</style>').appendTo('head')),
              p
                .css('left', r.left)
                .css('top', u - i / 2 - m)
                .addClass('b-search-popover-result_left'))
            : p.css('left', d - h / 2 - 10).css('top', u - i / 2 - m),
            (n = p.clone().addClass('savi').css('pointer-events', 'none'));
          var _ = $('body');
          _.find('.savi').length <= 0 && _.append(n.show()),
            $('.b-search-result__item').mouseout(function () {
              a && a.remove(), n.remove(), s.show();
            });
        }
      });
  }),
  $(function () {
    var t = 0,
      e = window.location.href.match(/sources\/(\d+)/),
      o = e ? e[1] : null;
    $('.b-top').on('searchform', function () {
      t = 0;
    }),
      $(document).on('click', '.b-search-tags__all-tags', function () {
        var e;
        (e = new URL(window.location.href)),
          (t += 30),
          e.searchParams.append('facet_size_tag_tree_ids', t),
          o && e.searchParams.append('source_ids', o),
          $.ajax({
            method: 'get',
            url: '/search/ajax/' + e.search,
            success: function (e) {
              var t = e.html.tags;
              $('.b-search-tags').replaceWith(t);
            },
          });
      });
  }),
  $(function () {
    var t = 0;
    $('.b-top').on('searchform', function () {
      t = 0;
    }),
      $(document).on('click', '.b-search-sources__all-sources', function () {
        var e;
        (e = new URL(window.location.href)),
          (t += 30),
          e.searchParams.append('facet_size_source_ids', t),
          $.ajax({
            method: 'get',
            url: '/search/ajax/' + e.search,
            success: function (e) {
              var t = e.html.sources;
              $('.b-search-sources').replaceWith(t);
            },
          });
      });
  }),
  $(function () {
    var e = $('.b-themes__items');
    if (0 < e.length) {
      var t = null;
      justifyImages(e),
        e.on('endgallery', function () {
          clearTimeout(t),
            (t = setTimeout(function () {
              $('.b-themes__section').addClass('b-themes__section_show_yes'),
                $('.b-themes__loader').removeClass('b-themes__loader_show_yes');
            }, 200));
        }),
        $(window).on('resize', function () {
          justifyImages(e);
        });
    }
  }),
  $(function () {
    var e = new URL(window.location.href),
      d = '/search/ajax/',
      u = '/search/',
      p = 0,
      i = {},
      h = !1;
    e.searchParams.get('author_ids') && (i.author = e.searchParams.get('author_ids')),
      e.searchParams.get('source_ids') && (i.source = e.searchParams.get('source_ids'));
    var m = $('.b-top');
    function f(e) {
      h ||
        ((h = !0),
        $.ajax({
          method: 'get',
          url: e,
          success: function (e) {
            var t = e.total,
              o = e.has_next,
              i = e.html,
              s = i.authors,
              n = i.photos,
              a = i.sources,
              r = i.tags,
              l = $('.search-content'),
              c = l.clone();
            l.remove(),
              (h = !1),
              0 == t
                ? ($('.b-page__main-content').remove(),
                  $('.search-content').remove(),
                  c.find('.b-search-result').html(n),
                  $('.b-page__padding_head_yes').after(c),
                  $('.social-sidebar').removeClass('social-sidebar_show_yes'),
                  $('.social-block').removeClass('social-block_hide_yes'),
                  $('.b-page__sidebar-facets').empty(),
                  $('.b-body__content').removeClass('b-body__content_has-result_yes'))
                : ($('.b-page__main-content').remove(),
                  $('.search-content').find('.b-page__padding_32').remove(),
                  c.find('.b-page__sidebar-facets').html(r + s + a),
                  c.find('.b-search-result').data('has-next', Boolean(o)),
                  c.find('.b-search-result').html(n),
                  $('.b-page__padding_head_yes').after(c),
                  $('.b-search-result__page').addClass('b-search-result__page_loading_yes'),
                  $('.b-search-result__page img').one('load', function () {
                    var e = $('.b-search-result__page');
                    justifyImages(e), e.removeClass('b-search-result__page_loading_yes');
                  }),
                  $('.social-block').addClass('social-block_hide_yes'),
                  $('.social-sidebar').addClass('social-sidebar_show_yes'),
                  $('.b-body__content').addClass('b-body__content_has-result_yes')),
              $('.b-body').hasClass('b-body_authenticated_yes') &&
                setTimeout(function () {
                  $.getJSON('/rest/front/exhibitions-cart/list-ids/').success(function (e) {
                    ($.selectedPhoto.list = e.photo_ids), $.selectedPhoto.panelRefresh(), $.selectedPhoto.setSelected();
                  });
                }, 0);
          },
        }));
    }
    m.on('changeAuthor', function (e, t) {
      var o = t.author;
      (i.type = 'author-select'), (i.author = o), m.trigger('searchform', i);
    }),
      m.on('changeSource', function (e, t) {
        var o = t.source;
        (i.type = 'source-select'), (i.source = o), m.trigger('searchform', i);
      }),
      m.on('submit', function (e) {
        e.preventDefault(),
          m.trigger('searchform', {
            type: 'submit-form',
          });
      }),
      m.on('searchform', function (e, t) {
        var o;
        if ('example' !== t.type) {
          var i = new URL(window.location.href),
            s = t.author || $('input[name=author_ids]').attr('ng-value'),
            n = t.source || $('input[name=source_ids]').attr('ng-value');
          o = m
            .find(':input')
            .filter(function () {
              return 'submit-form' !== t.type
                ? !(
                    $(this).hasClass('b-top-search__hidden') ||
                    this == document.getElementById('b-top__year-from') ||
                    this == document.getElementById('b-top__year-to')
                  )
                : !(
                    '' === $(this).val() ||
                    this == document.getElementById('b-top__year-from') ||
                    this == document.getElementById('b-top__year-to')
                  );
            })
            .serialize();
          for (
            var a =
                'years-' +
                document.getElementById('b-top__year-from').value +
                '-' +
                document.getElementById('b-top__year-to').value +
                '/',
              r = i.searchParams.getAll('tag_tree_ids'),
              l = '',
              c = 0;
            c < r.length;
            c++
          )
            l += '&tag_tree_ids=' + r[c];
          if (s || n)
            (o = m
              .find(':input')
              .filter(function () {
                return !(
                  $(this).hasClass('b-top-search__hidden') ||
                  this == document.getElementById('b-top__year-from') ||
                  this == document.getElementById('b-top__year-to')
                );
              })
              .serialize()),
              (o += (n ? '&source_ids=' + n : '') + (s ? '&author_ids=' + s : ''));
          (p = $.now()),
            setTimeout(function () {
              setTimeout(function () {
                $.now() - p < 500 ||
                  ($('.b-body').removeClass('b-body_main_yes'),
                  $('html').hasClass('lteie9')
                    ? (location.href = u + a + '?' + o + l)
                    : (history.pushState({}, 'Поиск', u + a + '?' + o + l),
                      setTimeout(function () {
                        f(d + a + '?' + o + l);
                      }, 0)));
              }, 50);
            }, 500);
        } else
          (o = t.query ? 'query=' + encodeURIComponent(t.query) : ''),
            (p = $.now()),
            setTimeout(function () {
              $('.b-body').removeClass('b-body_main_yes'),
                $('html').hasClass('lteie9')
                  ? (location.href = u + '?' + o)
                  : (history.pushState({}, 'Поиск', u + '?' + o),
                    setTimeout(function () {
                      f(d + '?' + o);
                    }, 0));
            }, 500);
      });
  }),
  $(function () {
    var e = -1 < navigator.userAgent.indexOf('Chrome'),
      t = -1 < navigator.userAgent.indexOf('Safari');
    function s() {
      var e = $('.b-top-search__example-query');
      if (0 < e.length) {
        var t = $.trim($('.b-top-search__field-text').val()),
          o = e.data('examples').split(';'),
          i = o[Math.floor(Math.random() * o.length)];
        t != i ? e.text(i) : 1 < o.length && s();
      }
    }
    function o() {
      var e = $('#b-top-search__select-author').val(),
        t = $('#b-top-search__select-source').val();
      (e || t) && $('.b-top-search').removeClass('b-top-search_min_yes');
    }
    e && t && (t = !1),
      t && $('.b-body').addClass('b-body_browser_safari'),
      s(),
      o(),
      $('.b-top').on('searchform', function (e, t) {
        o(), (t && 'timeline' === t.type) || s();
      }),
      $('.b-top-search__example-query').on('click', function () {
        var e = $('.b-top-search__example-query').text();
        $('.b-top-search__field-text').val(e),
          $('.b-top-search__field-text-clear').show(),
          $('.b-top').trigger('searchform', {
            type: 'example',
            query: e,
          }),
          $('.b-timeline__slider').val([1840, 1999]);
      }),
      $('.b-top-search__field-text').on('input cut paste', function () {
        0 < $('.b-top-search__field-text').val().length
          ? $('.b-top-search__field-text-clear').show()
          : $('.b-top-search__field-text-clear').hide();
      }),
      $('.b-top-search__field-text-clear').on('click', function () {
        $('.b-top-search__field-text').val(''), $('.b-top-search__field-text-clear').hide();
      }),
      $('.b-top-search__addition-extended').on('click', function () {
        $('.b-top-search').removeClass('b-top-search_min_yes');
      });
  }),
  $(function () {
    var d = [55.75396, 37.620393],
      h = $('.geo__map')[0],
      n = new URL(window.location.href).searchParams.get('bounds');
    h &&
      ymaps.ready(function () {
        var p,
          i = ymaps.geolocation,
          e = void 0 === document.documentMode,
          t = window.chrome;
        function o() {
          p && p.container.fitToViewport();
        }
        function s(e) {
          e.geoObjects.get(0).options.set({
            iconImageHref: '/static/desktop/front/blocks/geo/my-position.png',
            iconImageSize: [40, 45],
            iconImageOffset: [-20, -45],
          }),
            p.geoObjects.add(e.geoObjects),
            p.setCenter(e.geoObjects.get(0).geometry.getCoordinates(), 5, {
              duration: 300,
            });
        }
        function c() {
          if (n && 8 < n.length) {
            var e = n.split(','),
              t = [e[0], e[1]],
              o = [e[2], e[3]];
            p.setBounds([t, o], {
              checkZoomRange: !0,
            }).then(
              function () {},
              function (e) {
                console.log(e);
              },
              this,
            );
          } else
            i.get({
              provider: 'browser',
            }).then(
              function (e) {
                s(e);
              },
              function () {
                i.get({
                  provider: 'yandex',
                }).then(function (e) {
                  s(e);
                });
              },
            );
        }
        e && !t
          ? $(window)
              .on('focusin', function () {
                setTimeout(function () {
                  o();
                }, 100);
              })
              .on('focusout', function () {})
          : window.addEventListener
          ? (window.addEventListener(
              'focus',
              function () {
                setTimeout(function () {
                  o();
                }, 100);
              },
              !1,
            ),
            window.addEventListener('blur', function () {}, !1))
          : (window.attachEvent('focus', function () {
              setTimeout(function () {
                o();
              }, 100);
            }),
            window.attachEvent('blur', function () {})),
          (function () {
            (p = new ymaps.Map(
              h,
              {
                center: d,
                zoom: 6,
                controls: ['searchControl'],
              },
              {
                minZoom: 2,
              },
            )),
              c();
            var n = ymaps.templateLayoutFactory.createClass(
                "<div class='b-map__control'><button class='b-map__control-item b-map__control-item_zoom-in js-b-map-control-item_zoom js-b-map-control-item_zoom-in'></button><button class='b-map__control-item b-map__control-item_zoom-out js-b-map-control-item_zoom js-b-map-control-item_zoom-out'></button></div>",
                {
                  build: function () {
                    n.superclass.build.call(this);
                    var e = this,
                      t = $('.js-b-map-control-item_zoom'),
                      o = $('.js-b-map-control-item_zoom-in'),
                      i = $('.js-b-map-control-item_zoom-out'),
                      s = this.getData().control.getMap();
                    s.events.add('boundschange', function () {
                      s.zoomRange.get(s.getCenter()).then(function (e) {
                        var t = e[1],
                          o = e[0],
                          i = s.getZoom();
                        t === i
                          ? s.events.fire('mapZoomMax')
                          : o === i
                          ? s.events.fire('mapZoomMin')
                          : s.events.fire('mapZoomNorm');
                      });
                    }),
                      s.events.add('mapZoomMax', function () {
                        e.buttonDesable(o);
                      }),
                      s.events.add('mapZoomMin', function () {
                        e.buttonDesable(i);
                      }),
                      s.events.add('mapZoomNorm', function () {
                        e.buttonEnable(t);
                      }),
                      (this.zoomInCallback = ymaps.util.bind(this.zoomIn, this)),
                      (this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this)),
                      o.on('click.mapzoom', this.zoomInCallback),
                      i.on('click.mapzoom', this.zoomOutCallback);
                  },
                  clear: function () {
                    $('.js-b-map-control-item_zoom-in').off('click.mapzoom', this.zoomInCallback),
                      $('.js-b-map-control-item_zoom-out').off('click.mapzoom', this.zoomOutCallback),
                      n.superclass.clear.call(this);
                  },
                  zoomIn: function (e) {
                    var t = $(e.target);
                    if (t.hasClass('b-map__control-item_desable')) return !1;
                    var o = this.getData().control.getMap(),
                      i = o.getZoom();
                    this.events.fire('zoomchange', {
                      oldZoom: i,
                      newZoom: i + 1,
                    });
                  },
                  zoomOut: function (e) {
                    var t = $(e.target);
                    if (t.hasClass('b-map__control-item_desable')) return !1;
                    var o = this.getData().control.getMap(),
                      i = o.getZoom();
                    this.events.fire('zoomchange', {
                      oldZoom: i,
                      newZoom: i - 1,
                    });
                  },
                  buttonDesable: function (e) {
                    e.addClass('b-map__control-item_desable');
                  },
                  buttonEnable: function (e) {
                    e.removeClass('b-map__control-item_desable');
                  },
                },
              ),
              e = ymaps.templateLayoutFactory.createClass(
                "<div class='b-map__control b-map__control_location'><button class='b-map__control-item b-map__control-item_location js-b-map-control-location'></button></div>",
              ),
              t = new ymaps.control.Button({
                data: {},
                options: {
                  layout: e,
                  position: {
                    top: 400,
                    left: 10,
                  },
                },
              }),
              o = new ymaps.control.ZoomControl({
                options: {
                  layout: n,
                  float: 'none',
                  position: {
                    top: 230,
                    left: 10,
                  },
                },
              });
            p.controls.add(o),
              p.controls.add(t),
              t.events.add('click', function () {
                c();
              });
            var u = new ymaps.GeoObjectCollection();
            function i(e, a) {
              var t,
                o = e ? e.properties.get('geohash') : null;
              if (
                ((window.searchResult.currentPage = 1),
                $('.geo__photos-query').val(o),
                (t =
                  o && e
                    ? {
                        geohash: o,
                        page: window.searchResult.currentPage,
                      }
                    : a
                    ? {
                        bounds: a,
                      }
                    : null))
              ) {
                var i = $.ajax({
                  method: 'get',
                  url: '/search/ajax/',
                  data: t,
                  traditional: !0,
                  dataType: 'json',
                });
                i.done(function (e) {
                  var t = e.total,
                    o = e.html.photos,
                    i = e.has_next,
                    s = l(['фотография', 'фотографии', 'фотографий'], t),
                    n = l(['Найдена', 'Найдены', 'Найдены'], t);
                  0 < t
                    ? ($('.b-search-result').show(),
                      $('.geo__photos-finded').text(n),
                      $('.geo__photos-title').show(),
                      $('.geo__photos-num').text(t),
                      $('.geo__photos-num-text').text(s))
                    : ($('.geo__photos-title').hide(), $('.b-search-result').hide()),
                    a ||
                      $('html, body').animate(
                        {
                          scrollTop: $('.geo__photos').offset().top - 20,
                        },
                        500,
                      ),
                    0 == t
                      ? $('.b-search-result').html(o)
                      : ($('.b-search-result').data('has-next', Boolean(i)),
                        $('.b-search-result').html(o),
                        $('.b-search-result__page').addClass('b-search-result__page_loading_yes'),
                        $('.b-search-result__page img').one('load', function () {
                          justifyImages($('.b-search-result__page')),
                            $('.b-search-result__page').removeClass('b-search-result__page_loading_yes');
                        }));
                }),
                  i.fail(function (e, t) {
                    console.log('Fail: ' + t);
                  });
              }
            }
            function s(e, t) {
              var o,
                i,
                s,
                n,
                a = e.lat,
                r = e.lon,
                l = e.photo.id,
                c = e.geohash,
                d = new ymaps.Placemark(
                  [a, r],
                  {
                    id: l,
                    geohash: c,
                  },
                  {
                    zIndex: t,
                    iconLayout:
                      ((o = e),
                      (i = o.photo.url),
                      (s = o.photos_count < 2 ? '' : o.photos_count),
                      (n = o.photos_count < 2 ? '' : 'фото'),
                      ymaps.templateLayoutFactory.createClass(
                        '<div class="geo__map-icon-container"><div class="geo__map-icon-shape">    <div class="geo__map-icon-image" style="background-image: url(' +
                          i +
                          '); background-position: 50% 0"></div>    <div class="geo__map-icon-desc">        <div class="geo__map-icon-num">' +
                          s +
                          '</div>        <div class="geo__map-icon-text">' +
                          n +
                          '</div>    </div>    </div></div>',
                      )),
                    iconShape: {
                      type: 'Rectangle',
                      coordinates: [
                        [-46, -54],
                        [46, 54],
                      ],
                    },
                    iconOffset: [0, -54],
                  },
                );
              u.add(d), p.geoObjects.add(u);
            }
            function a(e) {
              var t = [e[1][0], e[0][1], e[0][0], e[1][1]];
              return t.join();
            }
            function r(e) {
              var t = $.ajax({
                method: 'get',
                url: '/rest/front/map-grid/',
                data: {
                  bounds: a(e),
                },
                dataType: 'json',
              });
              t.done(function (e) {
                var t = e.results;
                u.removeAll();
                for (var o = 0; o < t.length; o++) s(t[o], o);
              }),
                t.fail(function (e, t) {
                  console.log('Fail: ' + t);
                }),
                i(null, a(e));
            }
            function l(e, t) {
              return e[4 < t % 100 && t % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][t % 10 < 5 ? t % 10 : 5]];
            }
            p.geoObjects.events.add('click', function (e) {
              var t = e.get('target');
              i(t);
            }),
              r(p.getBounds()),
              p.events.add('boundschange', function () {
                var e = p.getBounds(),
                  t = a(e);
                $('.geo__photos-bounds').val(t),
                  history.pushState({}, 'Фотографии на карте', '/map/?bounds=' + t),
                  r(e);
              });
          })();
      });
  }),
  $(function () {
    $('.other-exhibitions__list').slick({
      infinite: !0,
      speed: 450,
      slidesToShow: 3,
      slidesToScroll: 3,
      prevArrow: $('.other-exhibitions__left'),
      nextArrow: $('.other-exhibitions__right'),
    });
  }),
  $(function () {
    var s = {
      index: 0,
      loading: !1,
      periodsURL: '/period/ajax/',
      periodsRange: [
        'years-1870-1879',
        'years-1880-1889',
        'years-1890-1899',
        'years-1900-1909',
        'years-1910-1919',
        'years-1920-1929',
        'years-1930-1939',
        'years-1940-1949',
        'years-1950-1959',
        'years-1960-1969',
        'years-1970-1979',
        'years-1980-1989',
        'years-1990-1999',
      ],
      load: function (e) {
        var t = this.periodsURL,
          o = this.periodsRange[e],
          i = this.periodsRange.length;
        (s.loading = !0),
          e < i &&
            ($('.periods__loader').addClass('periods__loader_show_yes'),
            $.ajax({
              method: 'get',
              url: t + o,
              success: function (e) {
                var t = $.parseHTML(e),
                  o = $(t),
                  i = o.find('.b-photo-group__photos');
                $('.b-page__main-photos').append(o), justifyImages(i, 2);
              },
              error: function (e) {
                console.log(e);
              },
              complete: function () {
                s.index++, (s.loading = !1), $('.periods__loader').removeClass('periods__loader_show_yes');
              },
            }));
      },
      init: function () {
        0 < $('.b-page__main-photos').length &&
          $(window).on('scroll touchmove', function () {
            s.loading ||
              ($(window).scrollTop() + window.innerHeight >= document.body.scrollHeight - 10 && s.load(s.index));
          });
      },
    };
    s.init();
  }),
  $(function () {
    var l,
      e = $('.popup-geo__map');
    function o() {
      var e,
        t,
        o,
        i = $('.popup-geo__map');
      if (i[0]) {
        var s = i.data('latitude'),
          n = i.data('longitude'),
          a = i.data('image'),
          r = new ymaps.GeoObjectCollection();
        (l = new ymaps.Map(
          i[0],
          {
            center: [s, n],
            zoom: 11,
            controls: [],
          },
          {
            minZoom: 2,
          },
        )),
          (e = a),
          (o = new ymaps.Placemark(
            [s, n],
            {},
            {
              iconLayout:
                ((t = e),
                ymaps.templateLayoutFactory.createClass(
                  "<div class='popup-geo__placemark'><div style='background-image: url(" +
                    t +
                    ")' class='popup-geo__placemark-image'></div></div>",
                )),
              iconShape: {
                type: 'Rectangle',
                coordinates: [
                  [-47, -54],
                  [47, 54],
                ],
              },
              iconOffset: [0, -54],
            },
          )),
          r.add(o),
          l.geoObjects.add(r);
      }
    }
    $(document).keyup(function (e) {
      var t = $('.popup-geo');
      27 === e.keyCode && ($(document).trigger('hidemap'), t.removeClass('popup-geo_show_yes'));
    }),
      $('body').on('click', function (e) {
        if ('YMAPS' !== $(e.target).prop('tagName')) {
          var t = $('.popup-geo');
          $(document).trigger('hidemap'), t.removeClass('popup-geo_show_yes');
        }
      }),
      $(document).on('hidemap', function () {
        l && l.state && l.destroy();
      }),
      $(document).on('click', '.b-photo__content-show-map', function (e) {
        e.stopPropagation();
        var t = $('.popup-geo');
        t.hasClass('popup-geo_show_yes')
          ? ($(document).trigger('hidemap'), t.removeClass('popup-geo_show_yes'))
          : (t.addClass('popup-geo_show_yes'), o());
      }),
      $(document).on('click', '.popup-geo__map', function (e) {
        e.stopPropagation();
      }),
      $('.b-photo').on('changephoto', function () {
        o();
      }),
      e[0] &&
        ymaps.ready(function () {
          o();
        });
  }),
  $(function () {
    var l = [],
      e = 0,
      c =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (e) {
          window.setTimeout(e, 1e3 / 60);
        },
      o = function (t) {
        t.element.addEventListener(
          'mouseenter',
          function () {
            var e;
            (e = t),
              clearInterval(e.interval),
              (e.interval = setInterval(function () {
                if (e.getSpeed() <= -0.84) return e.setSpeed(-0.84), void clearInterval(e.interval);
                e.setSpeed(e.getSpeed() - 0.1);
              }, 16.7));
          },
          !1,
        ),
          t.element.addEventListener(
            'mouseleave',
            function () {
              var e;
              (e = t),
                clearInterval(e.interval),
                (e.interval = setInterval(function () {
                  if (0 <= e.getSpeed()) return e.setSpeed(0), void clearInterval(e.interval);
                  e.setSpeed(e.getSpeed() + 0.1);
                }, 16.7));
            },
            !1,
          );
      },
      i = function (e) {
        var t = getComputedStyle(e, null),
          o = 0,
          i = 0,
          s = 0,
          n = 0,
          a = 0,
          r = function () {
            s < 0 && ((a = n += s), (e.style.backgroundPosition = -n + o + 'px ' + (a + i) + 'px')), c(r);
          };
        (t = t['background-position']),
          (o = t.split(' ')[0]),
          (i = t.split(' ')[1]),
          (o = parseInt(o, 10)),
          (i = parseInt(i, 10)),
          (n = 0),
          r(),
          l.push({
            element: e,
            setSpeed: function (e) {
              s = e;
            },
            getSpeed: function () {
              return s;
            },
            interval: !1,
          });
      },
      t = function () {
        var e = document.getElementsByClassName('bg-move');
        if (e && e.length) {
          var t;
          for (t = 0; t < e.length; t++) i(e[t]);
          for (t = 0; t < l.length; t++) o(l[t]);
        }
      };
    t(),
      $('.b-top').on('searchform', function () {
        (e = $.now()),
          setTimeout(function () {
            $.now() - e < 500 ||
              setTimeout(function () {
                (l = []), t();
              }, 1e3);
          }, 500);
      });
  }),
  (function (t) {
    t(document).ready(function () {
      var e = t('.welcome-screen__background');
      e.attr('src', e.data('background')),
        e.load(function () {
          t(this).css('opacity', 1);
        }),
        t('.js-close-welcome-popup, .welcome-screen__overlay').click(function () {
          var e = t('.welcome-screen');
          e.css('top', -document.body.scrollHeight + 'px'),
            setTimeout(function () {
              t('body').css('overflow', 'auto');
            }, 1e3),
            e.hide(),
            (document.ontouchmove = null);
        });
    });
  })(jQuery);
