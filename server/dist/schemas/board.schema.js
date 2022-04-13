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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const board_1 = require("../constants/board");
const constants_1 = require("../constants/constants");
const boardSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, enum: Object.values(board_1.BoardNames) },
    type: { type: String, required: true, trim: true, enum: Object.values(board_1.BoardTypes) },
    description: { type: String, trim: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: constants_1.tableNames.PROJECTS, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
boardSchema.pre('remove', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.model(constants_1.tableNames.ISSUES).deleteMany({ board: this._id });
    });
});
const BoardModel = (0, mongoose_1.model)(constants_1.tableNames.BOARDS, boardSchema);
exports.default = BoardModel;
//# sourceMappingURL=board.schema.js.map