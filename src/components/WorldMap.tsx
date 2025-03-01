"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { LoadingSpinner } from "./LoadingSpinner";
import { IData } from "@/types/app";
import { EMode, useAppStore } from "@/store/app";
import { useShallow } from "zustand/react/shallow";

function transform(arr: IData[]): IData[] {
  // 用于存储每个name的数据统计
  const stats: Record<string, { sum: number; count: number }> = {};

  // 遍历原始数组，收集统计信息
  arr.forEach((item) => {
    if (!stats[item.name]) {
      // 第一次遇到这个name
      stats[item.name] = {
        sum: item.value,
        count: 1,
      };
    } else {
      // 已经遇到过这个name，更新统计信息
      stats[item.name].sum += item.value;
      stats[item.name].count += 1;
    }
  });

  // 生成结果数组，计算平均值
  return Object.keys(stats).map((name) => ({
    name,
    value: Number((stats[name].sum / stats[name].count).toFixed(2)),
    details: arr.find((item) => item.name === name)!.details,
  }));
}

interface IProps {
  loadingText: string;
  mapData: IData[];
}

export default function WorldMap({ loadingText, mapData }: IProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { shouldRender, mode } = useAppStore(
    useShallow((s) => {
      return {
        shouldRender: s.mode === EMode.MAP || s.mode === EMode.BOTH,
        mode: s.mode,
      };
    })
  );

  useEffect(() => {
    if (mode === EMode.TABLE || mapData.length === 0) return;
    let mounted = true;

    const initChart = async () => {
      if (!chartRef.current) return;

      try {
        setIsLoading(true);

        // 动态导入地图数据
        const { default: geoJson } = await import(
          /* webpackChunkName: "world-geo-data" */
          "@/app/assets/worldEN.json"
        );

        if (!mounted) return;

        // @ts-expect-error 注册地图数据
        echarts.registerMap("world", geoJson);

        // 初始化 ECharts 实例
        chartInstance.current = echarts.init(chartRef.current);

        const option = {
          backgroundColor: "#ffffff",
          tooltip: {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params: {
              name: string;
              value: number;
              data: IData;
            }) {
              const { name, value, data } = params;
              if (!data.details) return name;

              if (mapData.length === 1) {
                return `  
                <div style="font-weight: bold; margin-bottom: 5px;">${name}</div>  
                <div>uptake: ${value + "%"}</div>
                `;
              }

              return (
                `  
                <div style="font-weight: bold; margin-bottom: 5px;">${name}</div>  
                <div>uptake: ${value + "%"}</div>
                <br />
                ` +
                mapData
                  .filter((item) => item.name === name)
                  .map(
                    (item) => `
                      <div>${item.details.city}: ${item.details.uptake}</div>
                    `
                  )
                  .join("")
              );
            },
          },
          visualMap: {
            left: "right",
            min: 0,
            max: 100,
            inRange: {
              color: ["#e5f7ff", "#096dd9"],
            },
            text: ["heigh", "low"],
            calculable: true,
            dimension: 0,
            orient: "vertical",
            right: 26,
            bottom: 40,
            show: false,
          },
          series: [
            {
              name: "World Map",
              type: "map",
              map: "world",
              roam: true,
              scaleLimit: {
                min: 1,
                max: 10,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 18,
                  color: "#333",
                },
                itemStyle: {
                  areaColor: "#40a9ff",
                },
              },
              select: {
                label: {
                  show: true,
                  color: "#fff",
                },
                itemStyle: {
                  areaColor: "#1890ff",
                },
              },
              itemStyle: {
                areaColor: "#f0f2f5",
                borderColor: "#d9d9d9",
                borderWidth: 1,
              },
              data: transform(mapData),
            },
          ],
        };

        // 设置配置项
        chartInstance.current.setOption(option);

        // 添加事件监听
        // chartInstance.current.on("click", function (params: any) {
        //   if (params.componentType === "series") {
        //     const data = params.data;
        //     if (data?.details) {
        //       alert(`
        //         国家: ${params.name}
        //         医疗指数: ${data.value}
        //         人口: ${data.details.population}
        //         医生数量: ${data.details.doctors}
        //         医院数量: ${data.details.hospitals}
        //       `);
        //     } else {
        //       alert(`国家: ${params.name}\n暂无详细数据`);
        //     }
        //   }
        // });

        setIsLoading(false);
      } catch (err) {
        console.error("Chart initialization error:", err);
        setError(err instanceof Error ? err.message : "unknow error");
        setIsLoading(false);
      }
    };

    initChart();

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [mode, mapData]);

  if (!shouldRender) {
    return null;
  }

  if (error) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <div className="text-red-500">错误: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-full grow-[2] shrink-[2] basis-0 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <LoadingSpinner loadingText={loadingText} />
        </div>
      )}
      <div
        ref={chartRef}
        className="w-full h-full max-h-screen min-h-[500px]"
      />
    </div>
  );
}
