# async await

它其实就是generate函数的语法糖而已，它最大的作用其实是把一些异步代码用同步的写法写出来而已。

注意：async/await是es2017出来的新特性，不是es6.

## 基础知识

```
function timeout () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 3000);
    })
}

async function fn () {
    let result = await timeout();
    console.log(result)
}
fn();
```
假如，我们把resolve改成reject呢？

```
function timeout () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1);
        }, 3000);
    })
}

async function fn () {
    let result = await timeout();
    console.log(result)
}
fn();
```

此时，我们发现什么都没有打印出来，为什么呢？**其实是由于await后面的代码要想执行，前提必须是他后面的promise必须是fulfilled状态，如果是reject状态，后面的代码将不会被执行**，那此时如果想捕获错误呢？

```
function timeout () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(1);
        }, 3000);
    })
}

async function fn () {
    let result = await timeout();
    return result;
}

fn().then((result) => {
    console.log('success', result);
}).catch((error) => {
    console.log('error', error)
});

//此时会打印出:  error 1
```

