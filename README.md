# Setup Nix Action

GitHub Action to install Nix and cache the Nix store.

## Usage

```yaml
- uses: scaffoldly/setup-nix@main
```

## Features

- Installs Nix on the GitHub Actions runner
- Caches and restores the Nix store between runs
- Configures flakes and nix-command by default

## Inputs

| Input                 | Description                                                 | Default                                                                |
| --------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| `github-token`        | GitHub token for API rate limits                            | `${{ github.token }}`                                                  |
| `cache-key`           | Cache key                                                   | `${{ runner.os }}-nix-store-${{ hashFiles('**/*.nix', '**/*.lock') }}` |
| `enable-kvm`          | Enable KVM for hardware-accelerated virtualization on Linux | `true`                                                                 |
| `set-as-trusted-user` | Add user to trusted-users in nix.conf                       | `true`                                                                 |
| `extra-nix-config`    | Additional nix.conf configuration                           |                                                                        |
| `install-options`     | Additional options for the Nix installer                    |                                                                        |
| `install-url`         | Custom URL for the Nix installer script                     |                                                                        |
| `nix-path`            | Custom NIX_PATH to set                                      |                                                                        |

## Example

```yaml
name: Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: scaffoldly/setup-nix@main
      - run: nix build
```

## License

MIT
