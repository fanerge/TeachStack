// cloneDeep
//#region 
export function isComplexType(type) {
  return typeof type === 'object' && type !== null || typeof type === 'function';
};
export function cloneDeep(val, hash = new WeakMap()) {
  if (!isComplexType(val)) {
    return val;
  }
  // loop ref
  if (hash.has(val)) {
    return hash.get(val);
  }
  // date\regexp\function 需要特殊处理
  let constructor = val.constructor;
  let newVal;
  if (constructor === Date) {
    newVal = new Date(val);
  } else if (constructor === RegExp) {
    // regexp.lastIndex
    newVal = new RegExp(val.source, obj.flags);
  } else if (constructor === Function) {
    newVal = new Function(`return ${val.toString()}`);
  } else {
    newVal = new constructor();
  }
  // 设置原型（新对象可以使用其原型上的方法）
  Object.setPrototypeOf(newVal, Object.getPrototypeOf(val))
  hash.set(val, newVal);
  // Object.getOwnPropertyNames\Object.getOwnPropertySymbols
  Reflect.ownKeys(val).forEach((key) => {
    if (isComplexType(val[key])) {
      newVal[key] = cloneDeep(val[key], hash);
    } else {
      // newVal[key] = val[key];
      Object.defineProperty(newVal, key, Object.getOwnPropertyDescriptor(val, key));
    }
  });

  return newVal;
}
function cloneDeep2(data) {
  return new Promise((resolve, reject) => {
    // 不能有function
    let { port1, port2 } = new MessageChannel();
    port1.postMessage(data);
    port2.onmessage = function (e) {
      resolve(e.data);
    }
  });
}
// test
let obj1 = { name: '我是一个对象', id: 1 };
Object.setPrototypeOf(obj1, {
  getVal: function (val) {
    console.log(this);
  }
});
let obj = {
  num1: new Number(1),
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: obj1,
  obj2: obj1,
  arr: [0, 1, 2],
  [Symbol('1')]: 1,
  date: new Date(),
  regExp: /\d+/img,
  // func: function ss(a, b, c) {
  //   console.log(a + b + c)
  // },
  // func1: () => { }
};
Object.defineProperty(obj, 'innumerable', {
  enumerable: false, value: '不可枚举属性'
}
);
obj.loop = obj    // 设置loop成循环引用的属性
window.cloneDeep2 = cloneDeep2;
window.obj = obj;
// console.log(cloneDeep(obj));
//#endregion

// myCall
//#region 
Function.prototype.myCall = function (ctx, ...args) {
  let lists = [null, undefined];
  if (lists.includes(ctx)) {
    ctx = globalThis;
  }
  ctx = Object(ctx);
  let key = Symbol('func');
  ctx[key] = this;
  let res = ctx[key](...args);
  delete ctx[key];
  return res;
}

// test
let mycallObj = {
  name: 'yzf'
};
function myCallTest(age, address) {
  console.log(this.name + age + address)
}
// myCallTest.myCall(mycallObj, 12)
//#endregion

// myApply
//#region 
Function.prototype.myApply = function (ctx, args) {
  let lists = [null, undefined];
  if (lists.includes(ctx)) {
    ctx = globalThis;
  }
  ctx = Object(ctx);
  let key = Symbol('func');
  ctx[key] = this;
  let res = ctx[key](...args);
  delete ctx[key];
  return res;
}
// test
// myCallTest.myApply(mycallObj, [12, 'sichuan']);
//#endregion

// myBind
//#region 
Function.prototype.myBind = function (ctx, ...args1) {
  let lists = [null, undefined];
  if (lists.includes(ctx)) {
    ctx = globalThis;
  }
  ctx = Object(ctx);
  let that = this;
  function tempFn(...args2) {
    // new.target
    if (this instanceof tempFn) {
      return that.call(this, ...args1, ...args2);
    } else {
      return that.call(ctx, ...args1, ...args2);
    }
  }

  // new 调用
  tempFn.prototype = this.prototype;
  return tempFn;
}
// test
window.name = 'fanerge'
var obj11 = { name: 'inner' }
// myCallTest.myBind()(12, 'wanyuan')
// myCallTest.bind(null)(12, 'wanyuan')

// new 测试
// var p1 = Person.myBind()
// var p11 = new p1(1, 2);
// var p2 = Person.bind({})
// var p22 = new p2(1, 2)
// console.log(p11)
// console.log(p22)

//#endregion

// this 指向优先级
//#region
// 1.new 调用优先级最高
// 2.bind（硬绑定）和显示绑定
// 3.隐式绑定如，对象上的方法
// 4.默认绑定
//#endregion

// throttle
//#region 
function throttle(fn, ms, immediate) {
  let last = null;
  return function (...args) {
    let now = Date.now();
    // first
    if (last === null && immediate) {
      fn.apply(this, args);
      last = Date.now();
      return;
    }
    if (last === null) {
      last = Date.now();
      return;
    }

    if (now - last >= ms) {
      fn.apply(this, args);
      last = Date.now();
    }
  }
}
function proxyThrottle(fn, ms, immediate) {
  let last = null;
  let tempFn = new Proxy(fn, {
    apply(target, thisArg, args) {
      let now = Date.now();
      if (last === null && immediate) {
        target.apply(thisArg, args)
        last = Date.now();
        return;
      }
      if (last === null) {
        last = Date.now();
        return;
      }
      if (now - last >= ms) {
        target.apply(thisArg, args)
        last = Date.now();
      }
    }
  })
  return tempFn;
}
window.proxyThrottle = proxyThrottle;
// test
// $0.addEventListener('click', proxyThrottle(function () { console.log(this) }, 2000))
//#endregion

// debounce
//#region
function debounce(fn, ms, immediate) {
  let timerId = null;
  let tempFn = function (...args) {
    if (timerId === null && immediate) {
      fn.apply(this, args);
      // 产生一个无用的id
      timerId = setTimeout(() => { }, ms);
      return;
    }
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  }
  return tempFn;
}
function proxyDebounce(fn, ms, immediate) {
  let timerId = null;
  let tempFn = new Proxy(fn, {
    apply(target, thisArg, args) {
      if (timerId === null && immediate) {
        target.apply(thisArg, args);
        timerId = setTimeout(() => { })
        return;
      }
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        target.apply(thisArg, args);
      }, ms);
    }
  })

  return tempFn;
}
window.debounce = debounce
window.proxyDebounce = proxyDebounce
// test
// $0.addEventListener('mousemove', proxyDebounce(function () { console.log(this) }, 2000))
// var fn = debounce(function (e) { console.log(e) }, 2000)
// $0.addEventListener('click', fn)
//#endregion

// mockNew
//#region 
function mockNew(fn, ...args) {
  let obj = Object.create(fn.prototype)
  let res = fn.apply(obj, args);
  if (typeof res === 'object' && res !== null || typeof res === 'function') {
    return res;
  }
  return obj;
}
// test
function Person(name, age, sex) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log(this.name);
}
let mockN = mockNew(Person, 'yzf', '29')
// console.log(mockN.sayName());
//#endregion

// mockInstanceOf
//#region
function mockInstanceOf(left, right) {
  if (typeof left !== 'object' || left === null) {
    throw new Error('left 必须为对象');
  }
  if (typeof right !== 'function') {
    throw new Error('right 必须为函数');
  }

  let leftProto = Object.getPrototypeOf(left);
  while (leftProto) {
    if (leftProto === right.prototype) {
      return true;
    }
    leftProto = Object.getPrototypeOf(leftProto)
  }
  return false;
}
// console.log(mockInstanceOf(Object.create(null), Object));
//#endregion

// curry
//#region 
function curry(fn) {
  return function inner(...args1) {
    return fn.length <= args1.length ?
      fn.call(null, ...args1) :
      (...args2) => inner.call(null, ...args1, ...args2);
  }
}
function curryAdd(a, b, c) {
  return a + b + c;
}
// console.log(curry(curryAdd)(1)(2)(3));
//#endregion

// compose
//#region 
function compose(...fns) {
  return function (arg) {
    if (arg === undefined || arg === null) return
    if (fns.length > 0 && fns.every(fn => typeof fn === 'function')) {
      return fns.reduceRight((pre, fn) => {
        return fn(pre)
      }, arg);
    }
  }
}
var funs = compose((a) => a + 11, (b) => b * 2, (c) => c + 5)
// console.log(funs(10));
//#endregion

// pipe
//#region 
function pipe(...fns) {
  return function (arg) {
    return fns.reduce((res, fn) => {
      return fn(res);
    }, arg);
  }
}
var funs = pipe((a) => a + 11, (b) => b * 2, (c) => c + 5);
// console.log(funs(2));
//#endregion

// Scheduler
//#region 
class Scheduler {
  constructor(size) {
    this.size = size;
    this.queue = [];
    this.num = 0;
  }

  async add(genPromise) {
    if (this.num >= this.size) {
      // 到达阈值了
      await new Promise((resolve, reject) => {
        this.queue.push(resolve);
      })
    }
    this.num += 1;
    let res = await genPromise();
    this.num -= 1;
    if (this.queue.length > 0) {
      // resolve
      this.queue.shift()();
    }
    return res;
  }
}
// genPromiseTask
let scheduler = new Scheduler(2);
const timeout = (time) => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})
const addTask = (time, order) => {
  scheduler.add(() => timeout(time))
    .then(() => console.log(order))
}
// addTask(1000, '1')
// addTask(500, '2')
// addTask(300, '3')
// addTask(400, '4')
// addTask(100, '5')
// 2,3,4,1,5
//#endregion

// EventEmitter
//#region 
class EventEmitter {
  constructor(limit = 10) {
    this.limit = limit;
    this.map = new Map();
  }
  on(type, fn) {
    const { limit, map } = this;
    let list = [];
    if (map.has(type)) {
      list = map.get(type);
    } else {
      map.set(type, list)
    }
    if (list.length >= limit) {
      return
    }
    list.push(fn)
  }

  once(type, fn) {
    const { limit, map } = this;
    let self = this;
    let tempFun = function (...args) {
      fn.apply(this, args)
      self.off(type, tempFun);
    }
    this.on(type, tempFun);
  }

  emit(type, ...args) {
    const { limit, map } = this;
    let list = map.get(type) || [];
    list.forEach(function (fn) {
      fn.apply(this, args);
    });
  }
  off(type, fn) {
    const { map } = this;
    if (!map.has(type)) {
      return;
    }
    if (fn) {
      let list = map.get(type);
      list = list.filter(item => item !== fn);
      map.set(type, list);
    } else {
      map.delete(type)
    }
  }


}
//#endregion

// LRUCache
//#region 
class LRUCache {
  constructor(limit = 10) {
    this.limit = limit;
    this.cache = new Map();
  }
  set(key, value) {
    const { limit, cache } = this;
    if (cache.has(key)) {
      cache.delete(key);
    }
    if (cache.size >= limit) {
      // rm first
      let firstKey = cache.keys().next().value
      cache.delete(firstKey);
    }
    cache.set(key, value);
  }
  get(key) {
    const { cache } = this;
    if (!cache.has(key)) {
      return null;
    }
    let res = cache.get(key);
    // 保证添加顺序在最后面
    cache.delete(key);
    cache.set(key, res);
    return res;
  }
}
var lru = new LRUCache(3);
// console.log(lru.cache)
//#endregion

// flatArray
//#region
function flatArray(ary, res = [], n = 1) {
  ary.forEach(item => {
    if (Array.isArray(item) && n > 0) {
      flatArray(item, res, n - 1);
    } else {
      res.push(item);
    }
  });

  return res;
}
function flatArray1(ary) {
  for (let i = 0; i < ary.length; i++) {
    if (Array.isArray(ary[i])) {
      ary.splice(i, 1, ...ary[i]);
      i--;
    }
  }
  return ary;
}
var ary = [1, 2, [3, [4, 5, [6, [7, 8]]]], 9, [10, [11, 12]], [[[13]]]];
// console.log(flatArray(ary, [], 4));
// console.log(flatArray1(ary, [], 4));
//#endregion

// lensProp
//#region 
function lensProp(obj = {}, path = '') {
  if (typeof obj !== 'object' || obj === null) {
    obj = {}
  }
  let props = path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
  for (let i = 0; i < props.length; i++) {
    if (typeof obj[props[i]] === 'undefined') {
      return void 0;
    } else {
      // debugger
      if (typeof obj[props[i]] === 'object' && obj !== null) {
        obj = obj[props[i]]
      } else {
        return i === props.length - 1 ? obj[props[i]] : void 0;
      }
    }
  }

  return obj;
}
var obj6 = {
  name: 'yzf',
  children: [{
    name: 'yy',
    age: 1,
    children: [
      {
        name: 'yyy',
        age: 1,
        children: []
      }
    ]
  }, {
    name: 'yy1',
    age: 8,
    children: []
  }],
  other: {
    year: 29
  }
}
// console.log(lensProp(obj6, 'children.0.name'));
// console.log(lensProp(obj6, 'children[0].children[0].name[0]'));
//#endregion

// formatMoney
//#region 
function formatMoney(num) {
  let str = num.toString();
  // front 12345678 -> 1,235,678
  // len = 8
  let [front, end] = str.split('.')
  let frontLen = front.length;
  let frontStr = [...front].reduceRight((acc, item, index) => {
    let curIndx = frontLen - index;
    if (curIndx % 3 === 0 && index !== 0) {
      acc = `,${item}` + acc;
    } else {
      acc = `${item}` + acc;
    }
    return acc;
  }, '')

  return `${frontStr}${end ? `.${end}` : ''}`
}
// console.log(formatMoney('13234242343453245345.123123'));
//#endregion

// mergeSort
//#region 
function mergeSort(ary) {
  if (ary.length <= 1) {
    return ary;
  }
  let mid = Math.floor(ary.length / 2);
  let left = ary.slice(0, mid);
  let right = ary.slice(mid)

  return mergeSortHelper(mergeSort(left), mergeSort(right));
}
function mergeSortHelper(left, right) {
  let res = [];
  while (left.length > 0 && right.length > 0) {
    let left0 = left[0];
    let right0 = right[0];
    if (left0 <= right0) {
      res.push(left.shift());
    } else {
      res.push(right.shift());
    }
  }

  return res.concat(left).concat(right);
}
var list = [1, 3, 2, 9, 6, 5, 1, 0, -2, 10]
// console.log(mergeSort(list))
//#endregion

// quickSort
//#region 
function quickSort(ary) {
  if (ary.length <= 1) {
    return ary;
  }
  // 取均分点可以随机一点
  let midIndex = Math.floor(ary.length / 2);
  let midVal = ary[midIndex];
  let left = [];
  let right = [];
  ary.forEach((item, index) => {
    if (index === midIndex) return;
    if (item <= midVal) {
      left.push(item);
    } else {
      right.push(item);
    }
  });

  return [...quickSort(left), midVal, ...quickSort(right)]
}
// console.log(quickSort(list))
//#endregion

// renderTemplate
//#region
function renderTemplate(template, obj = {}) {
  return template.replace(/{{[A-Z|a-z|\d\s]+}}/g, function (match) {
    return obj[match.slice(2).slice(0, -2).trim()]
  })
}
let str = renderTemplate(`<p style="color: red;"><b>我是{{name }}</b>，年龄{{age}}</p>`, {
  name: "fanerge",
  age: 17,
});
// console.log(str)
//#endregion

// Promise
//#region 
let pending = 'pending';
let resolved = 'resolved';
let rejected = 'rejected';
function MyPromise(constructor) {
  let that = this;
  this.status = pending;
  this.value = undefined;
  this.reason = undefined;
  // 支持异步
  this.onFulfilled = [];//成功的回调
  this.onRejected = []; //失败的回调

  function resolve(value) {
    if (that.status === pending) {
      that.value = value;
      that.status = resolved;
      that.onFulfilled.forEach(fn => {
        fn(that.value)
      })
    }
  }
  function reject(reason) {
    if (that.status === pending) {
      that.reason = reason;
      that.status = rejected;
      that.onRejected.forEach(fn => {
        fn(that.reason)
      })
    }
  }
  // 捕获构造异常
  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
MyPromise.prototype.then = function (onResolved, onRejected) {
  if (this.status === resolved) {
    onResolved(this.value)
    return;
  }
  if (this.status === rejected) {
    onRejected(this.reason)
    return;
  }
  // 异步
  if (this.status === pending) {
    if (typeof onResolved === 'function') {
      this.onFulfilled.push(onResolved)
    }
    if (typeof onResolved === 'function') {
      this.onRejected.push(onRejected)
    }
  }
}

new MyPromise((resolve, reject) => {
  // resolve(1);
  setTimeout(() => {
    // reject(1)
  }, 1000);
}).then(res => console.log(res), (e) => { console.error(e) });
function genPromiseTask(num, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num);
    }, ms)
  });
}
// 异步串行1
function runPromiseByQueue(...funs) {
  funs.reduce((pre, cur, index) => {
    return pre.then((res) => {
      return cur(index);
    });
  }, Promise.resolve());
}
// runPromiseByQueue(genPromiseTask, genPromiseTask, genPromiseTask)
// 异步串行2
async function runPromiseByQueue1(...funs) {
  for (let i = 0; i < funs.length; i++) {
    await funs[i](i);
  }
}
// runPromiseByQueue1(genPromiseTask, genPromiseTask, genPromiseTask)

/**
 * Promise.all
 * 所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。
 * Promise.allSettled
 * allSettled 在所有给定的promise已被解析或被拒绝后解析，并且每个对象都描述每个promise的结果。
 * Promise.race
 * race 一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
 * Promise.any
 * any 只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和AggregateError类型的实例
 * Promise.prototype.finally
 */
//#endregion

// Promise.prototype.finally
//#region 
Promise.prototype.finally1 = function (callback) {
  return this.then((value) => {
    // resolved
    callback()
    return value;
  }, (reason) => {
    // rejected
    callback();
    throw reason
  });
}
// new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1000)
//   }, 1000);
// }).then(() => {
//   return '1111'
// }).finally1(() => {
//   // console.log('finally1');
//   setTimeout(() => {
//     console.log('finally1');
//   }, 500);
// }).then(() => {
//   console.log('done')
// })
//#endregion

// mySetInterVal
//#region 
class MySetInterVal {
  constructor(fn, a, b) {
    this.a = a;
    this.b = b;
    this.times = 0;
    this.timerId = null;
    this.fn = fn;
  }

  start() {
    const { a, b, times, fn } = this;
    this.timerId = setTimeout(() => {
      fn()
      console.log(a + times * b);
      this.times++;
      this.start();
    }, a + times * b);
  }
  stop() {
    const { timerId } = this;
    if (timerId) {
      clearTimeout(timerId);
      this.times = 0;
      this.timerId = null;
    }
  }
}
var setT = new MySetInterVal(() => { console.log('fn') }, 500, 1000)
// setT.start()
// setTimeout(() => {
//   setT.stop()
// }, 5000);
//#endregion

// 合并二维有序数组成一维有序数组，归并排序的思路
//#region
function mergeList(left, right) {
  let list = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] <= right[0]) {
      list.push(left.shift());
    } else {
      list.push(right.shift());
    }
  }
  return list.concat(left).concat(right);
}
function mergeArray(arr) {
  if (arr.length === 0) {
    return arr;
  }
  while (arr.length > 1) {
    let arr1 = arr.shift();
    let arr2 = arr.shift();
    let list = mergeList(arr1, arr2)
    arr.push(list)
  }

  return arr[0];
}
var arr1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 2, 3], [4, 5, 6]];
var arr2 = [[1, 4, 6], [7, 8, 10], [2, 6, 9], [3, 7, 13], [1, 5, 12]];
// console.log(mergeArray(arr2))
//#endregion

// 斐波那契数列
//#region 
//0, 1, 1, 2, 3, 5, 8, 13, 
function fib(n, cache = []) {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  if (cache[n]) {
    return cache[n]
  } else {
    cache[n] = fib(n - 1, cache) + fib(n - 2, cache)
  }
  return cache[n];
}
function fibdp(n) {
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n]
}
// console.log(fib(5), fibdp(5));
//#endregion

// 手写数组转树
//#region 
var input = [
  {
    id: 1,
    val: "学校",
    parentId: null,
  },
  {
    id: 2,
    val: "班级1",
    parentId: 1,
  },
  {
    id: 3,
    val: "班级2",
    parentId: 1,
  },
  {
    id: 4,
    val: "学生1",
    parentId: 2,
  },
  {
    id: 5,
    val: "学生2",
    parentId: 3,
  },
  {
    id: 6,
    val: "学生3",
    parentId: 3,
  },
];
function array2Tree(arr) {
  let obj = arr.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  let root;
  arr.forEach(item => {
    if (item.parentId === null) {
      root = item;
      return;
    }
    let parentItem = obj[item.parentId];
    if (!Array.isArray(parentItem.children)) {
      parentItem.children = []
    }
    parentItem.children.push(item)
  });

  return root;
}
var test = array2Tree(input)
// console.log(test);
//#endregion

// 手写用 ES6proxy 如何实现 arr[-1] 的访问
//#region 
function proxyArray(arr) {
  return new Proxy(arr, {
    get(target, index) {
      index = +index
      let len = target.length;
      if (index < 0) {
        index = len + index;
      }
      return target[index]
    }
  });
}
var list = [0, 1, 2];
// console.log(proxyArray(list)[-1])
//#endregion

// 实现一个函数，接受函数数组参数，并执行，如果有一个函数返回结果是 string，数组剩余函数不执行，否则一直执行，
// 如果执行结果没有异步的函数，那么整个函数就是同步的。
//#region 
// const validator = combineValidators([
//   () => undefined,
//   () =>
//     new Promise(resolve => {
//       setTimeout(() => {
//         resolve('');
//       });
//     }),
//   () => 'eeeee',
// ])
// error = await validator('aaa', {});

function combineValidators(funs) {
  let num = 0;
  let len = funs.length;
  return function inner(value, allValue) {
    if (num >= len - 1) {
      return;
    }

    let curFn = funs[num++];
    let res = curFn(value, allValue);
    if (typeof res === 'string') {
      return res;
    }
    if (res && typeof res.then === 'function') {
      res.then(val => {
        res = val;
        inner(value, allValue);
      });
    } else {
      inner(value, allValue);
    }
  }
}
// var validator = combineValidators([
//   () => undefined,
//   () =>
//     new Promise(resolve => {
//       setTimeout(() => {
//         resolve('');
//       });
//     }),
//   () => 'eeeee',
// ])
// var error = validator('aaa', {});
// console.log(error)
//#endregion

// 反转链表
//#region 
var reverseList = function (head) {
  // 哨兵节点
  let sentry = new ListNode();

  while (head) {
    let rest = head.next;
    let old = sentry.next;
    sentry.next = head;
    head.next = old;
    head = rest;
  }
  return sentry.next;
};
//#endregion

// 两个有序链表合并
//#region
var mergeTwoLists = function (l1, l2) {
  let sentry = new ListNode();
  let head = sentry;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      head.next = l1;
      l1 = l1.next;
    } else {
      head.next = l2;
      l2 = l2.next;
    }
    head = head.next;
  }
  if (l1) {
    head.next = l1;
  }
  if (l2) {
    head.next = l2;
  }

  return sentry.next;
};
//#endregion

// 两个链表的第一和公共节点
//#region 
var getIntersectionNode = function (headA, headB) {
  if (!headA && !headB) return null;
  let heada = headA;
  let headb = headB;
  while (heada !== headb) {
    heada = heada !== null ? heada.next : headB;
    headb = headb !== null ? headb.next : headA;
  }
  return heada;
};
//#endregion

// 链表是否有环
//#region 
var hasCycle = function (head) {
  if (head === null || head.next === null) return false;
  let slow = head;
  let fast = head.next;
  while (slow !== fast) {
    if (!fast || !fast.next) {
      return false;
    }
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
};
//#endregion

// 0.1+0.2 !== 0.3 IEEE756 64bit 表示数字
//#region 
/**
 * 符号位：决定正负，0为正，1为负(1位符号位)
 * 阶码：指数位则为阶码-1023，决定了数值的大小(11位指数位)
 * 尾数：有效数字，决定了精度(52位尾数位)
 * v = (-1^(符号位0/1 s)) * 1.xxxxx(尾数位 f) * 2^(指数位 e)
 * v: 浮点数具体值
 * s: 符号位，即正负号，0 为正，1 为负（共1位）
 * m: 有效数，也叫尾数，可以类比科学计数法前面的有效数字（共53位，52 + 1不用存储，固定），另外还有一个小数位 f, m = 1 + f
 * e: 指数位，即 2 的多少次方（共11位），指数位则为阶码-1023
 * 1.进制转换和对阶运算会发生精度丢失
 * why进制转换？计算机硬件决定，只能进行2进制运算
 * why对阶运算？两个进行运算的浮点数必须阶码对齐（指数位数相同），才能进行尾数加减运算
 */
//#endregion

// JSONP 解决远程调用本地回调函数跨域的问题
//#region 
// Server端
// var express=require('express');
// var app=express();

// app.get('/jsonp',function(req = {},res,err){
//   if(err) {
//     throw new Error('***');
//   }
//   if(!req?.query?.jsoncallback) {
//     throw new Error('***');
//   }
//     const jsoncallback = req.query.jsoncallback
//     var data=[{"name":'yzf'}];
//     var result = `${jsoncallback}(${JSON.stringify(data)})`  
//     res.end(result);
// })
// app.listen('8001',(e) => {console.log(e)})

// Client端:
// <script type="text/javascript" src="https:/***/jsonp?jsoncallback=callbackFunction"></script>
// function callbackFunction(result){
//     // todo
//     console.log(result)
// }
// $.getJSON("http://10.232.36.110:10011?callback=?",{success: function(e) {console.log(e)}})
function getJSON(url) {
  var script = document.createElement('script');
  script.crossOrigin
  //  Access-Control-Allow-Origin script.crossOrigin 允许通过 window.onerror 去捕获错误
  script.setAttribute('src', url);
  document.head.appendChild(script);
  // 在 callbackFunction 执行完后应该移除 script
}
//#endregion

// ajax/promise
//#region 
function ajax(options = {}) {
  let {
    url,
    method = 'get',
    data = null,
    timeout = 10000,
    withCredentials = false,
    asyncM = true
  } = options;
  method = method.toUpperCase();
  if (!url) {
    throw new Error('url');
  }

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, asyncM);
    xhr.onreadystatechange = () => {
      const { readyState, status, responseText } = xhr;
      if (readyState === 4) {
        if (status >= 200 && status < 300) {
          resolve(responseText);
        } else if (status >= 400) {
          reject(xhr);
        }
      }
    }
    // 设置 RequestHeader
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // 设置超时时间
    // xhr.timeout = timeout
    // 用来指定跨域 Access-Control 请求是否应当带有授权信息，如 cookie 或授权 header 头
    // xhr.withCredentials = withCredentials;
    // xhr.abort() 如果请求已被发出，则立刻中止请求
    // 获取 ResponseHeader
    // xhr.getResponseHeader()、xhr.getAllResponseHeaders()
    // 支持的事件：onabort、onerror、onload、ontimeout、loadend(onabort、onerror、onload)
    xhr.send(data);

  });
}
//#endregion

// 树的遍历

// 三数之和
// 找到所有出现两次的元素。你可以不用到任何额外空间并在O(n)时间复杂度内解决这个问题吗？(限时5分钟)
// ajax/promise
// fetch