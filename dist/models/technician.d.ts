import { RawTechnician } from "../dto/technician.dto";
import { Speciality } from "../type/enum";
import { TimeSlot } from "../type/type";
import Sample from "./sample";
export declare class Technician {
    id: string;
    name: string | undefined;
    speciality: Speciality;
    timeSlots: TimeSlot[];
    constructor(id: string, name: string | undefined, speciality: Speciality, timeSlots: TimeSlot[]);
    static fromRaw(rawTechnician: RawTechnician): Technician;
    isAvailable(sample: Sample): {
        success: boolean;
        slot?: TimeSlot;
    };
    availableSlotsFor(sample: Sample): TimeSlot[];
    reserveSlot(slot: TimeSlot): TimeSlot | null;
}
//# sourceMappingURL=technician.d.ts.map