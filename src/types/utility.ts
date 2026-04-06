export interface UtilityReading {
  id: string;
  roomId: string;
  electricityReading: number; // kWh
  waterReading: number; // m³
  readingDate: Date;
  notes?: string;
}
