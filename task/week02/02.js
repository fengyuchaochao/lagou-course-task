var tmp = 123;

if (true) {
    console.log(tmp);
    let tmp;
}


/**
 *
 * 代码会报错，原因是就是 用let/const声明的变量不会变量提升，也无法在声明前访问他们，俗称暂时性死区。
 *
 *
 * */
