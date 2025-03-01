"use client";
import { useAppStore } from "@/store/app";
import config from "@/app/assets/config.json";
import { useEffect } from "react";
import WorldMap from "@/components/WorldMap";
import DataTable from "@/components/DataTable";

export default function Page() {
  const updateMap = useAppStore((s) => s.updateMap);

  useEffect(() => {
    updateMap();
  }, [updateMap]);

  return (
    <div className="flex flex-1">
      <WorldMap loadingText={config.loadingText} />
      <DataTable />
    </div>
  );
}
