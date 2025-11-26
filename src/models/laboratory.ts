import toMinutes, { toTime } from "../core/utilities";
import { RawLaboratory } from "../dto/laboratory.dto";
import { Speciality } from "../type/enum";
import { PriorityOrder, SpecialityOrder } from "../type/rules";
import { Metrics, TimeSlot } from "../type/type";
import { Equipment } from "./equipment";
import Sample from "./sample";
import { Schedule } from "./schedule";
import { Technician } from "./technician";

export default class Laboratory {
  constructor(
    public samples: Sample[],
    public technicians: Technician[],
    public equipments: Equipment[],
    public schedule: Schedule[] = []
  ) {}

  static fromRaw(raw: RawLaboratory): Laboratory {
    return new Laboratory(
      raw.samples.map(Sample.fromRaw),
      raw.technicians.map(Technician.fromRaw),
      raw.equipment.map(Equipment.fromRaw)
    );
  }

  calculateTotalTime(): number {
    if (this.schedule.length === 0) return 0;

    const minStart = Math.min(
      ...this.schedule.map((s) => toMinutes(s.startTime))
    );
    const maxEnd = Math.max(...this.schedule.map((s) => toMinutes(s.endTime)));

    return maxEnd - minStart;
  }

  calculateEfficiency(): number {
    if (this.schedule.length === 0) return 0;

    const minStart = Math.min(
      ...this.schedule.map((s) => toMinutes(s.startTime))
    );
    const maxEnd = Math.max(...this.schedule.map((s) => toMinutes(s.endTime)));
    const totalTime = maxEnd - minStart;

    // Crée un tableau représentant chaque minute
    const timeline: number[] = Array(totalTime).fill(0);

    this.schedule.forEach((s) => {
      const start = toMinutes(s.startTime) - minStart;
      const end = toMinutes(s.endTime) - minStart;
      for (let i = start; i < end; i++) {
        timeline[i]!++; // on incrémente le nombre de techniciens actifs à cette minute
      }
    });

    const totalAnalysisTime = this.schedule.reduce(
      (sum, s) => sum + (toMinutes(s.endTime) - toMinutes(s.startTime)),
      0
    );

    const maxParallel = Math.max(...timeline);

    // Efficiency = temps d’analyse réel / (totalTime × ressources max)
    return parseFloat(
      ((totalAnalysisTime / (totalTime * maxParallel)) * 100).toFixed(1)
    );
  }

  computeMetrics(conflicts: number): Metrics {
    return {
      totalTime: this.calculateTotalTime(),
      efficiency: this.calculateEfficiency(),
      conflicts,
    };
  }

  getTechniciansFor(sample: Sample): Technician[] {
    return this.technicians
      .filter(
        (t) =>
          t.speciality === sample.type || t.speciality === Speciality.GENERAL
      )
      .sort(
        (a, b) => SpecialityOrder[a.speciality] - SpecialityOrder[b.speciality]
      );
  }

  getEquipmentFor(sample: Sample): Equipment[] {
    return this.equipments.filter((eq) => eq.type === sample.type);
  }

  planifySample(sample: Sample): boolean {
    const technicians = this.getTechniciansFor(sample);
    const equipments = this.getEquipmentFor(sample);

    // Liste des créneaux possibles
    const possibleSlots: {
      tech: Technician;
      eq: Equipment;
      slot: TimeSlot;
    }[] = [];

    for (let tech of technicians) {
      const techAvail = tech.availableSlotsFor(sample);
      for (let eq of equipments) {
        const eqAvail = eq.availableSlotsFor(sample);

        for (let tSlot of techAvail) {
          for (let eSlot of eqAvail) {
            const start = Math.max(
              tSlot.start,
              eSlot.start,
              sample.arrivalTime
            );
            const end = start + sample.analysisTime;

            if (end <= tSlot.end && end <= eSlot.end) {
              possibleSlots.push({ tech, eq, slot: { start, end } });
            }
          }
        }
      }
    }

    if (possibleSlots.length === 0) return false;

    possibleSlots.sort((a, b) => a.slot.start - b.slot.start);

    const chosen = possibleSlots[0];
    if (!chosen) return false;
    chosen.tech.reserveSlot(chosen.slot);
    chosen.eq.reserveSlot(chosen.slot);

    this.schedule.push({
      sampleId: sample.id,
      technicianId: chosen.tech.id,
      equipmentId: chosen.eq.id,
      startTime: toTime(chosen.slot.start),
      endTime: toTime(chosen.slot.end),
      priority: sample.priority,
    });

    return true;
  }

  returnSampleByPriority(): Sample[] {
    return [...this.samples].sort((a, b) => {
      // d'abord on compare la priorité
      const prioDiff = PriorityOrder[a.priority] - PriorityOrder[b.priority];
      if (prioDiff !== 0) return prioDiff;

      // si priorité identique, on compare l'heure d'arrivée
      return a.arrivalTime - b.arrivalTime;
    });
  }

  planifyLab(): { schedule: Schedule[]; metrics: Metrics } {
    let conflicts = 0;
    const sorted = this.returnSampleByPriority();

    for (let sample of sorted) {
      const success = this.planifySample(sample);

      if (!success) {
        conflicts++;
      }
    }

    return {
      schedule: this.schedule.sort(
        (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)
      ),
      metrics: this.computeMetrics(conflicts),
    };
  }
}
