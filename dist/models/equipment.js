"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Equipment = void 0;
class Equipment {
    id;
    name;
    type;
    available;
    timeSlots;
    constructor(id, name, type, available, timeSlots) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.available = available;
        this.timeSlots = timeSlots ?? [{ start: 480, end: 1020 }];
    }
    static fromRaw(raw) {
        return new Equipment(raw.id, raw.name, raw.type, raw.available, raw.timeSlots // si fourni dans le JSON
        );
    }
    availableSlotsFor(sample) {
        return this.timeSlots.filter((slot) => slot.end - slot.start >= sample.analysisTime);
    }
    /**
     * Vérifie si le sample peut être planifié et retourne le créneau exact utilisable.
     * Ne modifie pas les créneaux.
     */
    isAvailable(sample) {
        const duration = sample.analysisTime;
        for (let slot of this.timeSlots) {
            if (!slot)
                continue;
            const start = Math.max(sample.arrivalTime, slot.start);
            const end = start + duration;
            if (end <= slot.end) {
                return { success: true, slot: { start, end } };
            }
        }
        return { success: false };
    }
    /**
     * Réserve le slot déjà calculé.
     * Découpe le créneau contenant le slot réservé en parties avant/après.
     */
    reserveSlot(slot) {
        for (let i = 0; i < this.timeSlots.length; i++) {
            const current = this.timeSlots[i];
            if (!current)
                continue;
            if (slot.start >= current.start && slot.end <= current.end) {
                const newSlots = [];
                if (slot.start > current.start)
                    newSlots.push({ start: current.start, end: slot.start });
                if (slot.end < current.end)
                    newSlots.push({ start: slot.end, end: current.end });
                this.timeSlots.splice(i, 1, ...newSlots);
                // Toujours trier
                this.timeSlots.sort((a, b) => a.start - b.start);
                return { start: slot.start, end: slot.end };
            }
        }
        return null;
    }
}
exports.Equipment = Equipment;
//# sourceMappingURL=equipment.js.map