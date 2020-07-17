/**
 * 对于栈来说，只要抓住它最主要个一个特征：后进先出，就很容易用代码实现出来了。
 */
class Stack {
    constructor() {
        this.save = [];
    }
    add(el) {
        this.save.push(el);
    }
    get() {
        return this.save.pop();
    }
    peek() {
        return this.save[0];
    }
    isEmpty() {
        return this.save.length === 0;
    }
}