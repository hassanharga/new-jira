// import { RequestHandler } from 'express';
// import { plainToInstance } from 'class-transformer';
// import { validate } from 'class-validator';
// import { User } from '../validations/user';

// const dtoValidationMiddleware =
//   (className: any, type: 'body' | 'query' | 'params' = 'body', skipMissingProperties = false): RequestHandler =>
//   (req, res, next) => {
//     // eslint-disable-next-line no-nested-ternary
//     const dataToValidate = type === 'body' ? req.body : type === 'params' ? req.params : req.query;

//     const dtoObj: any = plainToInstance<User, any>(className, dataToValidate);

//     validate(dtoObj, { skipMissingProperties }).then((errors) => {
//       if (errors.length > 0) {
//         const msg = errors.map((error) => Object.values(error.constraints || {})).join(', ');
//         res.status(400).json({ msg });
//       } else {
//         req.body = dtoObj;
//         next();
//       }
//     });
//   };

// export default dtoValidationMiddleware;

