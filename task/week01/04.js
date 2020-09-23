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
