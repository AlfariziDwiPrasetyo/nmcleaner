import { stat, readdir } from "fs/promises";
import path from "path";

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
