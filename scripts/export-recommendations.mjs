import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { recommendations } from "../src/data/recommendations.ts";

const destination = resolve("recommendations.json");
const payload = JSON.stringify({ recommendations }, null, 2);

await writeFile(destination, `${payload}\n`, "utf8");
console.log(`Exported ${recommendations.length} recommendations to ${destination}`);
