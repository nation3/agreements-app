#!/bin/bash

# load .env vars into env
. ./.env

# Deploy and verify contracts, if verification fails, increase delay & retries
RUST_LOG=trace forge script script/CollateralAgreementDeployer.s.sol:DeployCollateralAgreement --rpc-url $RPC_URL  \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --delay 20 \
    --retries 5 \
    --chain-id $CHAIN_ID \
    --etherscan-api-key $ETHERSCAN_KEY -vvvvv 
