"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EMode, useAppStore } from "@/store/app";
import { useShallow } from "zustand/react/shallow";

const ModeSwitch = () => {
  const { mode, setMode } = useAppStore(
    useShallow((s) => ({
      mode: s.mode,
      setMode: s.setMode,
    }))
  );
  return (
    <div className="flex items-center space-x-4">
      <label>Display Mode:</label>
      <Tabs value={mode} onValueChange={(v) => setMode(v as EMode)}>
        <TabsList className="bg-zinc-200 cursor-pointer">
          <TabsTrigger value={EMode.MAP}>Map Only</TabsTrigger>
          <TabsTrigger value={EMode.TABLE}>Data Table</TabsTrigger>
          <TabsTrigger value={EMode.BOTH}>Both</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
export default ModeSwitch;
