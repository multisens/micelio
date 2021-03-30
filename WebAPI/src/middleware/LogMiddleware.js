function LogMiddleware(request, response, next) {

    const marker = ' :: ';
    const data = request.method + marker + request.originalUrl + marker + request.headers['host'] + marker + request.headers['user-agent'] + marker +  request.headers.token

    console.log(data);

    next();

}


module.exports = LogMiddleware;