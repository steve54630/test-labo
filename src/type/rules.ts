import { Priority, Speciality } from "./enum";

export const PriorityOrder : Record<Priority, number> = {STAT: 1, URGENT: 2, ROUTINE: 3};

export const SpecialityOrder : Record<Speciality, number> = {BLOOD: 1, URINE: 1, TISSUE: 1, GENERAL: 2};