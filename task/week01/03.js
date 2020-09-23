const fp = require('lodash/fp');

class Container {
    static of (value) {
        return new Container(value);
    }
    constructor (value) {
        this._value = value;
    }
    map (fn) {
        return Container.of(fn(this._value));
    }
}

class Maybe {
    static of (value) {
        return new Maybe(value);
    }
    constructor (value) {
        this._value = value;
    }
    map (fn) {
        return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._value))
    }
    isNothing () {
        return this._value === null || this._value === undefined;
    }

}

//练习1
let maybe = Maybe.of([5, 6, 1]);
let ex1 = (value) => {
    return fp.map(item => item + 1, value);
};
console.log(maybe.map(ex1));

//练习2
let xs = Container.of([1, 2, 3, 4]);
let ex2 = (value) => {
    return fp.first(value);
};
console.log(xs.map(ex2));

//练习3
let safeProp = fp.curry(function (x, o) {
    return Maybe.of(o[x]);
});
let user = {
    id: 2,
    name: 'kobe'
};
let ex3 = (value) => {
    return fp.first(value);
};
console.log(safeProp('name')(user).map(ex3));


//练习4

