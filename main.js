const cache = require("@actions/cache");
const exec = require("@actions/exec");
const core = require("@actions/core");
const fs = require("fs");

async function run() {
  const key = `nix-store-${process.env.RUNNER_OS}`;
  const paths = ["the-export-file"];

  try {
    const cacheKey = await cache.restoreCache(paths, key);
    if (cacheKey) {
      core.info(`Cache restored from key: ${cacheKey}`);
    } else {
      core.info("No cache found, skipping import");
      return;
    }
  } catch (error) {
    core.warning(`Cache restore failed: ${error.message}`);
    return;
  }

  if (!fs.existsSync("the-export-file")) {
    core.info("No export file found, skipping import");
    return;
  }

  try {
    await exec.exec("nix-store", ["--import"], {
      input: fs.readFileSync("the-export-file"),
    });
    core.info("Nix store imported successfully");
  } catch (error) {
    core.warning(`Nix store import failed: ${error.message}`);
  }
}

run();
