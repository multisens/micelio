const TokenMiddleware = (request, response, next) => {
 
  
  const token = request.headers.token;

  if(!token){
    return response.status(401).json({error:"You dont have game permissions to send a request."});
  }
  next();
}

module.exports = TokenMiddleware;
