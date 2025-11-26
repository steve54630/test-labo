export type TimeSlot = {
  start: number;
  end: number;
};

export type Metrics = {
  totalTime: number;
  efficiency: number;
  conflicts: number;
}