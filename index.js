const opts = {
    seperator: '.',
    comma: ',',
    equal: '=',
    arrayMap: '*',
    pipe: '|',
    invoke: '&',
};
const fmtr = {};

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
    for (let index = 0; index < args.length; index += 1) {
        const notation = args[index];

        if (notation.indexOf(options.pipe) !== -1) {
            const keys = notation.split(options.pipe);
            let result = null;
            for (const key of keys) {
                result = dig(target, key, options, formatter);
                if (result) {
                    break;
                }
            }
            target = result;
        } else if (notation.indexOf(options.comma) !== -1) {
            const keys = notation.split(options.comma);
            const result = {};
            for (const key of keys) {
                result[key] = dig(target, key, options, formatter);
            }
            target = result;
        } else if (notation.indexOf(options.equal) !== -1) {
            const comparison = notation.split(options.equal);
            const key = comparison[0];
            const value = comparison[1];
            target = target.find(
                (t) => key ? t[key] == value : t == value
            );
        } else if (notation === options.arrayMap) {
            index += 1;
            target = target.map(
                (t) => dig(t, args.slice(index)[0], options, formatter)
            );
        } else {

            if (notation.indexOf(options.invoke) !== -1) {
                const invokeList = notation.split(options.invoke);
                let result = dig(target, invokeList.shift(), options, formatter);
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
    }
    return target;
};

const output = {
    dig,
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