import { EOverallAge, InterventionType } from "@/types/app";
import { match } from "ts-pattern";

const countryOptions = [
  { value: "United States", label: "USA" },
  { value: "Spain", label: "Spain" },
  { value: "Italy", label: "Italy" },
  { value: "France", label: "France" },
  { value: "Luxembourg", label: "Luxembourg" },
];

const overallAgeOptions = [
  { value: EOverallAge.ZERO_TO_THREE, label: "under_3_months" },
  { value: EOverallAge.ZERO_TO_SIX, label: "under_6_months" },
  { value: EOverallAge.ZERO_TO_TEN, label: "under_10_months" },
  { value: EOverallAge.ZERO_TO_TWELVE, label: "under_12_months" },
  { value: EOverallAge.ZERO_TO_TWENTY_FOUR, label: "under_24_months" },
];

export const pickOptions = (
  options: Array<{ value: string; label: string }>,
  keys: string[]
) => options.filter((option) => keys.includes(option.value));

export const useFilter = (type: InterventionType) => {
  const filters = match(type)
    .with(InterventionType.NIRSEVIMAB, () => ({
      countryOptions,
      overallAgeOptions,
    }))
    .with(InterventionType.OLD_ADULTS, () => ({ country: "United States" }))
    .with(InterventionType.MATERNAL, () => ({ country: "United States" }));

  return filters;
};
