const getQueue = (() => {
    /**
     * 队列，特点是先进先出
     */
    class Queue {
        constructor() {
            this.items = [];
        }
        add(item) {
            this.items.push(item);
        }
        get() {
            return this.items.shift();
        }
        isEmpty() {
            return this.items.length === 0;
        }
        size() {
            return this.items.length;
        }
    }
    const hanlder = (target, property, receiver) => {
        console.log("获取属性", target);
        if (property === "items") {
            return console.log("该属性为私有");
        } else {
            return target[property];
        }
    }
    return () => {
        // return new Proxy(new Queue(), {
        //     get: hanlder
        // });
        return new Queue();
    }
})();