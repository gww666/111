class Delegate {
    constructor(proto, target) {
        this.proto = proto;
        this.target = target;
    }
    access(name) {
        this.getter(name).setter(name);
        return this;
    }
    getter(name) {
        let proto = this.proto;
        let target = this.target;
        Object.defineProperty(this.proto, name, {
            configurable: true,
            enumerable: true,
            get() {
                return proto[target][name];
            }
        });
        return this;
    }
    setter(name) {
        let proto = this.proto;
        let target = this.target;
        Object.defineProperty(this.proto, name, {
            configurable: true,
            set(val) {
                return proto[target][name] = val;
            }
        });
        return this;
    }
    method(name) {
        let proto = this.proto;
        let target = this.target;
        proto[name] = (...args) => {
            proto[target][name].apply(proto[target], args);
        }
        return this;
    }
}

module.exports = Delegate;