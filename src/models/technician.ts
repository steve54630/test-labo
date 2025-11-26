import toMinutes from "../core/utilities";
import { RawTechnician } from "../dto/technician.dto";
import { Speciality } from "../type/enum";
import { TimeSlot } from "../type/type";
import Sample from "./sample";

export class Technician {
  constructor(
    public id: string,
    public name: string | undefined,
    public speciality: Speciality,
    public timeSlots: TimeSlot[]
  ) {}

  static fromRaw(rawTechnician: RawTechnician): Technician {
    return new Technician(
      rawTechnician.id,
      rawTechnician.name,
      rawTechnician.speciality as Speciality,
      [
        {
          start: toMinutes(rawTechnician.startTime),
          end: toMinutes(rawTechnician.endTime),
        },
      ]
    );
  }

  // Vérifie si le sample peut être planifié et calcule le slot utilisable
  isAvailable(sample: Sample): { success: boolean; slot?: TimeSlot } {
    const duration = sample.analysisTime;

    for (let slot of this.timeSlots) {
      if (!slot) continue;

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

  availableSlotsFor(sample: Sample): TimeSlot[] {
    return this.timeSlots.filter(
      (slot) => slot.end - slot.start >= sample.analysisTime
    );
  }

  // Réserve le slot déjà calculé
  reserveSlot(slot: TimeSlot): TimeSlot | null {
    for (let i = 0; i < this.timeSlots.length; i++) {
      const current = this.timeSlots[i];
      if (!current) continue;

      // Le slot à réserver doit être complètement contenu dans le créneau existant
      if (slot.start >= current.start && slot.end <= current.end) {
        const newSlots: TimeSlot[] = [];

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
