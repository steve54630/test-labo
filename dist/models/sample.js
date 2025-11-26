"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = __importDefault(require("../core/utilities"));
class Sample {
    id;
    type;
    priority;
    analysisTime;
    arrivalTime;
    patientId;
    constructor(id, type, priority, analysisTime, arrivalTime, patientId) {
        this.id = id;
        this.type = type;
        this.priority = priority;
        this.analysisTime = analysisTime;
        this.arrivalTime = arrivalTime;
        this.patientId = patientId;
    }
    static fromRaw(rawSample) {
        return new Sample(rawSample.id, rawSample.type, rawSample.priority, rawSample.analysisTime, (0, utilities_1.default)(rawSample.arrivalTime), rawSample.patientId);
    }
}
exports.default = Sample;
//# sourceMappingURL=sample.js.map