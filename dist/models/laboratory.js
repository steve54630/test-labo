"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = __importStar(require("../core/utilities"));
const enum_1 = require("../type/enum");
const rules_1 = require("../type/rules");
const equipment_1 = require("./equipment");
const sample_1 = __importDefault(require("./sample"));
const technician_1 = require("./technician");
class Laboratory {
    samples;
    technicians;
    equipments;
    schedule;
    constructor(samples, technicians, equipments, schedule = []) {
        this.samples = samples;
        this.technicians = technicians;
        this.equipments = equipments;
        this.schedule = schedule;
    }
    static fromRaw(raw) {
        return new Laboratory(raw.samples.map(sample_1.default.fromRaw), raw.technicians.map(technician_1.Technician.fromRaw), raw.equipment.map(equipment_1.Equipment.fromRaw));
    }
    calculateTotalTime() {
        if (this.schedule.length === 0)
            return 0;
        const minStart = Math.min(...this.schedule.map((s) => (0, utilities_1.default)(s.startTime)));
        const maxEnd = Math.max(...this.schedule.map((s) => (0, utilities_1.default)(s.endTime)));
        return maxEnd - minStart;
    }
    calculateEfficiency() {
        if (this.schedule.length === 0)
            return 0;
        const minStart = Math.min(...this.schedule.map((s) => (0, utilities_1.default)(s.startTime)));
        const maxEnd = Math.max(...this.schedule.map((s) => (0, utilities_1.default)(s.endTime)));
        const totalTime = maxEnd - minStart;
        // Crée un tableau représentant chaque minute
        const timeline = Array(totalTime).fill(0);
        this.schedule.forEach((s) => {
            const start = (0, utilities_1.default)(s.startTime) - minStart;
            const end = (0, utilities_1.default)(s.endTime) - minStart;
            for (let i = start; i < end; i++) {
                timeline[i]++; // on incrémente le nombre de techniciens actifs à cette minute
            }
        });
        const totalAnalysisTime = this.schedule.reduce((sum, s) => sum + ((0, utilities_1.default)(s.endTime) - (0, utilities_1.default)(s.startTime)), 0);
        const maxParallel = Math.max(...timeline);
        // Efficiency = temps d’analyse réel / (totalTime × ressources max)
        return parseFloat(((totalAnalysisTime / (totalTime * maxParallel)) * 100).toFixed(1));
    }
    computeMetrics(conflicts) {
        return {
            totalTime: this.calculateTotalTime(),
            efficiency: this.calculateEfficiency(),
            conflicts,
        };
    }
    getTechniciansFor(sample) {
        return this.technicians
            .filter((t) => t.speciality === sample.type || t.speciality === enum_1.Speciality.GENERAL)
            .sort((a, b) => rules_1.SpecialityOrder[a.speciality] - rules_1.SpecialityOrder[b.speciality]);
    }
    getEquipmentFor(sample) {
        return this.equipments.filter((eq) => eq.type === sample.type);
    }
    planifySample(sample) {
        const technicians = this.getTechniciansFor(sample);
        const equipments = this.getEquipmentFor(sample);
        // Liste des créneaux possibles
        const possibleSlots = [];
        for (let tech of technicians) {
            const techAvail = tech.availableSlotsFor(sample);
            for (let eq of equipments) {
                const eqAvail = eq.availableSlotsFor(sample);
                for (let tSlot of techAvail) {
                    for (let eSlot of eqAvail) {
                        const start = Math.max(tSlot.start, eSlot.start, sample.arrivalTime);
                        const end = start + sample.analysisTime;
                        if (end <= tSlot.end && end <= eSlot.end) {
                            possibleSlots.push({ tech, eq, slot: { start, end } });
                        }
                    }
                }
            }
        }
        if (possibleSlots.length === 0)
            return false;
        possibleSlots.sort((a, b) => a.slot.start - b.slot.start);
        const chosen = possibleSlots[0];
        if (!chosen)
            return false;
        chosen.tech.reserveSlot(chosen.slot);
        chosen.eq.reserveSlot(chosen.slot);
        this.schedule.push({
            sampleId: sample.id,
            technicianId: chosen.tech.id,
            equipmentId: chosen.eq.id,
            startTime: (0, utilities_1.toTime)(chosen.slot.start),
            endTime: (0, utilities_1.toTime)(chosen.slot.end),
            priority: sample.priority,
        });
        return true;
    }
    returnSampleByPriority() {
        return [...this.samples].sort((a, b) => {
            // d'abord on compare la priorité
            const prioDiff = rules_1.PriorityOrder[a.priority] - rules_1.PriorityOrder[b.priority];
            if (prioDiff !== 0)
                return prioDiff;
            // si priorité identique, on compare l'heure d'arrivée
            return a.arrivalTime - b.arrivalTime;
        });
    }
    planifyLab() {
        let conflicts = 0;
        const sorted = this.returnSampleByPriority();
        for (let sample of sorted) {
            const success = this.planifySample(sample);
            if (!success) {
                conflicts++;
            }
        }
        return {
            schedule: this.schedule.sort((a, b) => (0, utilities_1.default)(a.startTime) - (0, utilities_1.default)(b.startTime)),
            metrics: this.computeMetrics(conflicts),
        };
    }
}
exports.default = Laboratory;
//# sourceMappingURL=laboratory.js.map