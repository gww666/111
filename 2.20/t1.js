var test = function (arg) {
    console.log(arg);
};
test("测试");
test("sd");
var name1 = function (person) {
    console.log(person.name);
};
name1({ name: "12", age: 1 });
var x = ["1", 2];
var Color;
(function (Color) {
    Color[Color["G"] = 3] = "G";
    Color[Color["R"] = 4] = "R";
    Color[Color["Y"] = 5] = "Y";
})(Color || (Color = {}));
;
var c = Color.G;
console.log("c", c);
var Test = /** @class */ (function () {
    function Test(t1, t2) {
        this.t1 = t1;
        this.t2 = t2;
        this.t1 = t1;
        this.t2 = t2;
    }
    return Test;
}());
var test2 = new Test("12", 1);
console.log(test2.t1);
// export {};
