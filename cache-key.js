function getCacheKey() {
  const os = process.env.RUNNER_OS || "unknown";
  return `${os}-nix-store`;
}

module.exports = { getCacheKey };
