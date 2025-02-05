"use client";
import { useAppStore } from "@/store/app";
import DataTable from "./components/DataTable";
import ModeSwitch from "./components/ModeSwitch";
import SearchFilter from "./components/SearchFilter";
import WorldMap from "./components/WorldMap";
import config from "@/app/assets/config.json";
import { useEffect } from "react";

export default function Page() {
  const updateMap = useAppStore((s) => s.updateMap);

  useEffect(() => {
    updateMap();
  }, [updateMap]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-zinc-100 space-y-4">
        <header className="flex justify-between">
          <h1 className="text-2xl font-bold text-center">{config.title}</h1>
          <SearchFilter />
          <ModeSwitch />
        </header>
      </div>

      <div className="flex flex-1">
        <WorldMap loadingText={config.loadingText} />
        <DataTable />
      </div>
    </div>
  );
}
