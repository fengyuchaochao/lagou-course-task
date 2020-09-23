function sleep (time, value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value);
        }, time)
    })
}

sleep(1000, '')
    .then((value) => {
        let a = 'hello ';
        return sleep(1000, value + a);
    })
    .then((value) => {
        let b = 'lagou ';
        return sleep(1000, value + b);
    })
    .then((value) => {
        let c = ' i lover you';
        console.log(value + c);
    });

