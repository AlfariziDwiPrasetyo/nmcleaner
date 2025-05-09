import fg from "fast-glob";
import { readdir, rm } from "fs/promises";
import path from "path";

async function deleteAllNodeModules() {
  const matches = await fg("**/node_modules", {
    onlyDirectories: true,
    ignore: ["**/node_modules/**/node_modules"],
  });

  for (const dir of matches) {
    console.log(matches);
    console.log(`$Deleting ${dir}`);
    // await rm(dir, { recursive: true, force: true });
  }
}
deleteAllNodeModules();
