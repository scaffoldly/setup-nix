const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function findFlakeLocks(dir, files = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findFlakeLocks(fullPath, files);
      } else if (entry.name === "flake.lock") {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  return files;
}

function getCacheKey() {
  const os = process.env.RUNNER_OS || "unknown";

  const files = findFlakeLocks("/nix/store");
  files.sort();

  const hash = crypto.createHash("sha256");
  for (const file of files) {
    try {
      const content = fs.readFileSync(file);
      hash.update(content);
    } catch (error) {
      // Skip files we can't read
    }
  }

  const hashHex = hash.digest("hex").substring(0, 16);
  return `${os}-nix-store-${hashHex}`;
}

module.exports = { getCacheKey };
