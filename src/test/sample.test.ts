import Sample from "../models/sample";
import { Priority, Speciality } from "../type/enum";

describe("Sample", () => {
  const rawJson = `{
    "id": "S001",
    "type": "BLOOD",
    "priority": "URGENT",
    "analysisTime": 45,
    "arrivalTime": "09:00",
    "patientId": "P123"              
}`;

  it("should create a Sample from JSON", () => {
    const rawObject = JSON.parse(rawJson);
    const sample = Sample.fromRaw(rawObject);

    expect(sample.id).toBe("S001");
    expect(sample.type).toBe(Speciality.BLOOD);
    expect(sample.priority).toBe(Priority.URGENT);
    expect(sample.analysisTime).toBe(45);
    expect(sample.arrivalTime).toBe(540); // 09:00 → 540 minutes
    expect(sample.patientId).toBe("P123");
  });
  
});
