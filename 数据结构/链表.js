/**
 * 对于链表来说，核心点就是元素之间是通过指针来连接的，上一个元素指向下一个元素（单向链表）
 */
class LinkList {
    constructor() {
        this.head = null;
        this.length = 0;
    }
    createNode(data) {
        return {
            el: data,
            next: null
        }
    }
    insert(item, index) {
        item = this.createNode(item);
        if (!this.head) {
            this.head = item;
            this.length += 1;
            return;
        }
        if (index === 0) {
            item.next = this.head;
            this.head = item;
            this.length += 1;
            return;
        }
        if (index > 0 || index < this.length) {
            let current = this.head;
            let previous = null;
            let i = 0;
            while (current) {
                if (index === i) {
                    previous.next = item;
                    item.next = current;
                    this.length += 1;
                    return;
                }
                previous = current;
                current = current.next;
                i++;
            }
        }
    }

    add(item) {
        item = this.createNode(item);
        // console.log("item", item);
        if (!this.head) {
            this.head = item;
            this.length += 1;
            return;
        }
        //不添加index就默认追加到最后一个
        let current = this.head;
        while (current) {
            if (!current.next) {
                item.index = this.length;
                // console.log("item", item);
                current.next = item;
                this.length += 1;
                return;
            }
            current = current.next;
        }
    }
    remove(index) {
        if (!this.head) return;
        if (index === 0) {
            let head = this.head;
            this.head = null;
            return head;
        }
        let current = this.head;
        while (current) {
            if (current.index === index - 1) {
                let previous = current;
                current = current.next;
                previous.next = current.next;
                return current;
            }
            current = current.next;
        }
    }
    getHead() {
        return this.head;
    }
}