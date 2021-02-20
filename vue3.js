function isObject(obj) {
    //判断是否为对象
    return obj !== null && !Array.isArray(obj) && typeof obj === 'object';
}

//观察对象
function observe(obj) {
    if (!isObject(obj)) {
        return;
    }
    Object.keys(obj).forEach(key => {
        let dev = new Dev();
        let internalValue = obj[key];
        //如果属性值还是对象，需要继续观察递归
        observe(internalValue);
        //观察
        Object.defineProperty(obj, key, {
            get() {
                dev.depend();
                return internalValue;
            },
            set(val) {
                //如果赋予新值是一个对象，需要进行观察
                observe(val);
                internalValue = val;
                dev.notify();
            }
        })
    })
}
var activeUpdate = null; //目前依赖
//收集依赖
function Dev() {
    this.subscribes = new Set(); //收集依赖，不重复
}
Dev.prototype.depend = function () {
    if (activeUpdate) {
        this.subscribes.add(activeUpdate);
    }
}
Dev.prototype.notify = function () {

    this.subscribes.forEach(fn => fn());
}

function autoRun(fn) {
    function updateWrapper() {
        activeUpdate = updateWrapper;
        fn();
        activeUpdate = null;
    }
    updateWrapper();
}