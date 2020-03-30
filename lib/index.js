"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() { }; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var opts = {
    seperator: '.',
    comma: ',',
    equal: '=',
    arrayMap: '*',
    pipe: '|'
};

var dig = function dig(object, structure) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : opts;

    if (!object || !structure) {
        return null;
    }

    if (_typeof(structure) === 'object') {
        if (Array.isArray(structure)) {
            return structure.map(function (struct) {
                return dig(object, struct);
            });
        }

        var keys = Object.keys(structure);
        var result = {};

        for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
            var key = _keys[_i];
            result[key] = dig(object, structure[key]);
        }

        return result;
    }

    var target = object;
    var args = structure.split(options.seperator);

    var _loop = function _loop(_index) {
        var notation = args[_index];

        if (notation.indexOf(options.pipe) !== -1) {
            var _keys2 = notation.split(options.pipe);

            var _result = null;

            var _iterator = _createForOfIteratorHelper(_keys2),
                _step;

            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var _key = _step.value;
                    _result = dig(target, _key);

                    if (_result) {
                        break;
                    }
                }
            } catch (err) {
                _iterator.e(err);
            } finally {
                _iterator.f();
            }

            target = _result;
        } else if (notation.indexOf(options.comma) !== -1) {
            var _keys3 = notation.split(options.comma);

            var _result2 = {};

            var _iterator2 = _createForOfIteratorHelper(_keys3),
                _step2;

            try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var _key2 = _step2.value;
                    _result2[_key2] = dig(target, _key2);
                }
            } catch (err) {
                _iterator2.e(err);
            } finally {
                _iterator2.f();
            }

            target = _result2;
        } else if (notation.indexOf(options.equal) !== -1) {
            var comparison = notation.split(options.equal);
            var _key3 = comparison[0];
            var value = comparison[1];
            target = target.find(function (t) {
                return _key3 ? t[_key3] == value : t == value;
            });
        } else if (notation === options.arrayMap) {
            _index += 1;
            target = target.map(function (t) {
                return dig(t, args.slice(_index)[0]);
            });
        } else {
            target = target[notation];
        }

        if (target == null || target == undefined) {
            index = _index;
            return {
                v: null
            };
        }

        index = _index;
    };

    for (var index = 0; index < args.length; index += 1) {
        var _ret = _loop(index);

        if (_typeof(_ret) === "object") return _ret.v;
    }

    return target;
};

module.exports = {
    dig: dig,
    setOptions: function setOptions(newOpts) {
        Object.assign(opts, newOpts);
    }
};