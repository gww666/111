window.PSEvent = (function () {
    let global = this,
    Event,
    _default = "default";
    Event = function () {
        let _listen,
        _trigger,
        _remove,
        _slice = Array.prototype.slice,
        _shift = Array.prototype.shift,
        _unshift = Array.prototype.unshift,
        namespaceCache = {},
        _create,
        find,
        each = function (arr, fn) {
            let ret;
            for (var i = 0, l = arr.length; i < l; i++) {
                var n = arr[i];
                ret = fn.call(n, i, n);
            }
            return ret;
        };
        _listen = function (key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        //如果传值fn，则删除对应的fn，否则全部删除
        _remove = function (key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (let i = cache[key].length; i >= 0; i--) {
                        let flag = fn === cache[key][i];
                        // console.log("打印方法", fn, cache[key][i], flag);
                        if (fn === cache[key][i]) {
                            cache[key].splice(i, 1);
                        }
                    }
                } else {
                    cache[key] = [];
                }
            }
        };
        _trigger = function() {
            let cache = _shift.call(arguments),//删除并返回数组第一个参数
            key = _shift.call(arguments),
            args = arguments,
            _self = this,
            ret,
            stack = cache[key];
            if (!stack || !stack.length) {
                return;
            }
            return each(stack, function () {
                return this.apply(_self, args);
            });
        };
        _create = function (namespace = _default) {
            let cache = {},
            offlineStack = [], //离线事件
            ret = {
                listen: function (key, fn, last) {
                    _listen(key, fn, cache);
                    if (offlineStack === null) {
                        return;
                    }
                    if (last === "last") {
                        //删除最后一个元素并且返回最后一个元素
                        offlineStack.length && offlineStack.pop()();
                    } else {
                        each(offlineStack, function () {
                            this();
                        });
                    }
                    offlineStack = null;
                },
                one: function (key, fn, last) {
                    _remove(key, cache);
                    this.listen(key, fn, last);
                },
                remove: function (key, fn) {
                    _remove(key, cache, fn);
                },
                trigger: function() {
                    let fn,
                    args,
                    _self = this;
                    _unshift.call(arguments, cache);
                    args = arguments;
                    fn = function () {
                        return _trigger.apply(_self, args);
                    }
                    if (offlineStack) {
                        return offlineStack.push(fn);
                    }
                    return fn();
                }
            };
            return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret) : ret;
        };
        return {
            create: _create,
            one: function (key, fn, last) {
                let event = this.create();
                event.one(key, fn, last);
            },
            listen: function (key, fn, last) {
                let event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function () {
                let event = this.create();
                event.trigger.apply(this, arguments);
            },
            remove: function(key, fn) {
                let event = this.create();
                event.remove(key, fn);
            }
        }
    }();
    return Event;
})();