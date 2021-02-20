function Dep() {
    this.subscribes = new Set(); //一个元素不可重复的数组，用于记录依赖
}
Dep.prototype.depend = function () {
    if (acitveUpdate) {
        //将其记录到依赖数组里面
        this.subscribes.add(acitveUpdate);
    }
}
Dep.prototype.notify = function () {
    this.subscribes.forEach(fn => fn());
}
var acitveUpdate = null; //当前正在收集依赖的函数
function autorun(fn) {
    acitveUpdate = fn; //依赖函数
    fn();
    acitveUpdate = null; //清楚
}


// test
var dep = new Dep();
autorun(() => {
    dep.depend(); // 记录依赖
    console.log("run1");
});
// --> run1
autorun(() => {
    dep.depend(); // 记录依赖
    console.log("run2");
});
// --> run2
autorun(() => {
    console.log("run3");
});
// --> run3
dep.notify(); // --> run1 run2
