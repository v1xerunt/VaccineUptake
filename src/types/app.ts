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
    total: string;
    immunised: string;
    study_type: string;
    uptake: string;
    CI_lower: string;
    CI_upper: string;
  };
}

export enum InterventionType {
  NIRSEVIMAB = "nirsevimab",
  OLD_ADULTS = "elderly_vaccine",
  MATERNAL = "maternal_vaccine",
}

export enum EOverallAge {
  ZERO_TO_THREE = "0-3",
  ZERO_TO_SIX = "0-6",
  ZERO_TO_TEN = "0-10",
  ZERO_TO_TWELVE = "0-12",
  ZERO_TO_TWENTY_FOUR = "0-24",
}
