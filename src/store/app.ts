import { create } from "zustand";
import { IData } from "@/types/app";

export enum EMode {
  MAP = "MapOnly",
  TABLE = "DataTable",
  BOTH = "Both",
}

export interface IForm {
  countries: string[];
  showCities: boolean;
  studies?: string[];
  health?: string[];
  settings?: string[];
  populations?: string[];
  subFilterKey: string;
  subFilterValue: string;
}
export interface IAppStore {
  mode: EMode;
  setMode: (mode: EMode) => void;
  mapData: IData[];
  originalData: Array<IData["details"]>;
  updateMap: () => void;
  countryOptions: Array<{
    value: string;
    label: string;
    cities: Array<{ value: string; label: string }>;
  }>;
  interventionOptions: Array<{ value: string; label: string }>;
  popluationOptions: Array<{ value: string; label: string }>;
  studyOptions: Array<{ value: string; label: string }>;
  healthOptions: Array<{ value: string; label: string }>;
  settingOptions: Array<{ value: string; label: string }>;
  subFilterKeyOptions: Array<{
    value: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  form: IForm;
  updateForm: (form: IForm) => void;
  updateSingleFormItem: <T extends keyof IForm>(
    key: T,
    value: IForm[T]
  ) => void;
  setOptions: (options: {
    countryOptions: IAppStore["countryOptions"];
    interventionOptions: IAppStore["interventionOptions"];
    popluationOptions: IAppStore["popluationOptions"];
    subFilterKeyOptions: IAppStore["subFilterKeyOptions"];
    studyOptions: IAppStore["studyOptions"];
    healthOptions: IAppStore["healthOptions"];
    settingOptions: IAppStore["settingOptions"];
  }) => void;
}

export const useAppStore = create<IAppStore>((set) => ({
  mode: EMode.MAP,
  setMode: (mode) => set({ mode }),
  mapData: [],
  originalData: [],
  countryOptions: [],
  interventionOptions: [],
  popluationOptions: [],
  studyOptions: [],
  healthOptions: [],
  settingOptions: [],
  subFilterKeyOptions: [],
  form: {
    countries: [],
    showCities: false,
    subFilterKey: "total",
    subFilterValue: "total",
  },
  updateForm: (form) => {
    set({
      form,
    });
  },
  updateSingleFormItem: (key, value) => {
    set((state) => ({
      form: {
        ...state.form,
        [key]: value,
      },
    }));
  },
  setOptions: (options) => {
    set({
      ...options,
    });
  },
  updateMap: async () => {
    const data: Array<IData["details"]> = await fetch(
      `${
        process.env.NODE_ENV === "development" ? "" : "/VaccineUptake"
      }/data/world-data.json`
    ).then((res) => res.json());

    set({
      originalData: data,
      mapData: data.map((details) => ({
        name: details.country,
        // uptake is a string with '%' sign, so we need to remove it
        value: parseFloat(details.uptake.replace("%", "")),
        details,
      })),
    });
  },
}));
