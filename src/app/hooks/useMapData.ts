import { useAppStore } from "@/store/app";
import { InterventionType } from "@/types/app";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const useMapData = (type: InterventionType) => {
  const { mapData, form, setOptions, updateForm } = useAppStore(
    useShallow((s) => {
      return {
        mapData: s.mapData,
        form: s.form,
        setOptions: s.setOptions,
        updateForm: s.updateForm,
      };
    })
  );

  const [hasUpdateOptions, setHasUpdateOptions] = useState(false);

  const currentInterVentionMapData = useMemo(
    () => mapData.filter((d) => d.details.intervention === type),
    [mapData, type]
  );

  const filteredMapData = useMemo(() => {
    return currentInterVentionMapData.filter((d) => {
      if (
        form.countries.length &&
        form.countries.every(
          ([country, city]) =>
            country !== d.details.country || city !== d.details.city
        )
      )
        return false;

      if (
        form.populations?.length &&
        !form.populations.includes(d.details.population)
      )
        return false;
      if (form.studies?.length && !form.studies.includes(d.details.study))
        return false;
      if (form.health?.length && !form.health.includes(d.details.healthStatus))
        return false;
      if (form.settings?.length && !form.settings.includes(d.details.setting))
        return false;
      if (form.subFilterKey !== d.details.subFilterKey) return false;
      if (
        form.subFilterValue &&
        form.subFilterValue !== d.details.subFilterValue
      )
        return false;
      return true;
    });
  }, [currentInterVentionMapData, form]);

  const updateOpitons = useCallback(() => {
    const countries = Array.from(
      new Set(currentInterVentionMapData.map(({ details }) => details.country))
    );
    const interventions = Array.from(
      new Set(
        currentInterVentionMapData.map(({ details }) => details.intervention)
      )
    );
    const popluations = Array.from(
      new Set(
        currentInterVentionMapData.map(({ details }) => details.population)
      )
    );
    const subFilterKeys = Array.from(
      new Set(
        currentInterVentionMapData.map(({ details }) => details.subFilterKey)
      )
    );
    const studys = Array.from(
      new Set(currentInterVentionMapData.map(({ details }) => details.study))
    );
    const healths = Array.from(
      new Set(
        currentInterVentionMapData.map(({ details }) => details.healthStatus)
      )
    );
    const settings = Array.from(
      new Set(currentInterVentionMapData.map(({ details }) => details.setting))
    );

    const countryOptions = countries.map((country) => ({
      value: country,
      label: country,
      cities: Array.from(
        new Set(
          currentInterVentionMapData
            .filter(({ details }) => details.country === country)
            .map(({ details }) => details.city)
        )
      ).map((city) => ({ value: city, label: city })),
    }));
    setOptions({
      countryOptions,
      interventionOptions: interventions.concat("All").map((intervention) => ({
        value: intervention,
        label: intervention,
      })),
      popluationOptions: popluations.map((population) => ({
        value: population,
        label: population,
      })),
      studyOptions: studys.map((study) => ({ value: study, label: study })),
      healthOptions: healths.map((health) => ({
        value: health,
        label: health,
      })),
      settingOptions: settings.map((setting) => ({
        value: setting,
        label: setting,
      })),
      subFilterKeyOptions: subFilterKeys.map((key) => ({
        value: key,
        label: key,
        options: Array.from(
          new Set(
            currentInterVentionMapData
              .filter(({ details }) => details.subFilterKey === key)
              .map(({ details }) => details.subFilterValue)
          )
        ).map((value) => ({ value, label: value })),
      })),
    });
    updateForm({
      countries: countryOptions.reduce<Array<[string, string]>>((acc, curr) => {
        return acc.concat(curr.cities.map((city) => [curr.value, city.value]));
      }, []),
      subFilterKey: "total",
      subFilterValue: "total",
    });
  }, [currentInterVentionMapData, setOptions, updateForm]);

  useEffect(() => {
    if (!hasUpdateOptions && currentInterVentionMapData.length) {
      updateOpitons();
      setHasUpdateOptions(true);
    }
  }, [
    currentInterVentionMapData,
    updateOpitons,
    hasUpdateOptions,
    setHasUpdateOptions,
  ]);

  return { mapData: filteredMapData, resetOptions: updateOpitons };
};
