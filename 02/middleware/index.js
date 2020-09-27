function middleware(req, res, next) {
    console.log(new Date().toISOString());
    next();
}

module.exports = middleware;