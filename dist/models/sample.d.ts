import { RawSample } from "../dto/sample.dto";
import { Speciality, Priority } from "../type/enum";
export default class Sample {
    id: string;
    type: Speciality;
    priority: Priority;
    analysisTime: number;
    arrivalTime: number;
    patientId?: string | undefined;
    constructor(id: string, type: Speciality, priority: Priority, analysisTime: number, arrivalTime: number, patientId?: string | undefined);
    static fromRaw(rawSample: RawSample): Sample;
}
//# sourceMappingURL=sample.d.ts.map