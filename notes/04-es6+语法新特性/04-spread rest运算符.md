
## 定义

* spread运算符：即拓展运算符，把数组或者类数组的数据转成用逗号隔开的值。
* rest运算符：即剩余运算符，把逗号隔开的值转成一个数组。

这里注意一点：**spread运算符和rest运算符都是用...来表示，...和数组搭配就是拓展运算符，...和逗号隔开的值搭配就是rest运算符**
```
let arr = [1, 2, 3];
console.log(...arr);

function fn (...args) {
    console.log(args); //[1, 2, 3]
}
fn(1, 2, 3)
```

## 数组常用场景

#### 1. 函数参数
```
//拓展运算符
function fn (a, b, c) {
    console.log(a, b, c); // 1 2 3
}
let arr = [1, 2, 3];
fn(...arr);

//rest运算符
function fn(...args) {
    console.log(args); //[1， 2， 3]
}
fn(1, 2, 3)


```
#### 2. 合并数组
```
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
//es5解法
Array.prototype.push.apply(arr1, arr2);

//es6解法
arr1.push(...arr2);
```
#### 3. 类数组转数组

例如：字符串转数组
```
let name = 'kobe';

//es5解法
let arr = name.split(''); //['k', 'o', 'b', 'e']

//es6解法
let arr = [...name]; //['k', 'o', 'b', 'e']
```

## 对象常见场景

在es10中提出spread/rest运算符不仅支持在数组，也可以支持对象。

#### 1. 对象克隆
```
let obj = {
    name: 'kobe',
    age: 41
};

let obj2 = {...obj};
console.log(obj2); //{name: "kobe", age: 41}
obj.age = 42;
console.log(obj2); //{name: "kobe", age: 41}
```
#### 2. 对象合并
```
let obj = {
    name: 'kobe',
    age: 41
};

let obj2 = {
    skill: 'basketball'
};

let obj3 = {...obj, ...obj2};
console.log(obj3); //name: "kobe", age: 41, skill: "basketball"}
```
#### 3. 对象结构

```
let obj = {
    name: 'kobe',
    age: 41,
    skill: 'basketball'
};

let {name, ...rest} = obj;
console.log(name); //kobe
console.log(rest); //{age: 41, skill: 'basketball'}
```

**总结：speard/rest运算符不管是针对数组，还是对象，最常用的应用场景就是数组的解构，对象的解构，同时在函数传参，取参的时候，也会用到。**
