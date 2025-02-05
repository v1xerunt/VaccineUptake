export interface IData {
  name: string;
  value: number;
  details: {
    id: string;
    country: string;
    city: string;
    intervention: string;
    population: string;
    subFilterKey: string;
    subFilterValue: string;
    uptake: string;
  };
}
