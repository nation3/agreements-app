# Nation3 Court Smart Contracts

## Development

### Build & test

[Install Foundry](https://book.getfoundry.sh/getting-started/installation.html), (assuming a Linux or macOS system):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Install dependencies, build, and run tests with coverage:

```bash
make
```

Generate code coverage HTML report:
```
forge coverage --report lcov
brew install lcov
genhtml lcov.info -o coverage
```
Then open coverage/index.html in a browser.

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

## Deployment

Start by copying and reviewing the `.env.sample` to your own `env`.

### Deploy check & local

Start Anvil node:
```bash
anvil
```

Simulate deploy:
```bash
yarn deploy:check
```

Deploy to local Anvil node:
```bash
yarn deploy:local
```

### Deploy to any chain

!Warning: Only do this if you are familiar with the deployment script.

Simulate deploy:
```bash
forge script DeployAgreements --rpc-url ${RPC_URL} --private-key ${DEPLOYER_PRIVATE_KEY} --optimize --optimizer-runs 2000 -vvvv --ffi
```

Standard deploy:
```bash
forge script DeployAgreements --rpc-url ${RPC_URL} --private-key ${DEPLOYER_PRIVATE_KEY} --optimize --optimizer-runs 2000 -vvv --ffi --broadcast
```

Deploy with verification:
```bash
forge script DeployAgreements --rpc-url ${RPC_URL} --private-key ${DEPLOYER_PRIVATE_KEY} --optimize --optimizer-runs 2000 -vvv --ffi --broadcast --verify --retries 10
```
For more info see [Foundry Deploying and Verifying](https://book.getfoundry.sh/forge/deploying).

### Verifying troubleshooting

Sometimes Foundry's built-in verification doesn't work properly and you will need to manually verify the smart contract with other method.
We found that the best way to do it is using Solidity [Standard JSON-Input](https://docs.soliditylang.org/en/v0.8.17/using-the-compiler.html?highlight=input#input-description) format.

Getting the Json-Input file with Foundry is not very intuitive.
To do so you need to use the `--build-info` & `--build-info-path` options on build or deploy.
This options generate a JSON file with all the build info. From that JSON you can extract the `input` section using some JSON processor such as [jq](https://stedolan.github.io/jq/) `jq .input ${build-file} > input.json`.
Finally you should review this file to remove any source that is not relevant for the contract you are trying to verify.

To save you from this we keep a curated version of the input artifacts under the `build-inputs` directory that you should be able to use out of the box or quickly modify to verify this smart contracts.

Shortcut to get latest input file (not cleaned):
```
rm -r build-info;
forge build --force --optimize --optimizer-runs 2000 --build-info --build-info-path build-info;
jq .input build-info/*.json > input.json;
rm -r build-info;
```
