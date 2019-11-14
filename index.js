let opts = {
    seperator: '.',
    comma: ',',
    equal: '=',
    arrayMap: '*',
    biggerThan: '>',
    smallerThan: '<',
};

const queryRegex = /(\w+)\(([^)]+)\)/;

const dig = function (object, structure, options = opts) {
    if (!object) {
        return null;
    }

    if (typeof structure === 'object') {

        if (Array.isArray(structure)) {
            return structure.map(
                (struct) => dig(object, struct)
            );
        }

        const keys = Object.keys(structure);
        const result = {};
        for (const key of keys) {
            result[key] = dig(object, structure[key]);
        }
        return result;
    }

    let target = object;
    let args = structure.split(options.seperator);
    for (let index = 0; index < args.length; index += 1) {
        const notation = args[index];

        if (result = queryRegex.exec(notation)) {
            const query = result[1];
            const field = result[2];
            switch (query) {
                case "SUM":
                    target = target.reduce(
                        (previous, current) => (
                            typeof previous === 'number' 
                            ? previous
                            : dig(previous, field)
                        ) + dig(current, field)
                    );
                    break;
            }
        }
        else if (notation.indexOf(options.biggerThan) !== -1) {
            const comparison = notation.split(options.biggerThan);
            const key = comparison[0];
            const value = parseInt(comparison[1]);
            if (Array.isArray(target)) {
                target = target.find((t) => key ? t[key] > value : t > value);
            } else {
                return target[key] > value ? target[key] : 0;
            }
        }
        else if (notation.indexOf(options.smallerThan) !== -1) {
            const comparison = notation.split(options.smallerThan);
            const key = comparison[0];
            const value = parseInt(comparison[1]);
            if (Array.isArray(target)) {
                target = target.find((t) => key ? t[key] < value : t < value);
            } else {
                return target[key] < value ? target[key] : 0;
            }
        }
        else if (notation.indexOf(options.comma) !== -1) {
            const keys = notation.split(options.comma);
            const result = {};
            for (const key of keys) {
                result[key] = dig(object, key);
            }
            target = result;
        }
        else if (notation.indexOf(options.equal) !== -1) {
            const comparison = notation.split(options.equal);
            const key = comparison[0];
            const value = comparison[1];
            target = target.find((t) => key ? t[key] == value : t == value);
        }
        else if (notation === options.arrayMap) {
            index += 1;
            target = target.map(
                (t) => dig(t, args.slice(index)[0])
            );
        }
        else {
            target = target[notation];
        }

        if (target == null || target == undefined) {
            return null;
        }
    }
    return target;
};

module.exports = {
    dig,
    setOptions: function (newOpts) {
        Object.assign(opts, newOpts);
    },
};