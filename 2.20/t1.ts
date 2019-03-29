const test = (arg: string) => {
    console.log(arg);
}
test("测试");
test("sd");


//接口
interface Person {
    name: string,
    age: number
}
let name1 = (person: Person) => {
    console.log(person.name);
}
name1({name: "12", age: 1});

let x : [string , number] = ["1", 2];

enum Color {G = 3, R, Y};
let c: Color = Color.G;
console.log("c", c);


class Test {
    constructor(public t1: string, public t2: number) {
        this.t1 = t1;
        this.t2 = t2;
    }
}

let test2 = new Test("12", 1);
console.log(test2.t1);
// export {};