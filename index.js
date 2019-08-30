const dig = function (object) {
    if (!object) {
        return null;
    }

    let args = Array.prototype.slice.call(arguments, 1);
    if (typeof args[0] === 'string' && args[0].indexOf('.') !== -1) {
        args = args[0].split('.');
    }

    if (Array.isArray(args[0])) {
        args = args[0];
    }

    let target = object;
    for (let index = 0; index < args.length; index += 1) {
        const notation = args[index];

        if (notation.indexOf('=') !== -1) {
            const comparison = notation.split('=');
            const key = comparison[0];
            const value = comparison[1];
            target = target.find((t) => t[key] == value);
            if (!target) {
                return null;
            }
        } else if (Array.isArray(target)) {
            return target.map((t) => dig(t, args.slice(index)));
        } else {
            if (!target[notation]) {
                return null;
            }
            target = target[notation];
        }
    }
    return target;
};

module.exports = { dig };