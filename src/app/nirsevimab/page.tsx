"use client";
import config from "@/app/assets/config.json";
import WorldMap from "@/components/WorldMap";
import DataTable from "@/components/DataTable";
import { useMapData } from "../hooks/useMapData";
import { InterventionType } from "@/types/app";

export default function Page() {
  const { mapData } = useMapData(InterventionType.NIRSEVIMAB);
  return (
    <div className="flex flex-1">
      <WorldMap loadingText={config.loadingText} mapData={mapData} />
      <DataTable mapData={mapData} />
    </div>
  );
}
