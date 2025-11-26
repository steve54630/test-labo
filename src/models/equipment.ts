import { TimeSlot } from "../type/type";
import { Speciality } from "../type/enum";
import Sample from "./sample";

export class Equipment {
  public timeSlots: TimeSlot[];

  constructor(
    public id: string,
    public name: string | undefined,
    public type: Speciality,
    public available: boolean,
    timeSlots?: TimeSlot[]
  ) {
    this.timeSlots = timeSlots ?? [{start: 480, end: 1020}];
  }

  static fromRaw(raw: any): Equipment {
    return new Equipment(
      raw.id,
      raw.name,
      raw.type,
      raw.available,
      raw.timeSlots // si fourni dans le JSON
    );
  }

  availableSlotsFor(sample: Sample): TimeSlot[] {
    return this.timeSlots.filter(
      (slot) => slot.end - slot.start >= sample.analysisTime
    );
  }

  /**
   * Vérifie si le sample peut être planifié et retourne le créneau exact utilisable.
   * Ne modifie pas les créneaux.
   */
  isAvailable(sample: Sample): { success: boolean; slot?: TimeSlot } {
    const duration = sample.analysisTime;

    for (let slot of this.timeSlots) {
      if (!slot) continue;

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
  reserveSlot(slot: TimeSlot): TimeSlot | null {
    for (let i = 0; i < this.timeSlots.length; i++) {
      const current = this.timeSlots[i];
      if (!current) continue;
      
      if (slot.start >= current.start && slot.end <= current.end) {
        
        const newSlots: TimeSlot[] = [];

        if (slot.start > current.start) newSlots.push({ start: current.start, end: slot.start });
        if (slot.end < current.end) newSlots.push({ start: slot.end, end: current.end });
        
        this.timeSlots.splice(i, 1, ...newSlots);
        
        // Toujours trier
        this.timeSlots.sort((a, b) => a.start - b.start);

        return { start: slot.start, end: slot.end };
      }
    }

    return null;
  }
}
