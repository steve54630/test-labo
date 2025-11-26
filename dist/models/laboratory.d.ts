import { RawLaboratory } from "../dto/laboratory.dto";
import { Metrics } from "../type/type";
import { Equipment } from "./equipment";
import Sample from "./sample";
import { Schedule } from "./schedule";
import { Technician } from "./technician";
export default class Laboratory {
    samples: Sample[];
    technicians: Technician[];
    equipments: Equipment[];
    schedule: Schedule[];
    constructor(samples: Sample[], technicians: Technician[], equipments: Equipment[], schedule?: Schedule[]);
    static fromRaw(raw: RawLaboratory): Laboratory;
    calculateTotalTime(): number;
    calculateEfficiency(): number;
    computeMetrics(conflicts: number): Metrics;
    getTechniciansFor(sample: Sample): Technician[];
    getEquipmentFor(sample: Sample): Equipment[];
    planifySample(sample: Sample): boolean;
    returnSampleByPriority(): Sample[];
    planifyLab(): {
        schedule: Schedule[];
        metrics: Metrics;
    };
}
//# sourceMappingURL=laboratory.d.ts.map