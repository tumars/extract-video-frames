export function delay(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

export function once(func) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function')
    }
    let n = 1;
    let result;
    return function(...args) {
        if (n-- > 0) {
            result = func.apply(this, args);
        }

        return result;   
    }
}