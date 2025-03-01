"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const vaccineTypes = [
  { link: "/nirsevimab", tab: "Nirsevimab" },
  { link: "/older-adults", tab: "RSV vaccine for older adults" },
  { link: "/maternal", tab: "RSV maternal vaccine" },
];

export function FilterTabs() {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center rounded-lg border bg-card p-1 text-card-foreground shadow-sm">
      {vaccineTypes.map((type) => (
        <Link
          key={type.link}
          href={type.link}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            pathname === type.link
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {type.tab}
        </Link>
      ))}
    </div>
  );
}
