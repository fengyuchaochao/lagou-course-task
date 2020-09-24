# Promise

Promise 其实就是异步任务的一个**状态管理器**，因为异步任务可能成功，也可能失败，它内部维护这pedding,fulfilled, rejected三个状态，并且状态只能由pendding变成fulfilled或者由pendding变成rejected，并且状态变化以后，无法再修改。


Promise的基本用法其实就是把异步任务放到promsie的回调函数里，用promise做一层封装，封装以后我们就可以把异步任务成功或者失败以后的操作放到then或者catch的回调函数里。

![image](http://note.youdao.com/yws/res/8977/9C6DAFB0B4BC4FFD86993609B6F953E1)

## 基本用法
```
new Promise((resolve, reject) => {
    resolve(1);
}).then((result) => {
    console.log("resolve:", result)
}, (err) => {
    console.log('reject:', err)
});

//输出结果为：resolve: 1
```
说明：只有resolve之后，then方法才会被执行.
```
new Promise((resolve, reject) => {
    reject(1);
}).then((result) => {
    console.log("resolve:", result)
}, (err) => {
    console.log('reject:', err)
});

//输出结果为：reject: 1
```
说明：reject之后，then方法的第二个回调函数或者catch函数会被调用。
```
new Promise((resolve, reject) => {
    resolve(1);
    reject(1);
}).then((result) => {
    console.log("resolve:", result)
}, (err) => {
    console.log('reject:', err)
});

//输出结果为：resolve: 1
```
说明：**promise，中文即约定的意思，也就是说当promise内部的状态由pedding变成fulfilled 或者 rejected 之后，就无法再改变**， 所以 先调用了resolve('1')，后面的reject('1')其实不会被执行。



## Promise链式调用

这里我们使用setTimeout模拟一个ajax请求，

```
//那我们想要实现的需求就是先发送请求1，请求1成功以后，再发送请求2，请求2成功再发送请求3. 

function ajax () {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 1000)
    })
}
ajax().then(() => {
    ajax().then(() => {
        ajax().then(() => {
            
        })
    })
})
```
刚开始如果不了解Promise的链式调用的话，会很容易写出上面这种代码，进而还会觉得Promise不也存在地狱回调的问题吗？是的，我就曾经这样怀疑过，但是，这其实是你自己没有真正理解Promsie的好处，它最大的好处就是：**Promise支持链式调用**。

我们来一步步看：

```
let promise = new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, 1000)
});

let promise2 = promise.then(() => {})

console.log(promise2 == promise ); // false
console.log(promise2);
```
我们在浏览器端打印出结果：

![image](http://note.youdao.com/yws/res/9005/39DB97A6C429457091B4F77769B8AA50)

这时，我就发现了，**promise调用then方法以后默认会返回一个全新promise对象，且状态默认是fulfilled状态， 这下，我们才明白了，Promise为什么支持链式调用，同时，除了then方法默认返回的promise对象外，我们也可以显示的在then方法的回调函数中返回一个自定义的promise对象。**

我们知道了这一点，来优化一版上面的代码：

```
function ajax () {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 1000)
    })
}
ajax().then(() => {
    return ajax();
}).then(() => {
    return ajax();
}).then(() => {
    
});
```
已上就是promise的链式调用啦，不过还有一个细节需要注意下：

```
let promise = new Promise((resolve) => {
    setTimeout(() => {
        resolve()
    }, 1000)
});

let promise2 = promise.then(() => {
    return 'hello'
}).then((result) => {
    console.log(result); //输出hello
})
```
最后，我们总结一下：

* Promise的then方法默认会返回一个全新的Promise对象，所以我们才可以去链式调用, 
* 后面的then方法其实就是会上一个then方法返回的Promise对象注册回调。
* 前面then方法中回调函数的返回值，会作为后面then方法的回调函数的参数。
* then方法的回调函数也可以显式的返回一个promise对象，

## Promise异常处理

以下是我们常见的两种异常处理的写法：
```
//写法1: 
new Promise((resolve, reject) => {
   reject()
}).then((result) => {
    //成功处理
}, (err) => {
    //异常处理
});

//写法2:
new Promise((resolve, reject) => {
    reject()
}).then((result) => {
    //成功处理
}).catch((err) => {
    //异常处理
});
```
可能这两种写法大家都知道，但是他们到底有什么区别呢？

其实通过前面的链式调用可以理解到，我们写法2是通过链式调用的方式调用了catch方法，那么也就意味着这个catch的回调函数其实就是上一个then方法返回的promise注册的回调函数，而并不是我们最开始创建的promise实例。而我们写法1，只是单纯的为顶层的promise注册的异常处理的回调函数。

那么为什么写法2的catch依然可以捕获到顶层promise的错误呢？**其实Promise链式调用过程中任何一个promise发生的异常都会向下传递，直至被捕获，可以理解为链式调用catch，其实是为整个promise链条注册的异常回调**，在实际开发过程中，更推荐写法2。

## Promise静态方法

* Promise.resolve()
* Promise.reject()
* Promise.race()
* Promise.all()

#### 1. Promise.resolve()与Promise.reject()

静态方法可以返回一个Promise实例
```
Promise.resolve('success').then((result) => {
    console.log(result)
});

Promise.reject('error').then((result) => {
    console.log(result)
}).catch((err) => {
    console.log(err);
});

```
我们来想一个典型的应用场景：

```
function fn (flag) {
    if (true) {
        console.log('通过啦');
    } else {
        console.log('没通过');
    }
}
```
那可以用Promise优化一下吗？
```
function fn (flag) {
    if (flag) {
        return Promise.resolve();
    } else {
        return Promise.reject();
    }
}

fn(false).then(() => {
    console.log('通过啦');
}).catch(() => {
    console.log('没通过');
});

```

之所以据这样一个例子，主要是想说明一下：**Promise其实并不仅仅是异步任务的状态管理器，对于同步任务，我们也可以直接调用Promise.resovle()和Promise.reject()去把一部分处理逻辑放到then或者catch的回调函数中, 只不过状态切换是瞬时的，只要调用了Promise.resolve()或者Promise.reject()，状态就对应的变成了fulfilled或者rejected，然后就执行了then()或者catch()函数。**

**本质上来说，Promise其实就是通过状态管理这样一个机制，把嵌套书写的代码，变成了链式的写法。**

#### 2. Promise.all()与Promise.race()

```
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('1成功');
        resolve('1');
    }, 1000)
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('2成功');
        resolve('2');
    }, 2000)
});

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('3成功');
        resolve('3');
    }, 3000)
});

//必须等到所有promise都完成，才会执行
Promise.all([p1, p2, p3]).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});

//只要有一个promise成功，就会执行
Promise.race([p1, p2, p3]).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
```
最后，我们说说Promise.all()与Promise.race()的应用场景：

* Promise.all():

例如：我们页面需要同时请求三个接口的数据，必须全部得到以后才可以渲染页面，这时，我们就可以使用Promise.all()

* Promise.race()：

例如：我们加载图片，2s内加载成功则显示，超过2s之后则显示超时。

```
function loadImg () {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = 'https://www.imooc.com/static/img/index/logo.png';
        img.onload = function () {
            resolve('图片加载成功')
        }
    })
}

function timeout () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('加载图片超时')
        }, 2000);
    })
}

Promise.race([loadImg(), timeout()]).then((result) => {
    console.log(result)
}).catch(err => {
    console.log(err);
});
```

说明：加载图片onload时间是一个异步任务，setTimeout也是一个异步任务，那么这两个异步任务我们同时都用promise封装，并且配合Promose.race，就可以实现，图片要么加载成功，要么就显示超时。

## 执行顺序问题

先来一个简单的：
```
console.log(1);
new Promise((resolve) => {
    console.log(2)
});
console.log(3);

//输出结果：1 2 3
```
此时，很多人会觉得结果是1 3 2，其实不是，因为**promise的回调函数本身其实还是同步执行的**，但为什么大家平时会觉得promise会产生一个异步任务呢？**其实是promise的then或者catch其实是异步执行的。**

我们借机看下面这个例子：

```
console.log(1);
setTimeout(() => {
    console.log(2)
}, 0);
new Promise((resolve) => {
    console.log(3)
    resolve();
}).then(() => {
    console.log(4);
}).then(() => {
    console.log(5);
});
console.log(6);

//输出结果是：1 3 6 4 5 2
```
分析上面这段代码，首先 1 3 5肯定是要被优先输出的，因为他们都是同步任务，剩下就是setTimeout产生的这个异步任务，和promise resolve之后产生的异步任务，谁会被优先执行呢？答案是promise，

再变化一下：
```
console.log(1);
setTimeout(() => {
    console.log(2)
}, 0);
new Promise((resolve) => {
    console.log(3);
    resolve();
}).then(() => {
    console.log(4);
}).then(() => {
    console.log(5);
});

new Promise((resolve) => {
    setTimeout(() => {
        console.log(7);
        resolve();
    }, 0)
}).then(() => {
    console.log(8);
});
console.log(6);

//输出结果：1 3 6 4 5 2 7 8
```

因为**promise resolve产生的异步任务是一个微任务，而setTimeout产生的异步任务是一个宏任务，微任务的执行要优先于宏任务。**


## 总结：Promise最大的特点就是通过链式调用的方式解决了回调地狱问题。
