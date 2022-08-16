// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import { MockERC20, ERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { CollateralAgreementFramework } from "../src/agreements/CollateralAgreement.sol";

contract DeployCollateralAgreement is Script {
    function run() public {
        address arbitrator = address(0x0);

        vm.startBroadcast();

        address collateral = address(new MockERC20("Court Token", "CT", 18));

        new CollateralAgreementFramework(ERC20(collateral), arbitrator);

        vm.stopBroadcast();
    }
}
