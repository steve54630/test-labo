"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Technician = void 0;
const utilities_1 = __importDefault(require("../core/utilities"));
class Technician {
    id;
    name;
    speciality;
    timeSlots;
    constructor(id, name, speciality, timeSlots) {
        this.id = id;
        this.name = name;
        this.speciality = speciality;
        this.timeSlots = timeSlots;
    }
    static fromRaw(rawTechnician) {
        return new Technician(rawTechnician.id, rawTechnician.name, rawTechnician.speciality, [
            {
                start: (0, utilities_1.default)(rawTechnician.startTime),
                end: (0, utilities_1.default)(rawTechnician.endTime),
            },
        ]);
    }
    // Vérifie si le sample peut être planifié et calcule le slot utilisable
    isAvailable(sample) {
        const duration = sample.analysisTime;
        for (let slot of this.timeSlots) {
            if (!slot)
                continue;
            // On ne peut commencer avant le début du slot
            const availableStart = Math.max(sample.arrivalTime, slot.start);
            const availableEnd = availableStart + duration;
            // Si le sample tient dans le créneau
            if (availableEnd <= slot.end) {
                return {
                    success: true,
                    slot: { start: availableStart, end: availableEnd },
                };
            }
        }
        return { success: false };
    }
    availableSlotsFor(sample) {
        return this.timeSlots.filter((slot) => slot.end - slot.start >= sample.analysisTime);
    }
    // Réserve le slot déjà calculé
    reserveSlot(slot) {
        for (let i = 0; i < this.timeSlots.length; i++) {
            const current = this.timeSlots[i];
            if (!current)
                continue;
            // Le slot à réserver doit être complètement contenu dans le créneau existant
            if (slot.start >= current.start && slot.end <= current.end) {
                const newSlots = [];
                // Partie avant le slot réservé
                if (slot.start > current.start) {
                    newSlots.push({ start: current.start, end: slot.start });
                }
                // Partie après le slot réservé
                if (slot.end < current.end) {
                    newSlots.push({ start: slot.end, end: current.end });
                }
                // Mise à jour des créneaux
                this.timeSlots.splice(i, 1, ...newSlots);
                return slot; // Slot réservé avec succès
            }
        }
        return null; // Impossible de réserver
    }
}
exports.Technician = Technician;
//# sourceMappingURL=technician.js.map