import morgan, { StreamOptions } from 'morgan';
import { isDevelopment } from '../constants/constants';
import Logger from '../utils/logger';

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => Logger.http(message),
};

// Skip all the Morgan http log if the
// application is not running in development mode.
// This method is not really needed here since
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => !isDevelopment;

// Build the morgan middleware
const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream, skip },
);

export default morganMiddleware;

// for graphql logging
// import morgan, { StreamOptions } from "morgan";

// import { IncomingMessage } from "http";

// import Logger from "../utils/logger";

// interface Request extends IncomingMessage {
//   body: {
//     query: String;
//   };
// }

// const stream: StreamOptions = {
//   write: (message) =>
//     Logger.http(message.substring(0, message.lastIndexOf("\n"))),
// };

// const skip = () => !isDevelopment;

// const registerGraphQLToken = () => {
//   morgan.token("graphql-query", (req: Request) => `GraphQL ${req.body.query}`);
// };

// registerGraphQLToken();

// const morganMiddleware = morgan(
//   ":method :url :status :res[content-length] - :response-time ms\n:graphql-query",
//   { stream, skip }
// );

// export default morganMiddleware;
