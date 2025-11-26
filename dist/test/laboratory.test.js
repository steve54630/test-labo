"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = __importDefault(require("../core/utilities"));
const laboratory_1 = __importDefault(require("../models/laboratory"));
const enum_1 = require("../type/enum");
describe("Laboratory planifyLab", () => {
    const rawData = `{
    "samples": [
      {
        "id": "S001",
        "type": "BLOOD",
        "priority": "URGENT",
        "analysisTime": 30,
        "arrivalTime": "09:00",
        "patientId": "P001"
      }
    ],
    "technicians": [
      {
        "id": "T1",
        "name": "Alice Martin",
        "speciality": "BLOOD",
        "startTime": "08:00",
        "endTime": "17:00"
      }
    ],
    "equipment": [
      {
        "id": "E1",
        "name": "Analyseur Sang A",
        "type": "BLOOD",
        "available": true
      }
    ]
  }`;
    it("should schedule a sample correctly", () => {
        const rawObject = JSON.parse(rawData);
        const lab = laboratory_1.default.fromRaw(rawObject);
        const [technician] = lab.technicians;
        const [equipment] = lab.equipments;
        expect(technician).toBeDefined();
        expect(equipment).toBeDefined();
        // On ajoute un créneau pour le technicien et l'équipement
        lab.technicians[0].timeSlots = [
            { start: (0, utilities_1.default)("08:00"), end: (0, utilities_1.default)("17:00") },
        ];
        lab.equipments[0].timeSlots = [
            { start: (0, utilities_1.default)("08:00"), end: (0, utilities_1.default)("17:00") },
        ];
        lab.planifyLab();
        // Vérifie que le planning contient exactement 1 sample
        expect(lab.schedule.length).toBe(1);
        const scheduled = lab.schedule[0];
        expect(scheduled).toBeDefined();
        expect(scheduled.sampleId).toBe("S001");
        expect(scheduled.technicianId).toBe("T1");
        expect(scheduled.equipmentId).toBe("E1");
        expect(scheduled.startTime).toBe("09:00");
        expect(scheduled.endTime).toBe("09:30"); // 09:00 + 30 min
        expect(scheduled.priority).toBe("URGENT");
        // Vérifie que les créneaux ont été fractionnés
        const techSlots = lab.technicians[0].timeSlots;
        expect(techSlots.length).toBe(2);
        expect(techSlots[0].end).toBe((0, utilities_1.default)("09:00"));
        expect(techSlots[1].start).toBe((0, utilities_1.default)("09:30"));
        const eqSlots = lab.equipments[0].timeSlots;
        expect(eqSlots.length).toBe(2);
        expect(eqSlots[0].end).toBe((0, utilities_1.default)("09:00"));
        expect(eqSlots[1].start).toBe((0, utilities_1.default)("09:30"));
    });
    it("should schedule second sample right after the urgent one", () => {
        const rawObject = JSON.parse(rawData);
        let lab = laboratory_1.default.fromRaw(rawObject);
        lab.samples.push({
            id: "S2",
            type: enum_1.Speciality.BLOOD,
            priority: enum_1.Priority.STAT,
            analysisTime: 20,
            arrivalTime: 540,
            patientId: "P002"
        });
        // On initialise les slots (08:00 → 17:00)
        lab.technicians[0].timeSlots = [
            { start: (0, utilities_1.default)("08:00"), end: (0, utilities_1.default)("17:00") },
        ];
        lab.equipments[0].timeSlots = [
            { start: (0, utilities_1.default)("08:00"), end: (0, utilities_1.default)("17:00") },
        ];
        lab.planifyLab();
        // Vérifie que les deux samples ont été planifiés
        expect(lab.schedule.length).toBe(2);
        const s1 = lab.schedule[0];
        const s2 = lab.schedule[1];
        // Sample STAT : doit être priotrisé
        expect(s1.sampleId).toBe("S2");
        expect(s1.startTime).toBe("09:00");
        expect(s1.endTime).toBe("09:20");
        // Sample NORMAL : doit commencer juste après, à 09:30
        expect(s2.sampleId).toBe("S001");
        expect(s2.startTime).toBe("09:20");
        expect(s2.endTime).toBe("09:50");
        // Vérifie que les slots ont été fractionnés correctement
        const techSlots = lab.technicians[0].timeSlots;
        expect(techSlots.length).toBe(2); // 08:00 → 09:00 → [reserved blocks] → 09:50 → 17:00
        const eqSlots = lab.equipments[0].timeSlots;
        expect(eqSlots.length).toBe(2);
    });
});
//# sourceMappingURL=laboratory.test.js.map