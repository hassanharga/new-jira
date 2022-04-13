"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe/config");
const db_1 = __importDefault(require("./config/db"));
const server_1 = __importDefault(require("./services/server"));
const constants_1 = require("./constants/constants");
const logger_1 = __importDefault(require("./utils/logger"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        server_1.default.listen(constants_1.port, () => {
            logger_1.default.info(`Server is listening in port ${constants_1.port} in ${process.env.NODE_ENV} mode`);
        });
    }
    catch (err) {
        logger_1.default.error(`error[main]: ${JSON.stringify(err, null, 3)}`);
        process.exit(1);
    }
});
main();
//# sourceMappingURL=app.js.map