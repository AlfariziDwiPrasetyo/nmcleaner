import chalk from "chalk";
import fg from "fast-glob";
import { stat, readdir } from "fs/promises";
import path from "path";

export async function scanForNodeModules(
  basePath: string = ".",
  force: boolean = false
): Promise<string[]> {
  try {
    const matches = await fg("**/node_modules", {
      cwd: basePath,
      onlyDirectories: true,
      ignore: ["**/node_modules/**/node_modules"],
      suppressErrors: force,
    });

    if (matches.length === 0) {
      console.log(chalk.yellow("⚠️  No node_modules folders found."));
      console.log();
      return [];
    }

    return matches;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("An unknown error occurred.");
    }

    return [];
  }
}

export async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0;

  try {
    const items = await readdir(folderPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(folderPath, item.name);

      if (item.isDirectory()) {
        totalSize += await getFolderSize(fullPath);
      } else if (item.isFile()) {
        const fileStat = await stat(fullPath);
        totalSize += fileStat.size;
      }
    }
  } catch (err: any) {
    if (err.code === "EACCES" || err.code === "EPERM") {
      return 0;
    }
    throw err;
  }

  return totalSize;
}

export function byteToMegabyte(byte: number) {
  return (byte / 1_048_576).toFixed(2);
}
