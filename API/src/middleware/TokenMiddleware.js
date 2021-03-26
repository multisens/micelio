const TokenMiddleware = (request, response, next) => {
  const token = request.getHeader('token');
  if(!token){
    return response.status(401).send();
  }
  next();
}

module.exports = TokenMiddleware;
