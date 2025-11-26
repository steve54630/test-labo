import toMinutes from "../core/utilities";
import { RawSample } from "../dto/sample.dto";
import { Speciality, Priority } from "../type/enum";

export default class Sample {
  constructor(
    public id: string,
    public type: Speciality,
    public priority: Priority,
    public analysisTime: number,
    public arrivalTime: number,
    public patientId?: string
  ) {}

  static fromRaw(rawSample: RawSample): Sample {
    return new Sample(
      rawSample.id,
      rawSample.type as Speciality,
      rawSample.priority as Priority,
      rawSample.analysisTime,
      toMinutes(rawSample.arrivalTime),
      rawSample.patientId
    );
  }
}
