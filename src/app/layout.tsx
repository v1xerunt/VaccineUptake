import { FilterTabs } from "@/components/filter-tabs";
import ModeSwitch from "../components/ModeSwitch";
import { FilterPanel } from "../components/SearchFilter";
import config from "@/app/assets/config.json";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <div className="flex flex-col h-screen">
          <div className="p-4 bg-zinc-100 space-y-4">
            <header className="flex justify-between">
              <h1 className="text-2xl font-bold text-center">{config.title}</h1>
              <FilterTabs />
              <div className="flex items-center gap-4">
                <ModeSwitch />
                <Button>
                  <a href="/data/raw/data.csv" download>
                    Download CSV
                  </a>
                </Button>
              </div>
            </header>
          </div>
          <div className="flex-1 flex">
            <FilterPanel />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
