import * as fs from "fs";
import * as path from "path";
import { default as csv } from "csv-parser";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// 获取当前模块的目录路径
const __dirname = dirname(fileURLToPath(import.meta.url));
// 配置路径
const CSV_PATH = path.join(__dirname, "../public/data/raw/data.csv");
const JSON_OUTPUT_PATH = path.join(__dirname, "../public/data/world-data.json");

function getCountry(country) {
  if (country === "America" || country === "USA") {
    return "United States";
  }
  return country;
}

// 处理 CSV 数据的函数
async function processCSV() {
  const results = [];
  // 检查文件是否存在，存在则删除
  if (fs.existsSync(JSON_OUTPUT_PATH)) {
    fs.unlinkSync(JSON_OUTPUT_PATH);
  }
  try {
    let count = 1;
    // 读取并解析 CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on("data", (data) => {
          for (const key in data) {
            data[key.replace(/[\u200B-\u200D\uFEFF]/g, "")] = data[key].replace(
              /[\u200B-\u200D\uFEFF]/g,
              ""
            ); // 删除不可见字符
          }
          // 在这里转换数据格式
          const processedData = {
            id: String(count++),
            study: data.study,
            healthStatus: data.health_status,
            country: getCountry(data.country), // 确保列名完全匹配
            city: data.region,
            study_type: data.study_type,
            immunised: data.immunised,
            total: data.total,
            intervention: data.intervention,
            population: data.overall_age,
            setting: data.setting,
            CI_lower: data.CI_lower,
            CI_upper: data.CI_upper,
            uptake: data.uptake,
          };
          if (!processedData.country) return;
          results.push(processedData);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // 写入 JSON 文件
    fs.writeFileSync(
      JSON_OUTPUT_PATH,
      JSON.stringify(
        results.sort((a, b) =>
          a.study === "Pooled uptake"
            ? -1
            : b.study === "Pooled uptake"
            ? 1
            : -1
        ),
        null,
        2
      ),
      "utf-8"
    );

    console.log("数据处理完成！");
    console.log(`输出文件: ${JSON_OUTPUT_PATH}`);
  } catch (error) {
    console.error("处理数据时出错:", error);
    process.exit(1);
  }
}

// 运行处理脚本
processCSV();
