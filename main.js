const cache = require("@actions/cache");
const exec = require("@actions/exec");
const core = require("@actions/core");
const fs = require("fs");
const { getCacheKey } = require("./cache-key");

async function run() {
  const key = getCacheKey();
  const paths = ["the-export-file"];

  core.info(`Cache key: ${key}`);

  try {
    const cacheKey = await cache.restoreCache(paths, key);
    if (cacheKey) {
      core.info(`Cache restored from key: ${cacheKey}`);
      core.saveState("cache-hit", cacheKey === key ? "true" : "false");
    } else {
      core.info("No cache found, skipping import");
      core.saveState("cache-hit", "false");
      return;
    }
  } catch (error) {
    core.warning(`Cache restore failed: ${error.message}`);
    core.saveState("cache-hit", "false");
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
