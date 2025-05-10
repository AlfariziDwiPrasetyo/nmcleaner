#!/usr/bin/env bun

import { Command } from "commander";
import path from "path";
import { deleteAllNodeModules } from "../src/core/cleaner";

const program = new Command();

program
  .name("nmclean")
  .description("Clean all node_modules recursively")
  .argument("[target]", "Target directory", ".")
  .option("--dry-run", "Do not delete, only print")
  .option("-f, --force", "Ignore permission errors")
  .parse(process.argv);

const options = program.opts();
const target = program.args[0] || ".";
const resolvedPath = path.resolve(target);

deleteAllNodeModules(resolvedPath, options.dryRun, options.force);
