// 模拟 instanceOf
// b instanceOf B 表示 对象 b 的原型链上是否存在构造函数 B 的 protorype 属性
export function instance_of(L: Object, R: any){
  let protoChain = Object.getPrototypeOf(L);
  const Lprototype = R.prototype;
  // 最坏情况递归查到Object.prototype === null
  while(protoChain) {
      // 两个对象指向同一个内存地址，则为同一个对象
      if(protoChain === Lprototype) {
        return true;
      }
      protoChain = Object.getPrototypeOf(protoChain);
  }
  // 找到终点还没找到，那就没有了呗
  return false;
}

// 自定义call
export function myCall() {
  let [thisArg, ...args] = Array.from(arguments);
  if (!thisArg) {
      //context 为 null 或者是 undefined
      thisArg = typeof window === 'undefined' ? global : window;
  }
  // this 的指向的是当前函数 func (func.call)
  // 为thisArg对象添加func方法，func方法又指向myCall，所以在func中this指向thisArg
  thisArg.func = this;
  // 执行函数
  let result = thisArg.func(...args);
  // let result = eval('thisArg.func(...args)');
  // thisArg 上并没有 func 属性，因此需要移除
  delete thisArg.func; 
  return result;
}

// 自定义apply
export function myApply() {
  // 第一个参数为this对象，第二个参数为数组（与myCall唯一的区别就在第二个参数是数组）
  let [thisArg, args] = Array.from(arguments);
  if (!thisArg) {
      //context 为 null 或者是 undefined
      thisArg = typeof window === 'undefined' ? global : window;
  }
  // this 的指向的是当前函数 func (func.call)
  thisArg.func = this;
  // 执行函数
  let result = thisArg.func(...args);
  // let result = eval('thisArg.func(...args)');
  // thisArg 上并没有 func 属性，因此需要移除
  delete thisArg.func; 
  return result;
}

// 自定义bind
export function myBind() {
  let [thisArg, ...args] = [...arguments];
  if (!thisArg) {
      //context 为 null 或者是 undefined
      thisArg = typeof window === 'undefined' ? global : window;
      // thisArg = globalThis;
  }
  let that = this;

  return function(...rest: any[]) {
      thisArg.func = that;

      let result = thisArg.func(...args, ...rest);
      // thisArg原本没有func方法
      delete thisArg.func;
      return result;
  }
}

// 模拟 new（new 的作用，1.实例化对象2.实现继承）
// 如果构造函数return为object，则返回该object
// 如果构造函数return 基本类型 包括 null，则返回this对象
/**
 * 1.它创建一个空对象
 * 2.它会被指向[[prototype]]链接
 * 3.它使this指向新建的对象
 * 4.通过new创建的每个对象将[[prototype]]连接到函数的protorype对象上
 * 5.返回对象（如果没有显示返回，则返回this所指的对象）
 */
export function objectFactory(...args: any[]) {
  const [functionName, ...rest] = args;
  // 继承原型属性(obj为对象)
  const obj = Object.create(functionName.prototype);
  // 继承构造属性
  const ret = functionName.apply(obj, rest);
  // 对构造函数返回值兼容处理
  return typeof ret === 'object' && ret !== null ? ret : obj;
  // const obj = new Object();
  // const [functionName, ...rest] = arguments;
  // const Constructor = functionName;
  // Object.setPrototypeOf(obj, Constructor.prototype);
  // const ret = Constructor.apply(obj, rest);
  // return typeof ret === 'object' ? ret : obj;
}

// 模拟 Object.create
export function objectCreate(proto: Object, propertiesObject?: PropertyDescriptorMap) {

  // function F() {}
  // F.prototype = proto;
  // let f = new F();
  let f = {};
  Object.setPrototypeOf(f, proto);
  if(propertiesObject) {
    f = Object.defineProperties(f, propertiesObject);
  }
  
  return f;
}









