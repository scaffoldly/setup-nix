const exec = require("@actions/exec");
const core = require("@actions/core");
const path = require("path");

async function run() {
  // GITHUB_ACTION_PATH points to the action's directory
  const actionPath = process.env.GITHUB_ACTION_PATH || __dirname;
  const scriptPath = path.join(actionPath, "install-nix.sh");

  // Set up environment variables for the install script
  const env = {
    ...process.env,
    INPUT_ENABLE_KVM: core.getInput("enable-kvm") || "false",
    INPUT_SET_AS_TRUSTED_USER: core.getInput("set-as-trusted-user") || "true",
    GITHUB_TOKEN: core.getInput("github-token") || "",
    INPUT_EXTRA_NIX_CONFIG: core.getInput("extra-nix-config") || "",
    INPUT_INSTALL_OPTIONS: core.getInput("install-options") || "",
    INPUT_INSTALL_URL: core.getInput("install-url") || "",
    INPUT_NIX_PATH: core.getInput("nix-path") || "",
  };

  try {
    await exec.exec("bash", [scriptPath], { env });
    core.info("Nix installation completed successfully");
  } catch (error) {
    core.setFailed(`Nix installation failed: ${error.message}`);
  }
}

run();
