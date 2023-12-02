import jwt from 'jsonwebtoken';
import { HttpStatusCode } from '../types/http.types';

/**
 This function uses jwt to authenticate the token sent by the client. The
 function compares the token sent by the client with the token stored in the
 server, If they are the same then the client is authorized to acccess the
 route. Otherwise, a 403 Forbidden error is sent to the client.

 It is assumed that the token is sent in the header of the request and that
 a .env file is created and has the process.env.SECRET_KEY variable created.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(HttpStatusCode.FORBIDDEN);
    }

    req.user = user;
    next();
  });
};

export default authenticateToken;
