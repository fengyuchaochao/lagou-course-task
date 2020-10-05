var a = 10;
var obj = {
    a: 20,
    fn () {
        setTimeout(() => {
            console.log(this.a) //20
        })
        setTimeout(function () {
            console.log(this.a) // 10
        })
    }
}
obj.fn();

/**
 * 分析：结果是 20
 *
 * 首先fn函数被obj调用，所以fn函数的this指向obj，同时settimeout回调函数采用的是箭头函数，所以箭头函数内部的this和外部一样。
 *
 * 而如果传入的是非箭头函数，则函数内部的this指向window
 * */
