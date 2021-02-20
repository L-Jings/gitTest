// test
var state = {
    name: "monica",
    addr: {
        province: "黑龙江",
        city: "哈尔滨",
    },
};

/**
 * 判断是否是对象
 * @param {*} obj 
 */
function isObject(obj) {
    return obj !== null && !Array.isArray(obj) && typeof obj === 'object';
}

function observe(obj) {
    if(!isObject(obj)) {
        return;
    }
    Object.keys(obj).forEach(key => {
        let internalValue = obj[key];
        observe(internalValue);
        Object.defineProperty(obj,key,{
            get() {
                return internalValue;
            },
            set(newValue) {
                observe(newValue);
                internalValue = newValue;
            }
        })
    })
}

  observe(state);

state.name; // --> get name: monica
state.name = "莫妮卡"; // --> set name: 莫妮卡
state.addr.province = "四川"; // --> set province: 四川
state.addr.city; // --> get city: 哈尔滨