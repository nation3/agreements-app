# Nation3 Court

## Development

### Solidity build & test

[Install Foundry](https://book.getfoundry.sh/getting-started/installation.html), (assuming a Linux or macOS system):

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Install dependencies:

```bash
forge install
```

Build contracts:

```bash
forge build
```

Run solidity tests:

```
forge test
```

### Deploy local

Start Anvil node:

```bash
anvil
```

Deploy to local Anvil node:

```bash
yarn deploy:local
```

Or deploy to custom local node:

```bash
forge script script/CollateralAgreementDeployer.s.sol:DeployCollateralAgreement --rpc-url ${RPC_URL} --private-key ${PRIVATE_KEY} --broadcast
```

You can also deploy and verify the contracts by using the script:

copy `.env.example` to `.env` and set environment variables

make deployment script executable `chmod +x deploy.sh` and run it with

```bash
./deploy.sh
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
