# Generator 生成器

普通函数执行的时候，我们是无法暂停函数中的代码执行的，而生成器函数是可以的，

关于生成器函数，我们需要知道以下几点：

* 生成器作用的对象是函数，用来将普通函数变成生成器函数
* 生成器函数执行之后返回的是一个迭代器对象。
* 生成器函数无法直接调用执行，需要使用迭代器的next方法调用执行。生成器函数不能作为构造函数使用。
* yeild关键字只能在生成器函数内部使用，无法在其他地方使用，否则会报错

**案例1**
```
function* fn () {
    for (let i = 0; i < 5; i++) {
        yield i;
    }
}
let iterator = fn();
console.log(iterator.next()); //{value: 0, done: false}
console.log(iterator.next()); //{value: 1, done: false}
console.log(iterator.next()); //{value: 2, done: false}
console.log(iterator.next()); //{value: undefined, done: true}
```

**案例2**
```
function* fn2 (x) {
    let y = yield(x + 1);
    let z = yield(y + 1);
    yield z;
}
let iterator2 = fn2(1);
console.log(iterator2.next()); //{value: 2, done: false}
console.log(iterator2.next()); //{value: NaN, done: false}
console.log(iterator2.next()); //{value: undefined, done: false}
console.log(iterator2.next()); //{value: undefined, done: true}
```

**next的参数就是上一个yield执行的返回值**


# Iterator 迭代器

## 定义

**它是一种接口机制，为各种不同的数据结构提供统一的遍历机制**，

我们都知道数组可以使用for循环遍历，对象可以使用for...in遍历，还有set，map等都自身提供了遍历机制，但是还有很多其他不可遍历的数据结构，那么这个时候我们就可以使用Iterator，使其可以遍历。从而把这些不支持遍历的数据结构实现遍历。



## 自定义迭代器

```
function makeIterator (arr) {
    let indexNext = 0;
    return {
        next () {
            return indexNext < arr.length ? {
                value: arr[indexNext++],
                done: false
            } : {
                value: undefined,
                done: true
            }
        }
    }
}

let iterator = makeIterator([1, 2, 3]);
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

```
## for...of

可以使用for...of遍历的前提是该数据是一个可迭代的对象，如何判断数据是否可以使用for...of遍历呢？

答案是：**即具有Iterator接口的数据结构，都可以使用for...of进行遍历，即具有Symbol.iterator属性。**

例如，我们常见的数组
```
let arr = [1, 2, 3];
console.log(arr);

let it = arr[Symbol.iterator]();
console.log(it.next()); //{value: 1, done: false}
console.log(it.next()); //{value: 2, done: false}
console.log(it.next()); //{value: 3, done: false}
```
我们打印一下数组，发现其实它的原型对象中拥有[Symbol.iterator]属性，那么就说明数组是可以使用for...of遍历的。

![image](http://note.youdao.com/yws/res/7260/909406C88CBD4C428F2312DE5BC23A54)


类似的原生本身就具有Iterator接口的数据结构还有如下：

* Array
* Set
* Map
* String
* TypedArray
* arguments
* NodeList对象（即调用querySelectorAll返回的结果）

也就是说，以上这些数据结构都是可以采用for...of进行遍历的。


那如何让一个没有Iterator接口的数据结构可以使用for...of进行遍历呢？

例如：我们创建一个对象：
```
let obj = {
    name: 'kobe',
    age: 41
};
```
我们发现它自身是没有Symbol.iterator属性的。

![image](http://note.youdao.com/yws/res/7271/EFD39B7B56B546F29B1EA265EA1D8FDC)

当我们使用for...of进行遍历的时候，也会报错：
```
for (let key of obj) {
    console.log(key);
}
```
报错信息如下：

![image](http://note.youdao.com/yws/res/7274/A7FEF4F141BC40978EB718936C509B8A)

那么，接下来，我们要做的就是给obj对象实现一个Iterator接口，使其可以利用for...of进行遍历。

```
let obj = {
    name: 'kobe',
    age: 41,
};
obj[Symbol.iterator] = function () {
    let keys = Reflect.ownKeys(this);
    keys.pop();
    let value = undefined;
    return {
        next: () => {
            value = undefined;
            if (keys.length) {
                value = this[keys.shift()];
            }
            return {
                done: !value,
                value: value,
            };
        }
    };
};

for (let key of obj) {
    console.log(key);
}
//依次输出: kobe 41
```

以上访问，我们是自定义了一个函数，并且返回了一个包含next函数的对象，同时next函数返回的是一个{value: '', done: false/true} 的对象，从而实现for...of的遍历，


那有没有更简洁的方法呢？其实我们之前也知道啦，Generator函数调用以后返回就是一个迭代器对象，所以我们可以直接使用Generator函数简化一下，就不用我们自己去实现next方法啦。

```
let obj = {
    name: 'kobe',
    age: 41,
};
obj[Symbol.iterator] = function* () {
    let keys = Reflect.ownKeys(this);
    keys.pop();
    let value = undefined;
    while (true) {
        if (keys.length) {
            yield value = this[keys.shift()];
        } else {
            return false;
        }
    }
};

for (let key of obj) {
    console.log(key);
}
```

最后，我们强调一下generator与iterator的关系：

```
function* fn () {
    yield 1;
}
console.log(fn())

```
我们打印一下生成器函数调用以后返回的结果：

![image](http://note.youdao.com/yws/res/7299/6C30F50BA894421D9377FF86A6F663F7)

从图中也可以看到，**Generator对象的原型对象上是有Symbol.iterator属性的，所以可以使用for...of遍历的。**

## for...await...of

* 同步迭代：即要迭代的每一项都是同步的，for...of 是同步迭代
* 异步迭代：即要迭代的每一项都是异步的，for...await...of是异步迭代，

我们通过先看一下同步迭代：

```
let arr = [1, 2, 3];
for (let item of arr) {
   console.log(item); 
}
//依次同步输出：1 2 3
```

我们再看一下异步迭代：
```
function getPromise (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(time);
        }, time);
    })
}

let arr = [getPromise(1000), getPromise(2000), getPromise(3000)];

for (let item of arr) {
    console.log(item);
}

//如果我们依然使用for...of...遍历时，依然会同步执行

async function test () {
    for await (let item of arr) {
        console.log(item);
    }
}
test();

//异步依次输出：1000 2000 3000
```

