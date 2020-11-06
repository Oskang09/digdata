/*!
 * digdata <https://github.com/Oskang09/digdata>
 *
 * Copyright (c) 2020, Oskang09.
 * Released under the MIT License.
 * 
 * Version 1.1.1
 */

// Reserved internal key to disable cursor tracking
const _disableTrackKey = "_disableTracker";

// Default digdata options object
const opts = {
    cursor: null,

    seperator: '.',
    comma: ',',
    equal: '=',
    arrayMap: '*',
    pipe: '|',
    invoke: '&',
};

// Default digdata formatter object
const fmtr = {};

// Instantiate cursor with cached cursor & custom options.
const cursor = function (cached = {}, options = opts) {
    return { ...options, cursor: cached };
};

// Internal method withOptions pass some options for running dig
const withOptions = function (current, disableTracker) {
    const options = Object.assign({}, current);
    if (disableTracker) {
        Object.assign(options, { [_disableTrackKey]: true });
    }
    return options;
};

// Digdata from complex object with customOptions & customFormatter
const dig = function (object, structure, options = opts, formatter = fmtr) {
    if (!object || !structure) {
        return null;
    }

    if (typeof structure === 'object') {
        if (Array.isArray(structure)) {
            return structure.map(
                (struct) => dig(object, struct, options, formatter)
            );
        }
        const keys = Object.keys(structure);
        const result = {};
        for (const key of keys) {
            result[key] = dig(object, structure[key], options, formatter);
        }
        return result;
    }

    let target = object;
    let args = structure.split(options.seperator);
    if (options.cursor) {
        const preArgs = [...args];
        const postArgs = preArgs.pop();
        const cache = options.cursor[preArgs.join(options.seperator)];
        if (cache) {
            const cacheOptions = withOptions(options, true);
            const result = dig(cache, postArgs, cacheOptions, formatter);
            options.cursor[[...preArgs, postArgs].join(options.seperator)] = result;
            return result;
        }
    }

    let paths = [];
    for (let index = 0; index < args.length; index += 1) {
        const notation = args[index];
        paths.push(notation);

        if (notation.indexOf(options.pipe) !== -1) {
            let result = null;
            const keys = notation.split(options.pipe);
            const cacheOptions = withOptions(options, true);
            for (const key of keys) {
                result = dig(target, key, cacheOptions, formatter);
                if (result) {
                    break;
                }
            }
            target = result;
        } else if (notation.indexOf(options.comma) !== -1) {
            const keys = notation.split(options.comma);
            const result = {};
            const cacheOptions = withOptions(options, true);
            for (const key of keys) {
                result[key] = dig(target, key, cacheOptions, formatter);
            }
            target = result;
        } else if (notation.indexOf(options.equal) !== -1) {
            const comparison = notation.split(options.equal);
            const key = comparison[0];
            const value = comparison[1];
            target = target.find((t) => key ? t[key] == value : t == value);
        } else if (notation === options.arrayMap) {
            index += 1;
            const cacheOptions = withOptions(options, true);
            const next = args.slice(index)[0];
            if (options.cursor) {
                options.cursor[paths.join(options.seperator)] = target;
                paths.push(next);
            }
            target = target.map((t) => dig(t, next, cacheOptions, formatter));
        } else {
            if (notation.indexOf(options.invoke) !== -1) {
                const invokeList = notation.split(options.invoke);
                const cacheOptions = withOptions(options, true);
                let result = dig(target, invokeList.shift(), cacheOptions, formatter);
                for (const invoke of invokeList) {
                    if (typeof formatter[invoke] === 'function') {
                        result = formatter[invoke](result, object);
                    }
                }
                target = result;
            } else {
                target = target[notation];
            }
        }

        if (target == null || target == undefined) {
            return null;
        }

        if (options.cursor && !options[_disableTrackKey]) {
            options.cursor[paths.join(options.seperator)] = target;
        }
    }

    return target;
};

const output = {
    dig,
    cursor,
    _withOptions: withOptions,
    _disableTrackKey: _disableTrackKey,
    setFormatter: function (newFormatter) {
        Object.assign(fmtr, newFormatter);
    },
    setOptions: function (newOpts) {
        Object.assign(opts, newOpts);
    },
};

if (typeof window !== 'undefined') {
    Object.assign(window, output);
}

if (typeof process !== 'undefined') {
    module.exports = output;
}