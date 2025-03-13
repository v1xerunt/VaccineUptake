import { FilterTabs } from "@/components/filter-tabs";
import ModeSwitch from "../components/ModeSwitch";
import { FilterPanel } from "../components/SearchFilter";
import config from "@/app/assets/config.json";
import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
                  <a
                    href={
                      process.env.NODE_ENV === "development"
                        ? "/data/raw/data.csv"
                        : "/VaccineUptake/data/raw/data.csv"
                    }
                    download
                  >
                    Download CSV
                  </a>
                </Button>
              </div>
            </header>
          </div>
          <div className="flex-1 flex">
            <FilterPanel />
            <div className="flex flex-col flex-1 p-4 overflow-hidden h-[calc(100vh-4rem)] pb-8">
              <div className="flex w-full overflow-auto pb-8">{children}</div>
              <Card className="bg-slate-50 flex-shrink-0">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm leading-relaxed">
                        Real-world uptake of nirsevimab, RSV maternal vaccine,
                        and RSV vaccines for older adults from countries that
                        have implemented RSV immunisation programmes. A protocol
                        for this study was registered on PROSPERO (registration
                        number: CRD42025643585).
                      </p>
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed">
                        Investigation team (led by Usher Institute from
                        University of Edinburgh):{" "}
                        <a
                          href="https://edwebprofiles.ed.ac.uk/profile/daira-trusinska"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >Daira Trusinska</a>, Dr. Bohee Lee, Dr. Sohail Ferdous, Harley H.Y. Kwok,{" "}
                        <a
                          href="https://www.research.ed.ac.uk/en/projects/health-data-research-uk-studentship-rebecca-gordon"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >Becky Gordon</a>,{" "}
                        <a
                          href="https://aboutme.vixerunt.org/"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >Junyi Gao</a>, Dr. Liantao Ma, Hanbiao Xiong,{" "}
                        <a
                          href="https://edwebprofiles.ed.ac.uk/profile/jurgen-schwarze"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >Prof. Jürgen Schwarze</a>,{" "}
                        <a
                          href="https://edwebprofiles.ed.ac.uk/profile/aziz-sheikh"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >Prof. Sir Aziz Sheikh</a>,
                        , Dr. John
                        Busby, Dr. Cheryl Gibbons, Dr. Simon B Drysdale, Prof.
                        Sir Lewis Ritchie, Dr. Thomas Williams,{" "}
                        <a
                          href="https://edwebprofiles.ed.ac.uk/profile/ting-shi"
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >Dr. Ting Shi</a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}