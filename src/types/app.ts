export interface IData {
  name: string;
  value: number;
  details: {
    id: string;
    country: string;
    city: string;
    intervention: string;
    population: string;
    study: string;
    healthStatus: string;
    setting: string;
    subFilterKey: string;
    subFilterValue: string;
    uptake: string;
  };
}

export enum InterventionType {
  NIRSEVIMAB = "nirsevimab",
  OLD_ADULTS = "RSV vaccine for older adults",
  MATERNAL = "RSV maternal vaccine",
}

export enum EOverallAge {
  ZERO_TO_THREE = "0-3",
  ZERO_TO_SIX = "0-6",
  ZERO_TO_TEN = "0-10",
  ZERO_TO_TWELVE = "0-12",
  ZERO_TO_TWENTY_FOUR = "0-24",
}
