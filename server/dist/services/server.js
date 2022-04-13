"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const i18n_1 = __importDefault(require("i18n"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const routes_1 = __importDefault(require("../routes"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const httpLogger_1 = __importDefault(require("../middlewares/httpLogger"));
const app = (0, express_1.default)();
i18n_1.default.configure({
    locales: ['en', 'ar'],
    directory: `${__dirname}/../../locales`,
    syncFiles: true,
    objectNotation: true,
    queryParameter: 'lang',
});
app.use(i18n_1.default.init);
app.use((0, cors_1.default)());
app.options('*', cors_1.default);
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: false }));
app.use((0, hpp_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
app.use(httpLogger_1.default);
app.use(`${process.env.API_URL}`, routes_1.default);
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map