const pick = (object, keys) =>
    keys.reduce((result, key) => {
        if (object[key] !== undefined) {
            result[key] = object[key];
        }

        return result;
    }, {});

module.exports = pick;
