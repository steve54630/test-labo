import { Equipment } from "../models/equipment";
import Sample from "../models/sample";
import { Priority, Speciality } from "../type/enum";

describe("Equipment", () => {
  const rawJson = `{
  "id": "EQ001", 
  "name": "Analyseur Sang",
  "type": "BLOOD",
  "available": true
}`;

  it("should create an Equipment from JSON", () => {
    const rawObject = JSON.parse(rawJson);
    const equipment = Equipment.fromRaw(rawObject);

    expect(equipment.id).toBe("EQ001");
    expect(equipment.name).toBe("Analyseur Sang");
    expect(equipment.type).toBe(Speciality.BLOOD);
    expect(equipment.available).toBe(true);
  });

  it("should check availability and reserve a slot", () => {
    const rawObject = JSON.parse(rawJson);
    const equipment = Equipment.fromRaw(rawObject);

    const sample = new Sample(
      "S001",
      Speciality.BLOOD,
      Priority.URGENT,
      30,
      540,
      "P123"
    ); // 09:00

    const isAvailable = equipment.isAvailable(sample);
    expect(isAvailable.success).toBe(true);

    equipment.reserveSlot(isAvailable.slot!);

    // Après réservation, le créneau initial est fractionné
    expect(equipment.timeSlots.length).toBe(2);
    expect(equipment.timeSlots[0]!.end).toBe(540); // avant sample
    expect(equipment.timeSlots[1]!.start).toBe(570); // après sample
  });
});
