var input = document.getElementById("inp")
var btn = document.getElementById("btn");
//防抖
function ajax() {
  console.log("ajax 请求")
}
function debounce(fn,delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    },delay)
  }
}
// input.oninput = debounce(ajax,2000)

//节流
//加锁
function change() {
  console.log("change")
}
function throttel(fn,delay) {
  let timer;
  return (...args) => {
    if(timer) { return; }
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    },delay)
  }
}
btn.onclick = throttel(change,1000)
