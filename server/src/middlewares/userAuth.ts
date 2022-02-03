// import { NextFunction, Response } from 'express';
// import { excludedAPIs } from '../config/constants';
// import ApiError from '../utils/ApiError';
// import { authenticateUser } from '../utils/jwt';

// export const userAuth = (req: any, _res: Response, next: NextFunction) => {
//   // exclude methods from auth middleware
//   const { path, method } = req;
//   for (const apiUrl of excludedAPIs) {
//     if (apiUrl.methods.includes(method) && path.indexOf(apiUrl.url) >= 0) {
//       next();
//       return;
//     }
//   }

//   // check token in headers
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) throw new ApiError('errorMsg.authFailed', 401);

//   // verify token
//   const verifyToken: any = authenticateUser(token);
//   if (!verifyToken) throw new ApiError('errorMsg.authFailed', 401);
//   req.userData = verifyToken;
//   next();
// };
