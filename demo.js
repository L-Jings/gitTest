//防抖，避免用户频繁点击触发，例如实时搜索
function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay)
    }
};

//节流,函数只有在大于等于它的执行周期才会被调用，例如点击抢购
function throttel(fn, delay) {
    let timer = null;
    return (...args) => {
        if (timer) { return };
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, delays)
    }
}

//柯里化
function curry(fn, ...arg) {
    return function (...sub) {
        let newArr = [...arg, ...sub];
        if (newArr.length >= fn.length) {
            return fn(...newArr);
        } else {
            return curry(fn, ...newArr);
        }
    }
}

//继承 
// class Person {
//     constructor(name) {
//         this.name = name;
//     }
//     hello() {
//         console.log("hello")
//     }
// }

// class son extends Person {
//     constructor(name, age) {
//         super(name);
//         this.age = age;
//     }
// }

function Person(name) {
    this.name = name;
}
Person.prototype.hello = function () {
    console.log('HELLO');
}

function son(name, age) {
    Person.call(this, name);
    this.age = age;
}
son.prototype = Object.create(Person.prototype);
son.constructor = son;

//深拷贝
function clone(target, map = WeakMap()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);
        for (let key in target) {
            cloneTarget[key] = clone(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
}

//实现call、apply、bind
Function.prototype._call = function (ctx, ...arg) {
    ctx = ctx || window;
    let sym = Symbol("fn");
    ctx[sym] = this;
    let result = ctx[sym](...arg);
    delete ctx[sym];
    return result;
}

Function.prototype._apply = function (ctx, arg) {
    ctx = ctx || window;
    let sym = Symbol("fn");
    ctx[sym] = this;
    let result = ctx[sym](...arg);
    delete ctx[sym];
    return result;
}

Function.prototype._bind = function (ctx) {
    ctx = ctx || window;
    let sym = Symbol("fn");
    ctx[sym] = this;
    return function (...arg) {
        let result = ctx[sym](...arg);
        delete ctx[sym];
        return result;
    }
}

//实现instanceof
function _instanceof(leftValue, rightValue) {
    if (typeof leftValue !== 'object' || leftValue === null) {
        return false;
    }
    let leftProto = leftValue._proto_;
    let rightProto = rightValue.prototype;
    while (true) {
        if (leftProto === null) {
            return false;
        }
        if (leftProto === rightProto) {
            return true;
        }
        leftProto = leftProto._proto_;
    }
}

//用reduce实现map、filter
Array.prototype._map = function (callback) {
    if (typeof callback === 'function') {
        return this.reduce((pre, cur, index) => {
            pre.push(callback(cur, index));
            return pre;
        }, [])
    } else {
        return false;
    }
}

Array.prototype._filter = function (callback) {
    if (typeof callback === 'function') {
        return this.reduce((pre, cur, index) => {
            callback(cur, index) ? pre.push(cur) : null
            return pre;
        }, [])
    } else {
        return false;
    }
}
let sa = [1, 2, 3, [4, 5, [1, 2]]]
function _flat(arr) {
    if (Array.isArray(arr)) {
        return arr.reduce((pre, cur, index) => {
            return Array.isArray(cur) ? pre.concat(_flat(cur)) : pre.concat(cur);
        }, [])
    } else {
        return false;
    }
}
// console.log(_flat(sa));


//实现EventEmit
function EventEmit() {
    this._event = {};
}

EventEmit.prototype.on = function (eventName, callback) {
    if (!this._event) {
        this._event = {};
    }
    if (!this._event[eventName]) {
        this._event[eventName] = [callback];
    } else {
        this._event[eventName].push(callback);
    }
}

EventEmit.prototype.emit = function (eventName, ...arg) {
    if (!this._event) {
        this._event = {};
    }
    if (this._event[eventName]) {
        this._event[eventName].forEach(fn => fn(...arg));
    }
}

EventEmit.prototype.off = function (eventName, callback) {
    if (!this._event) {
        this._event = {};
    }
    if (this._event[eventName]) {
        this._event[eventName] = this._event[eventName].filter(fn => fn !== callback && fn.l !== callback);
    }
}

EventEmit.prototype.once = function (eventName, callback) {
    if (!this._event) {
        this._event = {};
    }
    const once = (...arg) => {
        callback(...arg);
        this.off(eventName, once);
    }
    once.l = callback;
    this.emit(eventName, once);
}

//用promise实现串行
let carr = [
    () => new Promise(resolve => setTimeout(() => {
        console.log("run", Date.now())
        resolve()
    }, 1000)),
    () => new Promise(resolve => setTimeout(() => {
        console.log("run2", Date.now())
        resolve()
    }, 1000)),
    () => new Promise(resolve => setTimeout(() => {
        console.log("run3", Date.now())
        resolve()
    }, 1000)),
];

function ctest(arr) {
    let p = Promise.resolve();
    arr.forEach(fn => {
        p = p.then(() => fn());
    })
}

//用promise实现并行
class Scheduler {
    constructor() {
        this.queue = [];
        this.maxCount = 2;
        this.curFn = 0;
    }
    add(promiseFn) {
        this.queue.push(promiseFn);
    }
    request() {
        if (!this.queue || !this.queue.length || this.curFn >= this.maxCount) {
            return
        }
        this.queue.shift()().then(() => {
            this.curFn--;
            this.request();
        })
    }
    taskStart() {
        for (let i = 0; i < this.maxCount; i++) {
            this.request();
        }
    }
}
let scheduler = new Scheduler();
const timer = time => new Promise(resolve => {setTimeout(resolve, time)});
const addTask = (time, order) => {
    scheduler.add(() => timer(time).then(() => console.log(order)));
}

// addTask(1000, '1');
// addTask(500, '2');
// addTask(300, '3');
// addTask(400, '4');

// scheduler.taskStart();