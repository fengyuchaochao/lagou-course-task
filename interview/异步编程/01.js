new Promise((resolve, reject) => {
    console.log('a');
    setTimeout(() => {
        console.log('b')
    }, 0);
    console.log('c')
    resolve();
    console.log('d')
}).then(() => {
    console.log('e');
    new Promise((resolve, reject) => {
        console.log('f');
        resolve();
        console.log('g');
    }).then(() => {
        setTimeout(() => {
            console.log('h');
        }, 0)
        console.log('i');
    }).then(() => {
        console.log('j')
    })
}).then(() => {
    console.log('k');
});

setTimeout(() => {
    console.log('l');
}, 0);

new Promise((resolve, reject) => {
    console.log('m');
    resolve();
}).then(() => {
    setTimeout(() => {
        new Promise((resolve, reject) => {
            console.log('n')
            resolve()
        }).then(() => {
            setTimeout(() => {
                console.log('o')
            }, 0)
        }).then(() => {
            console.log('p')
        })
    }, 0)
});

console.log('q');


// a c d m q e f g i k j b l n p h o
