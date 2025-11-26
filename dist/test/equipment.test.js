"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const equipment_1 = require("../models/equipment");
const sample_1 = __importDefault(require("../models/sample"));
const enum_1 = require("../type/enum");
describe("Equipment", () => {
    const rawJson = `{
  "id": "EQ001", 
  "name": "Analyseur Sang",
  "type": "BLOOD",
  "available": true
}`;
    it("should create an Equipment from JSON", () => {
        const rawObject = JSON.parse(rawJson);
        const equipment = equipment_1.Equipment.fromRaw(rawObject);
        expect(equipment.id).toBe("EQ001");
        expect(equipment.name).toBe("Analyseur Sang");
        expect(equipment.type).toBe(enum_1.Speciality.BLOOD);
        expect(equipment.available).toBe(true);
    });
    it("should check availability and reserve a slot", () => {
        const rawObject = JSON.parse(rawJson);
        const equipment = equipment_1.Equipment.fromRaw(rawObject);
        const sample = new sample_1.default("S001", enum_1.Speciality.BLOOD, enum_1.Priority.URGENT, 30, 540, "P123"); // 09:00
        const isAvailable = equipment.isAvailable(sample);
        expect(isAvailable.success).toBe(true);
        equipment.reserveSlot(isAvailable.slot);
        // Après réservation, le créneau initial est fractionné
        expect(equipment.timeSlots.length).toBe(2);
        expect(equipment.timeSlots[0].end).toBe(540); // avant sample
        expect(equipment.timeSlots[1].start).toBe(570); // après sample
    });
});
//# sourceMappingURL=equipment.test.js.map