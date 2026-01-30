const core = require("@actions/core");

function getCacheKey() {
  return core.getInput("key") || `${process.env.RUNNER_OS || "unknown"}-nix-store`;
}

module.exports = { getCacheKey };
