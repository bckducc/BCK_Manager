export interface UtilityReading {
  id: string;
  roomId: string;
  roomNumber: string;
  month: number;
  year: number;
  electricityReading: number; // kWh
  waterReading: number; // m³
  readingDate: string;
  notes?: string;
}

export interface UtilityFilter {
  roomId?: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}
