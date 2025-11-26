"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sample_1 = __importDefault(require("../models/sample"));
const enum_1 = require("../type/enum");
describe("Sample", () => {
    const rawJson = `{
    "id": "S001",
    "type": "BLOOD",
    "priority": "URGENT",
    "analysisTime": 45,
    "arrivalTime": "09:00",
    "patientId": "P123"              
}`;
    it("should create a Sample from JSON", () => {
        const rawObject = JSON.parse(rawJson);
        const sample = sample_1.default.fromRaw(rawObject);
        expect(sample.id).toBe("S001");
        expect(sample.type).toBe(enum_1.Speciality.BLOOD);
        expect(sample.priority).toBe(enum_1.Priority.URGENT);
        expect(sample.analysisTime).toBe(45);
        expect(sample.arrivalTime).toBe(540); // 09:00 → 540 minutes
        expect(sample.patientId).toBe("P123");
    });
});
//# sourceMappingURL=sample.test.js.map