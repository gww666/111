const $ = (selector) => {
    return document.querySelector(selector);
}

const $$ = (selector) => {
    return Array.from(document.querySelectorAll(selector));
}

const addClass = (el, className) => {
    let _className = el.getAttribute("class");
    if (_className) {
        let arr = _className.split(" ");
        arr.push(className);
        className = arr.join(" ");
    }
    el.setAttribute("class", className);
}

const removeClass = (el, className) => {
    let _className = el.getAttribute("class");
    if (!className) return;
    let arr = _className.split(" ");
    let index = arr.findIndex(item => item === className);
    arr.splice(index, 1);
    className = arr.join(" ");
    el.setAttribute("class", className);
}

let c1 = $(".c1");
let c2 = $(".c2");
let c3 = $(".c3");
//初始化事件
let items = $$(".box>div");
items.forEach((item, index) => {
    let startX = 0;
    let startY = 0;
    item.ontouchstart = (e) => {
        startX = e.touches[0].pageX;
    }
    item.ontouchend = (e) => {
        let endX = e.changedTouches[0].pageX;
        let dist = endX - startX;
        let round = 10;
        if (Math.abs(dist) < round) {
            console.log(`滑动距离小于${round}px`);
            return;
        }
        if (dist < 0) {
            console.log("向左滑动");
            //left运动
            // left.
            addClass(c1, "c12left");
            addClass(c2, "c22left");
            addClass(c3, "c32left");
            
        } else {
            console.log("向右滑动");
        }
    }
});