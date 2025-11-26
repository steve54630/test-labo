"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = __importDefault(require("../core/utilities"));
const sample_1 = __importDefault(require("../models/sample"));
const technician_1 = require("../models/technician");
const enum_1 = require("../type/enum");
describe("Technician", () => {
    const rawJson = `{
    "id": "TECH1",
    "name": "Alice Martin",
    "speciality": "BLOOD",
    "startTime": "08:00",
    "endTime": "17:00" 
}`;
    it("should create a Technician from JSON", () => {
        const rawObject = JSON.parse(rawJson);
        const technician = technician_1.Technician.fromRaw(rawObject);
        expect(technician.id).toBe("TECH1");
        expect(technician.name).toBe("Alice Martin");
        expect(technician.speciality).toBe(enum_1.Speciality.BLOOD);
        // Le technicien doit avoir un timeSlot initial basé sur son horaire par défaut
        expect(technician.timeSlots.length).toBe(1);
    });
    it("should check availability and reserve a slot", () => {
        const rawObject = JSON.parse(rawJson);
        const technician = technician_1.Technician.fromRaw(rawObject);
        // On ajoute un créneau de 08:00 à 17:00
        technician.timeSlots = [{ start: (0, utilities_1.default)("08:00"), end: (0, utilities_1.default)("17:00") }];
        const sample = new sample_1.default("S001", enum_1.Speciality.BLOOD, enum_1.Priority.URGENT, 30, (0, utilities_1.default)("09:00"), "P123");
        const isAvailable = technician.isAvailable(sample);
        expect(isAvailable.success).toBe(true);
        technician.reserveSlot(isAvailable.slot);
        // Après réservation, le créneau initial est fractionné
        expect(technician.timeSlots.length).toBe(2);
        expect(technician.timeSlots[0].end).toBe((0, utilities_1.default)("09:00")); // avant sample
        expect(technician.timeSlots[1].start).toBe((0, utilities_1.default)("09:30")); // après sample
    });
});
//# sourceMappingURL=technician.test.js.map