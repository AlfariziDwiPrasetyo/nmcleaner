import chalk from "chalk";
import fg from "fast-glob";
import { rm } from "fs/promises";
import { byteToMegabyte, getFolderSize } from "../utils";
import path from "path";

export async function deleteAllNodeModules(
  basePath: string = ".",
  dryRun: boolean = false,
  force: boolean = false
) {
  console.log();
  console.log(chalk.bold.blue("🧹 Node Modules Cleaner"));
  console.log(chalk.dim("=".repeat(40)));
  console.log();
  console.log(chalk.blue("📁 Scanning in:"), chalk.underline(basePath));
  console.log();

  const matches = await fg("**/node_modules", {
    cwd: basePath,
    onlyDirectories: true,
    ignore: ["**/node_modules/**/node_modules"],
    absolute: true,
    suppressErrors: force,
  });

  if (matches.length === 0) {
    console.log(chalk.yellow("⚠️  No node_modules folders found."));
    console.log();
    return;
  }

  console.log(
    chalk.green(`✅ Found ${matches.length} node_modules folder(s):`)
  );
  console.log();

  matches.forEach((dir, i) => {
    console.log(chalk.gray(`  ${i + 1}. ${dir}`));
  });

  console.log();
  console.log(chalk.magenta("🚀 Starting deletion process..."));
  console.log();

  let total = 0;

  for (const dir of matches) {
    const size = await getFolderSize(path.resolve(basePath, dir));
    total += size;
    const label = dryRun ? chalk.yellow("[Dry-run]") : "";
    console.log(`${label} ${chalk.cyan("🗑️  Deleting:")} ${chalk.gray(dir)}`);

    if (!dryRun) {
      //   await rm(dir, { recursive: true, force: true });
    }
  }

  console.log();
  console.log(
    chalk.greenBright(
      `\n🎉 Cleanup finished. Total size: ${byteToMegabyte(total)} MB`
    )
  );
  console.log();
}
