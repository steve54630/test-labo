import { TimeSlot } from "../type/type";
import { Speciality } from "../type/enum";
import Sample from "./sample";
export declare class Equipment {
    id: string;
    name: string | undefined;
    type: Speciality;
    available: boolean;
    timeSlots: TimeSlot[];
    constructor(id: string, name: string | undefined, type: Speciality, available: boolean, timeSlots?: TimeSlot[]);
    static fromRaw(raw: any): Equipment;
    availableSlotsFor(sample: Sample): TimeSlot[];
    /**
     * Vérifie si le sample peut être planifié et retourne le créneau exact utilisable.
     * Ne modifie pas les créneaux.
     */
    isAvailable(sample: Sample): {
        success: boolean;
        slot?: TimeSlot;
    };
    /**
     * Réserve le slot déjà calculé.
     * Découpe le créneau contenant le slot réservé en parties avant/après.
     */
    reserveSlot(slot: TimeSlot): TimeSlot | null;
}
//# sourceMappingURL=equipment.d.ts.map