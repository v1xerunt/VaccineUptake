import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronRight, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

// 类型定义
export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

export type CascaderValue = string[][];

export interface CascaderProps {
  options: CascaderOption[];
  placeholder?: string;
  value?: CascaderValue;
  onChange?: (value: CascaderValue) => void;
  className?: string;
  disabled?: boolean;
}

export default function Cascader({
  options,
  placeholder = "请选择",
  value: selectedValue = [],
  onChange,
  className,
  disabled = false,
}: CascaderProps) {
  // 内部状态
  const [open, setOpen] = useState(false);
  // const [selectedValue, setSelectedValue] = useState<CascaderValue>(value);
  const [columns, setColumns] = useState<CascaderOption[][]>([options]);

  // 简单的显示文本获取函数
  const displayText = () => {
    if (selectedValue.length === 0) return placeholder;
    if (selectedValue.length === 1) {
      return getPathText(selectedValue[0]);
    }
    return `${selectedValue.length} selected`;
  };

  // 清空选择
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSelection([]);
  };

  // 更新选择并通知父组件
  const updateSelection = (newValue: CascaderValue) => {
    if (onChange) onChange(newValue);
  };

  // 获取路径的显示文本
  const getPathText = (path: string[]): string => {
    const labels: string[] = [];
    let currentOptions = options;

    for (const value of path) {
      const option = currentOptions.find((opt) => opt.value === value);
      if (!option) break;

      labels.push(option.label);
      currentOptions = option.children || [];
    }

    return labels.join(" / ");
  };

  // 检查路径是否已被选中
  const isPathSelected = (path: string[]): boolean => {
    return selectedValue.some(
      (item) =>
        item.length === path.length &&
        item.every((val, index) => val === path[index])
    );
  };

  // 递归获取所有子节点路径
  const getAllLeafPaths = (
    option: CascaderOption,
    parentPath: string[] = []
  ): string[][] => {
    const currentPath = [...parentPath, option.value];

    if (!option.children || option.children.length === 0) {
      return [currentPath];
    }

    return option.children.flatMap((child) =>
      getAllLeafPaths(child, currentPath)
    );
  };

  // 当选择一个父节点
  const handleParentSelection = (
    option: CascaderOption,
    parentPath: string[]
  ) => {
    // const currentPath = [...parentPath, option.value];

    // 检查是否所有子节点都被选中
    const hasAllChildrenSelected = isAllChildrenSelected(option, parentPath);

    let newValue: CascaderValue;

    if (hasAllChildrenSelected) {
      // 如果所有子节点已选中，取消所有选择
      const allChildPaths = getAllLeafPaths(option, parentPath);
      newValue = selectedValue.filter(
        (item) =>
          !allChildPaths.some(
            (childPath) =>
              childPath.length === item.length &&
              childPath.every((val, index) => val === item[index])
          )
      );
    } else {
      // 否则，选中所有子节点
      const allChildPaths = getAllLeafPaths(option, parentPath);

      // 移除已有的子节点路径，然后添加所有子节点路径
      const filteredValue = selectedValue.filter(
        (item) =>
          !allChildPaths.some(
            (childPath) =>
              childPath.length === item.length &&
              childPath.every((val, index) => val === item[index])
          )
      );

      newValue = [...filteredValue, ...allChildPaths];
    }

    updateSelection(newValue);
  };

  // 检查是否所有子节点都被选中
  const isAllChildrenSelected = (
    option: CascaderOption,
    parentPath: string[]
  ): boolean => {
    if (!option.children || option.children.length === 0) return false;

    const allChildPaths = getAllLeafPaths(option, parentPath);
    return allChildPaths.every((childPath) => isPathSelected(childPath));
  };

  // 检查是否有部分子节点被选中
  const isPartiallySelected = (
    option: CascaderOption,
    parentPath: string[]
  ): boolean => {
    if (!option.children || option.children.length === 0) return false;

    const allChildPaths = getAllLeafPaths(option, parentPath);
    const hasAnySelected = allChildPaths.some((childPath) =>
      isPathSelected(childPath)
    );
    const hasAllSelected = allChildPaths.every((childPath) =>
      isPathSelected(childPath)
    );

    return hasAnySelected && !hasAllSelected;
  };

  // 切换叶子节点的选择状态
  const toggleLeafSelection = (path: string[]) => {
    const isSelected = isPathSelected(path);
    let newValue;

    if (isSelected) {
      // 如果已选中，则移除
      newValue = selectedValue.filter(
        (item) =>
          !(
            item.length === path.length &&
            item.every((val, index) => val === path[index])
          )
      );
    } else {
      // 如果未选中，则添加
      newValue = [...selectedValue, [...path]];
    }

    updateSelection(newValue);
  };

  // 处理选项点击
  const handleOptionClick = (option: CascaderOption, level: number) => {
    if (option.disabled) return;

    // 更新列
    const newColumns = [...columns.slice(0, level + 1)];
    if (option.children && option.children.length > 0) {
      newColumns.push(option.children);
    }
    setColumns(newColumns);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        // 重置列显示
        if (val) setColumns([options]);
      }}
    >
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between",
              selectedValue.length > 0 ? "" : "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled}
          >
            <span className="truncate">{displayText()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>

          {selectedValue.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 p-0 rounded-full"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 flex flex-col">
        <div className="flex border-b border-border">
          {columns.map((columnOptions, colIndex) => {
            // 当前路径
            const currentPath = getPathForColumn(colIndex, columns);

            return (
              <div
                key={`col-${colIndex}`}
                className={cn(
                  "max-h-[300px] overflow-auto min-w-[160px]",
                  colIndex > 0 && "border-l border-border"
                )}
              >
                {columnOptions.map((option) => {
                  // 该选项的完整路径
                  const optionPath = [...currentPath, option.value];
                  // 是否为叶子节点
                  const isLeaf =
                    !option.children || option.children.length === 0;

                  // 父节点状态
                  const isParentFullySelected =
                    !isLeaf && isAllChildrenSelected(option, currentPath);
                  const isParentPartiallySelected =
                    !isLeaf && isPartiallySelected(option, currentPath);

                  // 叶子节点状态
                  const isLeafSelected = isLeaf && isPathSelected(optionPath);

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex items-center px-2 py-1.5 text-sm hover:bg-muted cursor-pointer",
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleOptionClick(option, colIndex)}
                    >
                      <div className="flex items-center w-full">
                        {/* 为所有节点显示复选框 */}
                        <div
                          className="mr-2 h-4 w-4 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!option.disabled) {
                              if (isLeaf) {
                                toggleLeafSelection(optionPath);
                              } else {
                                handleParentSelection(option, currentPath);
                              }
                            }
                          }}
                        >
                          <div
                            className={cn(
                              "h-4 w-4 rounded border border-primary flex items-center justify-center",
                              (isLeafSelected || isParentFullySelected) &&
                                "bg-primary"
                            )}
                          >
                            {isParentPartiallySelected && (
                              <div className="h-2 w-2 bg-primary rounded-sm" />
                            )}
                            {(isLeafSelected || isParentFullySelected) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                        </div>

                        <span className="flex-grow truncate">
                          {option.label}
                        </span>

                        {!isLeaf && (
                          <ChevronRight className="h-4 w-4 ml-2 opacity-50" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="p-2 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSelection([])}
            disabled={selectedValue.length === 0}
          >
            Clear
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 工具函数: 根据当前列索引获取前面所有列的路径
function getPathForColumn(
  colIndex: number,
  columns: CascaderOption[][]
): string[] {
  const path: string[] = [];

  // 第一列没有前置路径
  if (colIndex === 0) return path;

  // 获取前面每一列选中的值
  for (let i = 0; i < colIndex; i++) {
    // 找到第i+1列的来源选项在第i列中的值
    const sourceColumn = columns[i];
    const targetColumn = columns[i + 1];

    // 找到产生目标列的那个选项
    const sourceOption = sourceColumn.find(
      (opt) =>
        opt.children &&
        JSON.stringify(opt.children) === JSON.stringify(targetColumn)
    );

    if (sourceOption) {
      path.push(sourceOption.value);
    } else {
      // 找不到对应关系，使用默认方法
      const firstOption = sourceColumn[0];
      if (firstOption) path.push(firstOption.value);
    }
  }

  return path;
}
