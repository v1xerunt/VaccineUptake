import { useAppStore } from "@/store/app";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

export const useMapData = () => {
  const { mapData, form } = useAppStore(
    useShallow((s) => {
      return {
        mapData: s.mapData,
        form: s.form,
      };
    })
  );

  const filteredMapData = useMemo(() => {
    return mapData.filter((d) => {
      if (!form.countries.includes(d.details.country)) return false;
      if (!form.cities?.length) {
        if (d.details.city !== "NA") return false;
      }
      if (form.cities && !form.cities.includes(d.details.city)) return false;
      if (
        form.intervention !== "All" &&
        form.intervention !== d.details.intervention
      )
        return false;
      if (
        form.populations?.length &&
        !form.populations.includes(d.details.population)
      )
        return false;

      if (form.subFilterKey !== d.details.subFilterKey) return false;
      if (
        form.subFilterValue &&
        form.subFilterValue !== d.details.subFilterValue
      )
        return false;
      return true;
    });
  }, [mapData, form]);

  return filteredMapData;
};
