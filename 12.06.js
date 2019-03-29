"use strict";
function test (n, total) {
    if (n === 1) return total;
    return test(n - 1, total * n);
}
// test(110000);
let b = test(500000, 1);
console.log(b);