export interface UtilityReading {
  id: string | number;
  contractId: string | number;
  roomNumber?: string;
  month: number;
  year: number;
  electricOld: number;
  electricNew: number;
  electricPrice: number;
  waterOld: number;
  waterNew: number;
  waterPrice: number;
  recordedDate?: string;
  note?: string;
}

export interface UtilityFilter {
  contractId?: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}
