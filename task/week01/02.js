const fp = require('lodash/fp');

const cars = [
    {
        name: 'a',
        horsepower: 160,
        dollar_value: 10000,
        is_stock: true
    },
    {
        name: 'b',
        horsepower: 260,
        dollar_value: 20000,
        is_stock: false
    },
    {
        name: 'c',
        horsepower: 360,
        dollar_value: 30000,
        is_stock: false
    },
    {
        name: 'd',
        horsepower: 460,
        dollar_value: 40000,
        is_stock: true
    },
    {
        name: 'e',
        horsepower: 560,
        dollar_value: 50000,
        is_stock: false
    }
];


//练习1
let isLastInStock = fp.flowRight(fp.prop('is_stock'), fp.last);
console.log(isLastInStock(cars));

//练习2
let getFirstName = fp.flowRight(fp.prop('name'), fp.first);
console.log(getFirstName(cars));

//练习3
let arr = [1, 2, 3, 4];
let _average = function (arr) {
    return fp.reduce(fp.add, 0, arr) / arr.length;
};
console.log(_average(arr));


let averageDollarValue = function (cars) {
    let fn = fp.flowRight(_average, fp.map(fp.prop('dollar_value')));
    return fn(cars);
};
console.log(averageDollarValue(cars));

//练习4
let _underscore = fp.replace(/\s+/g, '_');
let santizeNames = fp.flowRight(fp.map(fp.flowRight(fp.toLower, _underscore)));
console.log(santizeNames(['Hello World']));


