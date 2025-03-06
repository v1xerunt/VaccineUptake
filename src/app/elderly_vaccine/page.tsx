"use client";
import config from "@/app/assets/config.json";
import WorldMap from "@/components/WorldMap";
import DataTable from "@/components/DataTable";
import { InterventionType } from "@/types/app";
import { useMapData } from "../hooks/useMapData";

export default function Page() {
  const { mapData } = useMapData(InterventionType.OLD_ADULTS);

  return (
    <div className="flex flex-1">
      <WorldMap loadingText={config.loadingText} mapData={mapData} />
      <DataTable mapData={mapData} />
    </div>
  );
}
