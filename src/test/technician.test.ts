import toMinutes from "../core/utilities";
import Sample from "../models/sample";
import { Technician } from "../models/technician";
import { Priority, Speciality } from "../type/enum";


describe("Technician", () => {
  const rawJson = `{
    "id": "TECH1",
    "name": "Alice Martin",
    "speciality": "BLOOD",
    "startTime": "08:00",
    "endTime": "17:00" 
}`;

  it("should create a Technician from JSON", () => {
    const rawObject = JSON.parse(rawJson);
    const technician = Technician.fromRaw(rawObject);

    expect(technician.id).toBe("TECH1");
    expect(technician.name).toBe("Alice Martin");
    expect(technician.speciality).toBe(Speciality.BLOOD);

    // Le technicien doit avoir un timeSlot initial basé sur son horaire par défaut
    expect(technician.timeSlots.length).toBe(1);
  });

  it("should check availability and reserve a slot", () => {
    const rawObject = JSON.parse(rawJson);
    const technician = Technician.fromRaw(rawObject);

    // On ajoute un créneau de 08:00 à 17:00
    technician.timeSlots = [{ start: toMinutes("08:00"), end: toMinutes("17:00") }];

    const sample = new Sample("S001", Speciality.BLOOD, Priority.URGENT, 30, toMinutes("09:00"), "P123");

    const isAvailable = technician.isAvailable(sample);
    expect(isAvailable.success).toBe(true);

    technician.reserveSlot(isAvailable.slot!);

    // Après réservation, le créneau initial est fractionné
    expect(technician.timeSlots.length).toBe(2);
    expect(technician.timeSlots[0]!.end).toBe(toMinutes("09:00"));  // avant sample
    expect(technician.timeSlots[1]!.start).toBe(toMinutes("09:30")); // après sample
  });
  
});