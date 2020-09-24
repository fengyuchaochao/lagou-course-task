# 手写Promise

想要手写Promise的前提是一定要知道Promise怎么用。

## 第一步：核心逻辑实现

我们先来分析一下：

1. 首先Promise是个类，并且构造函数的参数是一个函数，该函数有两个函数参数：resolve和reject。
2. Promise内部会维护一个状态：status，默认为pending, 可以变为fulfilled，和rejected，并且状态变化以后不可更改。
3. resolve和reject都是Promise内部提供的函数，用于更改状态，同时也可以传入成功和失败对应的参数，所以我们在Promise内部也需要两个属性：result，error用于记录resolve和reject传入的参数，并且将这两个参数传入then方法的两个回调函数里。
4. then方法也是Promise实例的一个方法，并且接受一个回调函数，该回调函数有两个函数参数，successCallback,errorCallback，当状态变化时，分别执行相应的成功或者失败的回调函数。

```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise  {
    constructor (executor) {
        executor(this.resolve, this.reject);
    }
    status =  PENDING;
    result = undefined;
    error = undefined;
    resolve = (result) => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.result = result;
    };
    reject = (error) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.error = error;
    };
    then (successCallback, failCallback) {
        if (this.status === FULFILLED) {
            successCallback(this.result);
        }
        if (this.status === REJECTED) {
            failCallback(this.error);
        }
    }
}

```

## 第二步：加入异步逻辑

上面第一步只是处理了同步逻辑，如果我们引入异步逻辑，例如：

```
let promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功');
    }, 3000);
});
promise.then((result) => {
    console.log(result);
}, (error) => {
    console.log(error);
});
```
这个时候，我们就会发现结果并没有任何输出，为什么呢？因为当执行这段代码时，执行到then方法以后，此时状态依然是pending，而我们定义的then方法中并没有针对status为pending的处理逻辑，所以我们需要进一步优化代码，支持异步逻辑，

**整体思路：由于promise的回调方法是异步代码，当执行到then方法以后状态依然是pending，这个时候我们就需要判断状态，如果是pending,这个时候就需要把successCallback和failCallback临时存起来，只有存在来以后，我们才能在异步代码执行完成以后，在resolve或者reject中分别执行对应的successCallback和failCallback。**

具体实现如下：

```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise  {
    constructor (executor) {
        executor(this.resolve, this.reject);
    }
    status =  PENDING;
    result = undefined;
    error = undefined;
    //声明变量去存储成功和失败的回调函数
    successCallback = undefined;
    failCallback = undefined;
    resolve = (result) => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.result = result;
        //判断成功回调是否存在，如果存在，则调用
        this.successCallback && this.successCallback(this.result);
    };
    reject = (error) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.error = error;
        //判断失败回调是否存在，如果存在，则调用
        this.failCallback && this.failCallback(this.error);
    };
    then (successCallback, failCallback) {
        if (this.status === FULFILLED) {
            successCallback(this.result);
        }else if (this.status === REJECTED) {
            failCallback(this.error);
        } else {
            //主要用于处理异步逻辑，因为如果是异步代码，此时status依然是pending,这个时候我们只能把回调函数存起来，等到异步任务执行完成以后，在resolve或者reject函数中执行回调函数。
            this.successCallback = successCallback;
            this.failCallback = failCallback;
        }
    }
}

```

## 第三步：支持多次调用then方法

即多次调用then方法，就可能存在多个then的回调用函数，所以我们要把successCallback和failCallback变成一个数组。
```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise  {
    constructor (executor) {
        executor(this.resolve, this.reject);
    }
    status =  PENDING;
    result = undefined;
    error = undefined;
    successCallback = [];
    failCallback = [];
    resolve = (result) => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.result = result;
        while (this.successCallback.length) {this.successCallback.shift()(this.result);}
    };
    reject = (error) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.error = error;
        while (this.failCallback.length) {this.failCallback.shift()(this.error);}
    };
    then (successCallback, failCallback) {
        if (this.status === FULFILLED) {
            successCallback(this.result);
        }else if (this.status === REJECTED) {
            failCallback(this.error);
        } else {
            this.successCallback.push(successCallback);
            this.failCallback.push(failCallback);
        }
    }
}

```

## 第四步：支持then方法链式调用

支持then链式调用主要要做到以下几点：

1. then的回调函数默认返回的是一个新的promise对象
2. then的回调函数返回值可能是普通数据类型，也可能是一个promise，不管是哪种类型，都要用一个新的promise去包一层。

```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise  {
    constructor (executor) {
        executor(this.resolve, this.reject);
    }
    status =  PENDING;
    result = undefined;
    error = undefined;
    successCallback = [];
    failCallback = [];
    resolve = (result) => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.result = result;
        while (this.successCallback.length) {this.successCallback.shift()(this.result);}
    };
    reject = (error) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.error = error;
        while (this.failCallback.length) {this.failCallback.shift()(this.error);}
    };
    then (successCallback, failCallback) {
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                let x = successCallback(this.result);
                resolvePromise(x, resolve, reject);
            }else if (this.status === REJECTED) {
                failCallback(this.error);
            } else {
                this.successCallback.push(successCallback);
                this.failCallback.push(failCallback);
            }
        });
        return promise2;
    }
}

function resolvePromise (x, resolve, reject) {
    if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x);
    }
}

```

核心就是：resolvePromise函数，用来判断then方法的回调函数返回的是一个普通值，还是一个promise对象，然后分别做不同的处理。


## 第五步：错误捕获

主要是两个地方的抛出错误需要我们捕获：
1. 执行器：executor中抛出错误
2. then的两个回调函数中：successCallback和failCallback 抛出错误

```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise  {
    constructor (executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }
    status =  PENDING;
    result = undefined;
    error = undefined;
    successCallback = [];
    failCallback = [];
    resolve = (result) => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.result = result;
        while (this.successCallback.length) {this.successCallback.shift()();}
    };
    reject = (error) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.error = error;
        while (this.failCallback.length) {this.failCallback.shift()();}
    };
    then (successCallback, failCallback) {
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.result);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.error);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            } else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.result);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.error);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
}

function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle deleted for promise #<Promise>'));
    }
    if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x);
    }
}

```

## 第六步：实现Promise.all()


想要实现all方法需要知道以下几点：

1. Promise.all()返回的也是一个promise对象
2. 参数传入的是一个数组，返回的结果也是一个数组result, 传入的数组可能包含普通值，也可能是一个promise对象，普通值则直接push到结果数组result中，promise对象，则需要等到其执行完then方法以后，再把结果push到reulst中，最终返回的也是一个数组。
```
// 这里，只单独贴出all方法的实现。
class MyPromise {
    static all (arr) {
        let result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData (key, value) {
                result[key] = value;
                index++;
                //必须等到所有的promise全部执行完以后才可以resolve
                if (index === arr.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < arr.length; i++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    current.then((value) => {
                        addData(i, value);
                    }, (error) => {
                        reject(error);
                    })
                } else {
                    addData(i, current)
                }
            }
        });
    }
    //race方法也类似
    static race (arr) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    current.then((value) => {
                        resolve(value);
                    }, (error) => {
                        reject(error);
                    })
                } else {
                    resolve(current);
                }
            }
        });
    }
}
```

## 第七步：实现finally实例方法

首先要明白finally的基本用法：
1. 不管是resolve，还是reject， finally方法都会执行
2. finally方法返回的是一个promise对象
```
class MyPromise  {
    catch (failCallback) {
        return this.then(undefined, failCallback);
    }
    finally (callback) {
        return this.then((value) => {
            return MyPromise.resolve(callback()).then(() => value);
        }, (error) => {
            return MyPromise.reject(callback()).then(error =>  { throw error});
        })
    }
}
```


## 自己实现Promise完整版

```
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise  {
    constructor (executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }
    status =  PENDING;
    result = undefined;
    error = undefined;
    successCallback = [];
    failCallback = [];
    resolve = (result) => {
        if (this.status !== PENDING) return;
        this.status = FULFILLED;
        this.result = result;
        while (this.successCallback.length) {this.successCallback.shift()();}
    };
    reject = (error) => {
        if (this.status !== PENDING) return;
        this.status = REJECTED;
        this.error = error;
        while (this.failCallback.length) {this.failCallback.shift()();}
    };
    then (successCallback, failCallback) {
        successCallback = successCallback ? successCallback : result => result;
        failCallback = failCallback ? failCallback : error => {throw error};
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.result);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.error);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            } else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.result);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.error);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return promise2;
    }
    catch (failCallback) {
        return this.then(undefined, failCallback);
    }
    finally (callback) {
        return this.then((value) => {
            return MyPromise.resolve(callback()).then((value) => {return value;});
        }, (error) => {
            return MyPromise.reject(callback()).then(error =>  { throw error});
        })
    }
    static resolve (value) {
        if (value instanceof MyPromise) {
            return value;
        } else {
            return new MyPromise((resolve, reject) => {
                resolve(value);
            });
        }
    }
    static reject (error) {
        if (error instanceof MyPromise) {
            return error;
        } else {
            return new MyPromise((resolve, reject) => {
                resolve(error);
            });
        }
    }

    static all (arr) {
        let result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData (key, value) {
                result[key] = value;
                index++;
                if (index === arr.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < arr.length; i++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    current.then((value) => {
                        addData(i, value);
                    }, (error) => {
                        reject(error);
                    })
                } else {
                    addData(i, current)
                }
            }
        });
    }
    static race (arr) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                let current = arr[i];
                if (current instanceof MyPromise) {
                    current.then((value) => {
                        resolve(value);
                    }, (error) => {
                        reject(error);
                    })
                } else {
                    resolve(current);
                }
            }
        });
    }
}

function resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle deleted for promise #<Promise>'));
    }
    if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x);
    }
}

```
