# Symbol

## 基本使用

```
let s1 = Symbol();
let s2 = Symbol();
console.log(s1 === s2); //false

let s3 = Symbol('描述1');
console.log(s3); //Symbol(描述1)
console.log(s3.description); //描述1

let s4 = Symbol({});
console.log(s4); //Symbol([object Object])
console.log(s4.description); //[object Object]

let s5 = Symbol.for('a');
let s6 = Symbol.for('a');
console.log(s5 === s6); //true


let obj = {};
console.log(obj.toString()); //[object object]
//如果我们想重写toString方法的返回值呢？

let obj = {
    [Symbol.toStringTag]: 'my_object'
};
console.log(obj.toString()); //[object my_object]

```

## 应用场景

#### 场景1
虽然，平时我们一般对象的key一般不会包含重复的，但是假如有重复的，并且又是合理存在的，那这个时候如何区分这两个相同的key呢？就可以使用Symbol。
```
//例如有个同名的同学，如果再进一步区分呢？
let stu1 = Symbol('李四');
let stu2 = Symbol('李四');

let grade = {
    [stu1]: {address: 'xxx', age: 20},
    [stu2]: {address: 'yyy', age: 21}
};

console.log(grade[stu1]); //{address: "xxx", age: 20}
console.log(grade[stu2]); //{address: "yyy", age: 21}
```

#### 场景2

当Symbol作为对象的属性时，无法通过for...in， Object.keys()遍历到，我们可以利用这个特性，去声明一些私有属性。

```
let symbol = Symbol('私有属性');
class User {
    constructor (name) {
        this.name = name;
        this[symbol] = '私有属性值'
    }
}

let user = new User('kobe');

```
然后，我们使用for...in等方式遍历的时候，会发现遍历不到用symbol作为key的属性。
```
for (let key in user) {
    console.log(key); //只输出了name
}
console.log(Object.keys(user)); // ['name']
```
如果我们确实是想遍历用symbol创建的属性呢？依然是可以访问到。

```
//方法1:Object.getOwnPropertySymbols()
for (let key of Object.getOwnPropertySymbols(user)) {
    console.log(key);
}
//方法2:Reflect.ownKeys()
for (let key of Reflect.ownKeys(user)) {
    console.log(key);
}
```

#### 场景3

也可以用于消除魔术字符串，即被重复定义和使用的字符串
```
function getArea (shape) {
    let area = 0;
    switch (shape) {
        case 'Triangle':
            area = 1;
            break;
        case 'Circle':
            area = 2;
            break;
    }
    return area;
}

getArea('Triangle');
```

上面的代码中，字符串“Triangle”，在多个地方被调用，很显然，每次都直接写该字符串不太友好，这个时候，我们可能会想到定义一个公共的变量，在一个地方维护不就可以啦？

```
let shapeType = {
    triangle: 'Triangle',
    circle: 'Circle'
};

function getArea (shape) {
    let area = 0;
    switch (shape) {
        case shapeType.triangle:
            area = 1;
            break;
        case shapeType.circle:
            area = 2;
            break;
    }
    return area;
}

getArea(shapeType.triangle);
```
通过定义一个公共的变量，似乎已经解决了我们的问题啦，但是是否还可以优化呢？

我们发现，上面的字符串“Triangle”和“Circle”,其实我们已经不关心啦，因为我们的key已经约定好了，value不管值是什么，只要key确定了，就确定了当前是什么形状，那么这个时候，我们就可以使用Symbol()代替这些魔术字符串。

```
let shapeType = {
    triangle: Symbol(),
    circle: Symbol()
};

function getArea (shape) {
    let area = 0;
    switch (shape) {
        case shapeType.triangle:
            area = 1;
            break;
        case shapeType.circle:
            area = 2;
            break;
    }
    return area;
}

getArea(shapeType.triangle);
```
