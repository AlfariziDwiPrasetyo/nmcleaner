import chalk from "chalk";
import { rm } from "fs/promises";
import { byteToMegabyte, getFolderSize, scanForNodeModules } from "../utils";
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

  const matches = await scanForNodeModules(basePath, force);

  if (matches.length == 0) {
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
      await rm(dir, { recursive: true, force: true });
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
