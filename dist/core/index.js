"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const laboratory_1 = __importDefault(require("../models/laboratory"));
// Exemple de données JSON
const easy_json_1 = __importDefault(require("../data/easy.json"));
async function main() {
    const lab = laboratory_1.default.fromRaw(easy_json_1.default);
    console.log("filtered by priority", lab.returnSampleByPriority());
    console.log(lab.planifyLab());
}
main().catch(console.error);
//# sourceMappingURL=index.js.map