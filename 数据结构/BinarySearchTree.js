
class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    getRoot() {
        return this.root;
    }
    createNode(key) {
        return {
            key: key,
            left: null,
            right: null,
        }
    }
    insert(key) {
        let node = this.createNode(key);
        const insert = (node, newNode) => {
            if (newNode.key <= node.key) {
                if (node.left) {
                    insert(node.left, newNode);
                } else {
                    node.left = newNode;
                }
            } else {
                if (node.right) {
                    insert(node.right, newNode);
                } else {
                    node.right = newNode;
                }
            }
        }
        if (this.root === null) {
            this.root = node;
        } else {
            insert(this.root, node);
        }
    }
    //中序遍历
    inOrderTraverseNode(node, cb) {
        if (node) {
            this.inOrderTraverseNode(node.left, cb);
            cb(node.key);
            this.inOrderTraverseNode(node.right, cb);
        }
    }
    //前序遍历
    perOrderTraverseNode(node, cb) {
        if (node) {
            cb(node.key);
            this.perOrderTraverseNode(node.left, cb);
            this.perOrderTraverseNode(node.right, cb);
        }
    }
    //后序遍历
    postOrderTraverseNode(node, cb) {
        if (node) {
            this.postOrderTraverseNode(node.left, cb);
            this.postOrderTraverseNode(node.right, cb);
            cb(node.key);
        }
    }

    //返回最小值
    minNode(node) {
        node = node || this.root;
        if (node) {
            while (node && node.left) {
                node = node.left;
            }
            return node.key;
        }
        return null;
    }
    //最大值
    maxNode(node) {
        node = node || this.root;
        if (node) {
            while (node && node.right) {
                node = node.right;
            }
            return node.key;
        }
        return null;
    }
    //查找特定值
    search(key) {
        if (!this.root) return false;
        const _search = (node, key) => {
            if (key < node.key) {
                return _search(node.left, key);
            } else if (key > node.key) {
                return _search(node.right, key);
            } else {
                return true;
            }
        }
        return _search(this.root, key);
    }
    remove(key) {
        const _remove = (node, key) => {
            if (!node) return null;
            if (key < node.key) {
                node.left = _remove(node.left, key);
                return node;
            } else if (key > node.key) {
                node.right = _remove(node.right, key);
                return node;
            } else {
                if (!node.left && !node.right) {
                    node = null;
                    return node;
                }
                //要删除的该节点含一侧子节点
                if (node.left && !node.right) {
                    return node.left;
                } else if (node.right && !node.left) {
                    return node.right;
                }
                //包含两侧子节点
                //找到右侧子节点中最小的节点，以便替换掉当前节点
                // console.log("node.right", node.right);
                let auxKey = this.minNode(node.right);
                console.log("auxKey", auxKey);
                node.key = auxKey;
                //从右侧子节点中删除掉该最小节点
                _remove(node.right, auxKey);
                return node;
            }
        }
        // this.root = _remove(this.root, key);
        _remove(this.root, key);
    }
}

class BinarySearchTree2 {
    constructor() {
        this.root = null;
    }
    getRoot() {
        return this.root;
    }
    createNode(key) {
        return {
            key,
            left: null,
            right: null
        }
    }
    insert(key) {
        let insertNode = this.createNode(key);
        if (!this.root) {
            this.root = insertNode;
            return;
        }
        const _insert = (node, insertNode) => {
            if (insertNode.key > node.key) {
                if (node.right) {
                    _insert(node.right, insertNode);
                } else {
                    node.right = insertNode;
                }
            } else if (insertNode.key < node.key) {
                if (node.left) {
                    _insert(node.left, insertNode);
                } else {
                    node.left = insertNode;
                }
            }
        }
        _insert(this.root, insertNode);
    }
    inOrderTraverseNode(node, cb) {
        if (node) {
            this.inOrderTraverseNode(node.left);
            cb();
            this.inOrderTraverseNode(node.right);
        }
    }
    perOrderTraverseNode(node, cb) {
        if (node) {
            cb();
            this.inOrderTraverseNode(node.left);
            this.inOrderTraverseNode(node.right);
        }
    }
    postOrderTraverseNode(node, cb) {
        if (node) {
            this.inOrderTraverseNode(node.left);
            this.inOrderTraverseNode(node.right);
            cb();
        }
    }
    minNode(node) {
        node = node || this.root;
        let min = node;
        while (node) {
            if (node.left) {
                node = node.left;
                min = node;
            }
        }
        return min;
    }
    search(key) {
        if (!this.root) return;
        const _search = (node, key) => {
            if (!node) return;
            if (key < node.key) {
                return _search(node.left, key);
            } else if (key > node.key) {
                return _search(node.right, key);
            } else {
                return node;
            }
        }
        return _search(this.root, key);
    }
    //清除某个节点
    remove(key) {
        if (!this.root) return;
        // if (!this.root.left && !this.root.right) return;
        const _remove = (node, key) => {
            if (!node) return null;
            if (key < node.key) {
                node.left = _remove(node.left, key);
                return node;
            } else if (key > node.key) {
                node.right = _remove(node.right, key);
                return node;
            } else {
                //相等的节点是叶节点
                if (!node.left && !node.right) {
                    node = null;
                    return node;
                } 
                // else if (node.left && !node.right) {
                //     //相等的节点含有子节点
                // }
                else {
                    //找到最小的节点
                }
                
            }
        }
        _remove(this.root, key);
    }

}