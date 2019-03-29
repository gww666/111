module.exports = (middleware) => {
    //该方法返回一个promise
    return (ctx, next) => {
        let index = -1;
        const dispatch = (i) => {
            index = i;
            let fn = middleware[index];
            if (index === middleware.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
            } catch(err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    }
}

// module.exports = () => {
//     return () => {
//         return Promise.resolve();
//     }
// }
