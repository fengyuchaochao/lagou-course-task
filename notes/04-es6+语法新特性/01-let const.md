# let/const

## let/var区别

* 不属于全局对象window
* 不允许重复声明
* 不存在变量提升
* 暂时性死区
* 块级作用域

以上是let的新特性，那么对应相反，var的特性如下：

* 使用var声明的变量，默认绑定到全局对象window
* 可以重复声明，后者会覆盖前者
* 存在变量提升
* 可以在声明前访问，不存在暂时性死区
* 没有块级作用域，只有全局和函数作用域


接下来，我们就结合实际代码看看这些特性：
#### 1. var声明的变量默认会绑定到全局对象window

首先，我们既不用var，也不用let，此时相当于在全局对象window上添加了一个属性，此时，我们也可以使用delete删除对象的指定属性，删除以后，无法再直接访问。
```
b = 2;
console.log(b) //2
console.log(window.b) //2
delete b;
console.log(window.b) //undefined
console.log(b) //报错 Uncaught ReferenceError: b is not defined
```

然后，我们用var声明一个变量，
```
var a = 1;
console.log(a) //1
console.log(window.a) //1
delete a;
console.log(a) //1
console.log(window.a) //1
```
此时，我们发现，

1. **使用var声明的变量，会默认绑定到全局对象window中**

这也是js设计之处最大的缺陷之一，所有使用var声明的全局变量都会和全局对象做一个绑定，带来的问题就是所有用var声明的全局变量全部保存到了全局对象window, 极大的污染了全局对象。当然这也是let出现的原因。

2. **delete只能删除指定对象的某个属性，无法删除全局变量**

没有使用var声明变量时，默认相当于在全局对象中添加了一个属性，此时是可以正常delete, 但是使用var声明的变量，虽然我们可以直接通过window访问，但是它内部其实只是和window做了一个绑定关系，该变量并不是window中的属性，自然也无法使用delete删除。

接下来，使用把上面的例子改成let看一下效果：

```
var a = 1;
console.log(a) //1
console.log(window.a) //undefined
delete a;
console.log(a) //1
console.log(window.a) //undefined
```
此时，我们可以得出结论：**使用let声明的变量，并不会绑定到全局对象windowz中，自然也不会污染到我们的全局对象window，自然也无法通过window. 访问**


#### 2. var可以重复声明变量，let会报错

```
var a = 1;
var a = 2;
console.log(a); //2

let b = 1;
let b = 2; 
console.log(b); 

//执行到let b = 2就会报错：Uncaught SyntaxError: Identifier 'b' has already been declared

```

#### 3. 声明提升与暂时性死区

使用var或者function声明的变量或者函数在编译的时候会被提升，使用let/const声明的变量，不会被提升，同时规定必须在声明之后此才可以使用，在声明之前使用会报错，即暂时性死区。
```
console.log(a); //undefined
var a = 1;

console.log(b); //报错：Uncaught ReferenceError: Cannot access 'b' before initialization
let b = 1;
```

#### 5. 块级作用域

在let/const出来之前，我们使用var来声明变量，此时只有全局作用域和函数作用域，没有块级作用域.

**案例1**
```
if (true) {
    var a = 1;
    let b = 2;
}
console.log(a); //undefined
console.log(b); //Uncaught ReferenceError: b is not defined

```
**案例2**

我们再来看一个典型的例子，for循环

```
for (var i = 0; i < 5; i++) {
    
}
console.log(i); //5
```
很显然，我们在for循环之外，依然能够访问到i，这样很不安全，也不符合我们的直觉，所以有了块级作用域以后，这种典型问题就可以很好的解决啦

```
for (let i = 0; i < 5; i++) {
    
}
console.log(i); //报错：Uncaught ReferenceError: i is not defined
```

这样，我们就无法在块级作用域外部访问它内部的变量了。

**案例3**

```
if (true) var a = 3;
```
以上代码是可以正常运行的，因为在es5中规定，如果只有一行代码的话，可以省略{}, 但是如果换成let呢？
```
if (true) let a - 3; 
```
此时会报错：
![image](http://note.youdao.com/yws/res/6339/7CD9B930A3D047E5BDE6703013B75EBA)

也就是说，在es6中，如果使用使用块级作用域，就必须使用大括号{}，即使是单行表达式，也不能省略，否则会报错。

**案例4**

我们来看一个典型的面试题：
```
for (var i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i)
    })
}
//输出：3 3 3
```
由于setTimeout是一个异步任务，不会立即执行，所以等到for循环结束以后，才执行setTimeout回调函数，此时i已经是3，

那么，如何依次输出 0 1 2 呢？**采用闭包** 即创建一个立即执行函数，
```
for (var i = 0; i < 3; i++) {
    (function (index) {
        setTimeout(function () {
            console.log(index)
        })
    })(i);
}

//输出 0 1 2
```
那有没有更便捷的方式呢？**采用let声明变量即可**
```
for (let i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i)
    })
}
```
我们通过babel将上面这段代码转成es5代码，发现其实本质上还是利用了闭包的思路。

![image](http://note.youdao.com/yws/res/6363/CB3E92B30E564AC0BACAD4759C9E3235)

你也可以使用<a href="https://www.babeljs.cn/repl">babel在线调试工具</a> 尝试一下哦。




# const

使用const主要是用来声明一个常量，这也是它与let声明的唯一区别，因此，const声明也会拥有以下特性：

* 不属于全局对象window
* 不允许重复声明
* 不存在变量提升
* 暂时性死区
* 块级作用域

除此之外，它最大的特性的就是：**不能被修改**

先来一个简单例子：
```
const a = 1;
a = 2;
```
此时代码会报错：
![image](http://note.youdao.com/yws/res/6375/393DB243536A43B1B06ECBFFB0EFD7F4)

那假如用const声明一个引用类型的值呢？
```
const obj = {
    name: 'kobe',
    age: 41
};
obj.age = 42;
console.log(obj.age) //42
```
此时，我们发现上面的代码并没有报错，而且age属性被修改成功，这个时候，大家可能产生疑问了？const不是声明一个常量吗？怎么可以修改成功？ 原来，**const声明的常量，原来是只针对于保存在栈内存中的数据，如果是一般类型数据，本身值就是存储在栈内存中，所以就直接表现为无法被修改，如果是引用类型数据，其实引用是存放在栈内存中，具体的值是存放在堆内存中，所以就表现为该引用类型的引用或者指针无法修改，但是引用类型的数据本身存放在堆内存中，是也可以修改的**

我们看下面这段代码：
```
const obj = {
    name: 'kobe',
    age: 41
};
obj = {};
console.log(obj);

//很显然，此时会报错，因为直接把引用类型数据的指针改变啦。
```

那针对这些引用类型数据，如果我们确实不想让其修改，难道就没有办法了吗？当然不是，es6内置的Object.freeze()方法可以冻结指定对象，来实现我们想要的效果。

```
const obj = {
    name: 'kobe',
    age: 41
};
Object.freeze(obj)
console.log(obj.age) //41
```
这个时候，我们发现年龄并没有修改成功，依然是41，这就是**Object.freeze()的作用: 用来浅冻结指定对象**.

注意，我们说的是**浅**冻结哦，啥是浅冻结呢？类似于浅拷贝，深拷贝即可。
```
const obj = {
    name: 'kobe',
    age: 41,
    hobby: {
        name: 'basketball',
    }
};
Object.freeze(obj)
obj.hobby.name = 'football'
console.log(obj.hobby.name);  //football

```
这时，我们就发现了，确实只能冻结第一层属性，嵌套的引用类型数据无法冻结，如果想冻结，我们只能遍历属性，依次执行Object.freeze()
```
const obj = {
    name: 'kobe',
    age: 41,
    hobby: {
        name: 'basketball',
    }
};
Object.freeze(obj)
Object.freeze(obj.hobby)
obj.hobby.name = 'football'
console.log(obj.hobby.name);  //basketball

```

拓展：es5可以使用什么方法声明一个常量呢？答案是defineProperty

```
Object.defineProperty(window, 'name', {
    value: 'kobe',
    writable: false
});

window.name = 'james';
console.log(window.name) //kobe

```
即定义writable属性为false即可，通过这种方式代码不会报错，但是实际其实是没有修改成功的。
