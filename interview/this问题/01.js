let length = 10;
function fn () {
    console.log(this.length);
}

let obj = {
    length: 5,
    method: function (fn) {
        fn();
        arguments[0]();
        fn.call(arguments);
    }
};

obj.method(fn, 1);
