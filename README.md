# Nation3 Court

## Development

### Solidity tests & build

[Install Foundry](https://book.getfoundry.sh/getting-started/installation.html), (assuming a Linux or macOS system):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Install dependencies:
```bash
forge install
```

Run solidity tests:
```
forge test
```

### Linters

Install dependencies:
```
yarn install
```

Run linter checks:
```
yarn lint:check
```

Automatic linter fix:
```
yarn lint:fix
```
