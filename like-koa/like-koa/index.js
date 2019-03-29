const http = require("http");
const Context = require("./context");
const Response = require("./response");
const Request = require("./request");
const compose = require("./compose");
const Delegate = require("./delegate");
class Application {
    constructor() {
        this.server = null;
        this.middleware = [];//维护一个中间件队列
    }
    use(fn) {
        if (!fn || typeof fn !== "function") {
            throw new TypeError("use函数必须接收一个函数作为参数");
        }
        this.middleware.push(fn);
        return this;
    }
    createContext(req, res) {
        const ctx = new Context();
        const response = new Response();
        const request = new Request();
        ctx.app = request.app = response.app = this;
        ctx.req = request.req = response.req = req;
        ctx.res = request.res = response.res = res;
        ctx.response = response;
        ctx.request = request;
        request.ctx = response.ctx = ctx;
        request.response = response;
        response.request = request;
        ctx.originalUrl = request.originalUrl = req.url;
        ctx.state = {};
        this.delegateReq(ctx).delegateRes(ctx);
        return ctx;
    }
    handleRequest(req, res) {
        const fn = compose(this.middleware);
        const ctx = this.createContext(req, res);
        fn(ctx).then(this.respond.bind(null, ctx)).catch(this.onerror);
    }
    respond(ctx) {
        let body = ctx.body;
        let res = ctx.res;
        if ('HEAD' == ctx.method) {
            if (!res.headersSent && isJSON(body)) {
                ctx.length = Buffer.byteLength(JSON.stringify(body));
            }
            return res.end();
        }

        // status body
        if (null == body) {
            if (ctx.req.httpVersionMajor >= 2) {
                body = String(code);
            } else {
                body = ctx.message || String(code);
            }
            if (!res.headersSent) {
                ctx.type = 'text';
                ctx.length = Buffer.byteLength(body);
            }
            return res.end(body);
        }

        // responses
        if (Buffer.isBuffer(body)) return res.end(body);
        if ('string' == typeof body) return res.end(body);
        if (body instanceof Stream) return body.pipe(res);

        // body: json
        body = JSON.stringify(body);
        if (!res.headersSent) {
            ctx.length = Buffer.byteLength(body);
        }
        res.end(body);
    }
    onerror(err) {
        console.log("err", err);
    }
    listen(...args) {
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
    delegateRes(ctx) {
        new Delegate(ctx, "response")
            .method('attachment')
            .method('redirect')
            .method('remove')
            .method('vary')
            .method('set')
            .method('append')
            .method('flushHeaders')
            .access('status')
            .access('message')
            .access('body')
            .access('length')
            .access('type')
            .access('lastModified')
            .access('etag')
            .getter('headerSent')
            .getter('writable');
        return this;
    }
    delegateReq(ctx) {
        new Delegate(ctx, "request")
            .method('acceptsLanguages')
            .method('acceptsEncodings')
            .method('acceptsCharsets')
            .method('accepts')
            .method('get')
            .method('is')
            .access('querystring')
            .access('idempotent')
            .access('socket')
            .access('search')
            .access('method')
            .access('query')
            .access('path')
            .access('url')
            .access('accept')
            .getter('origin')
            .getter('href')
            .getter('subdomains')
            .getter('protocol')
            .getter('host')
            .getter('hostname')
            .getter('URL')
            .getter('header')
            .getter('headers')
            .getter('secure')
            .getter('stale')
            .getter('fresh')
            .getter('ips')
            .getter('ip');
        return this;
    }
}

module.exports = Application;