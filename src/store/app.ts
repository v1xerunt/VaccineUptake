import { create } from "zustand";
import { IData } from "@/types/app";

export enum EMode {
  MAP = "MapOnly",
  TABLE = "DataTable",
  BOTH = "Both",
}

interface IForm {
  countries: string[];
  cities?: string[];
  intervention?: string;
  populations?: string[];
  subFilterKey: string;
  subFilterValue: string;
}
export interface IAppStore {
  mode: EMode;
  setMode: (mode: EMode) => void;
  mapData: IData[];
  updateMap: () => void;
  countryOptions: Array<{
    value: string;
    label: string;
    cities: Array<{ value: string; label: string }>;
  }>;
  interventionOptions: Array<{ value: string; label: string }>;
  popluationOptions: Array<{ value: string; label: string }>;
  subFilterKeyOptions: Array<{
    value: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  form: IForm;
  updateForm: (form: IForm) => void;
}

export const useAppStore = create<IAppStore>((set) => ({
  mode: EMode.MAP,
  setMode: (mode) => set({ mode }),
  mapData: [],
  countryOptions: [],
  interventionOptions: [],
  popluationOptions: [],
  subFilterKeyOptions: [],
  form: {
    countries: [],
    intervention: "All",
    subFilterKey: "TOTAL",
    subFilterValue: "NA",
  },
  updateForm: (form) => {
    set({
      form,
    });
  },
  updateMap: async () => {
    const data: Array<IData["details"]> = await fetch(
      `${
        process.env.NODE_ENV === "development" ? "" : "/vax-track"
      }/data/world-data.json`
    ).then((res) => res.json());
    const countries = Array.from(
      new Set(data.map((details) => details.country))
    );
    const interventions = Array.from(
      new Set(data.map((details) => details.intervention))
    );
    const popluations = Array.from(
      new Set(data.map((details) => details.population))
    );
    const subFilterKeys = Array.from(
      new Set(data.map((details) => details.subFilterKey))
    );

    set({
      countryOptions: countries.map((country) => ({
        value: country,
        label: country,
        cities: Array.from(
          new Set(
            data
              .filter((details) => details.country === country)
              .map((details) => details.city)
          )
        ).map((city) => ({ value: city, label: city })),
      })),
      interventionOptions: interventions.concat("All").map((intervention) => ({
        value: intervention,
        label: intervention,
      })),
      popluationOptions: popluations.map((population) => ({
        value: population,
        label: population,
      })),
      subFilterKeyOptions: subFilterKeys.map((key) => ({
        value: key,
        label: key,
        options: Array.from(
          new Set(
            data
              .filter((details) => details.subFilterKey === key)
              .map((details) => details.subFilterValue)
          )
        ).map((value) => ({ value, label: value })),
      })),
      form: {
        countries,
        subFilterKey: "TOTAL",
        intervention: "All",
        subFilterValue: "NA",
      },
      mapData: data.map((details) => ({
        name: details.country,
        // uptake is a string with '%' sign, so we need to remove it
        value: parseFloat(details.uptake.replace("%", "")),
        details,
      })),
    });
  },
}));
