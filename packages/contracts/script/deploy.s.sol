// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { Script, console } from "forge-std/Script.sol";
import { DeploymentUtils } from "./DeploymentUtils.sol";

import { MockERC20, ERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { Arbitrator } from "nation3-court/Arbitrator.sol";
import { CollateralAgreementFramework } from "nation3-court/agreements/CollateralAgreement.sol";

contract DeployAgreements is Script, DeploymentUtils {

    /// Environment variables
    uint256 DISPUTE_FEE = 0;
    uint256 APPEAL_FEE = 0;
    uint256 RESOLUTION_LOCK_PERIOD = 6666;

    function mockToken() internal {
        MockERC20 token = new MockERC20("Court Token", "CT", 18);
        token.mint(tx.origin, 314 * 1e18);

        registerContract("Token", address(token));
    }

    function setUpArbitrator() internal {
        ERC20 feeToken = ERC20(registeredContractsAddress["Token"]);

        Arbitrator arbitrator = new Arbitrator();
        arbitrator.setUp(feeToken, APPEAL_FEE, RESOLUTION_LOCK_PERIOD, true);

        registerContract("Arbitrator", address(arbitrator));
    }

    function setUpFramework() internal {
        ERC20 token = ERC20(registeredContractsAddress["Token"]);
        address arbitrator = registeredContractsAddress["Arbitrator"];

        CollateralAgreementFramework framework = new CollateralAgreementFramework();
        framework.setUp(token, token, arbitrator, DISPUTE_FEE);

        registerContract("CollateralAgreementFramework", address(framework));
    }

    function setUpContracts() internal {
        if(registeredContractsAddress["Token"] == address(0))
            mockToken();

        setUpArbitrator();
        setUpFramework();
    }

    function storeDeploymentManifest() internal {
        string memory manifest = generateRegisteredContractsJson();

        mkdir(deploymentsPath(""));

        vm.writeFile(deploymentsPath("latest.json"), manifest);

        console.log("Stored deployment manifest at %s.", deploymentsPath("latest.json"));
    }

    function run() public {

        vm.startBroadcast();

        setUpContracts();

        vm.stopBroadcast();

        logDeployments();

        storeDeploymentManifest();
    }
}
