// allKeysAndSymbols
function allKeysAndSymbols(object) {
    let props = [];

    if (object.__proto__) {
        props = [...props, ...allKeysAndSymbols(object.__proto__)];
    }

    return [...props, ...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];    
}

const properties = allKeysAndSymbols({});
console.log('allKeysAndSymbols', properties);


// in, который игнорирует свойства прототипа
const proto = { value: 42 };
const object = Object.create(proto);

Object.defineProperty(object, 'year', {
    value: 2020,
    writable: true,
    configurable: true,
    enumerable: false,
});

const symbol = Symbol('bazzinga');
object[symbol] = 42;

// без proxy
console.log('value' in object); // true
console.log('year' in object); // true
console.log(symbol in object); // true

const proxy = new Proxy(object, {
    has(target, prop) {
        return target.hasOwnProperty(prop);
    }
});

// // с proxy
console.log('value' in proxy) // false
console.log('year' in proxy); // true
console.log(symbol in proxy); // true


//asyncExecutor
function asyncExecutor(generator) {
    const iterator = generator();
    const execute = (prop) => {
        const result = iterator.next(prop);

        if (!result.done) {
            Promise.resolve(result.value).then(execute);
        }
    }

    execute();
}

// тесты
const ID = 42;
const delayMS = 1000;

function getId () {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ID);
        }, delayMS);
    });
}

function getDataById (id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            id === ID ? resolve('🍎') : reject('💥');
        }, delayMS);
    });
}

asyncExecutor(function* () {
    console.time("Time");

    const id = yield getId();
    console.log('id', id);
    const data = yield getDataById(id);
    console.log('Data', data);

    console.timeEnd("Time");
});