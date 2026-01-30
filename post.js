const cache = require("@actions/cache");
const exec = require("@actions/exec");
const core = require("@actions/core");
const { getCacheKey } = require("./cache-key");

async function run() {
  const key = getCacheKey();
  const paths = ["the-export-file"];

  core.info(`Cache key: ${key}`);

  try {
    await exec.exec("bash", [
      "-c",
      "nix-store --export $(nix path-info --all) > the-export-file",
    ]);
    core.info("Nix store exported successfully");
  } catch (error) {
    core.setFailed(`Nix store export failed: ${error.message}`);
    return;
  }

  try {
    await cache.saveCache(paths, key);
    core.info(`Cache saved with key: ${key}`);
  } catch (error) {
    if (error.message.includes("already exists")) {
      core.info("Cache already exists, skipping save");
    } else {
      core.warning(`Cache save failed: ${error.message}`);
    }
  }
}

run();
