// 从geoJSON(在文件"../src/app/assets/worldEN.json"中)中获取国家名称
import path from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import * as fs from "fs";

// 获取当前模块的目录路径
const __dirname = dirname(fileURLToPath(import.meta.url));
const getCountryNames = async () => {
  // fs 读取文件
  const worldData = fs.readFileSync(
    path.join(__dirname, "../src/app/assets/worldEN.json"),
    "utf-8"
  );
  // 解析 JSON
  const worldDataJSON = JSON.parse(worldData);
  return worldDataJSON.features.map((feature) => feature.properties.name);
};

const countryNames = await getCountryNames();

if (!countryNames) {
  console.error("无法获取国家名称！");
  process.exit(1);
}

const countryNamesPath = path.join(
  __dirname,
  "../public/data/country-names.json"
);

if (fs.existsSync(countryNamesPath)) {
  fs.unlink(countryNamesPath);
}

fs.writeFileSync(
  countryNamesPath,
  JSON.stringify(countryNames, null, 2),
  "utf-8"
);
