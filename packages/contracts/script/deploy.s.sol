// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { Script, console } from "forge-std/Script.sol";
import { DeploymentUtils } from "./DeploymentUtils.sol";

import { MockERC20, ERC20 } from "solmate/src/test/utils/mocks/MockERC20.sol";
import { Arbitrator } from "nation3-court/Arbitrator.sol";
import { CollateralAgreementFramework } from "nation3-court/agreements/CollateralAgreement.sol";

contract DeployAgreements is Script, DeploymentUtils {
    /// Environment variables
    address ARBITRATOR;
    address COLLATERAL_TOKEN;
    address FEE_TOKEN;
    uint256 DISPUTE_FEE = 0;
    uint256 APPEAL_FEE = 0;
    uint256 RESOLUTION_LOCK_PERIOD = 6666;

    function setUpArbitrator() internal {
        if (ARBITRATOR == address(0)) {
            ERC20 feeToken = ERC20(registeredContractsAddress["FeeToken"]);

            Arbitrator arbitrator = new Arbitrator();
            arbitrator.setUp(feeToken, APPEAL_FEE, RESOLUTION_LOCK_PERIOD, true);

            registerContract("Arbitrator", address(arbitrator));
        } else {
            registerContract("Arbitrator", ARBITRATOR);
        }
    }

    function setUpFramework() internal {
        ERC20 collateralToken = ERC20(registeredContractsAddress["CollateralToken"]);
        ERC20 feeToken = ERC20(registeredContractsAddress["FeeToken"]);
        address arbitrator = registeredContractsAddress["Arbitrator"];

        CollateralAgreementFramework framework = new CollateralAgreementFramework();
        framework.setUp(collateralToken, feeToken, arbitrator, DISPUTE_FEE);

        registerContract("CollateralAgreementFramework", address(framework));
    }

    function loadEnvVars() internal {
        ARBITRATOR = loadEnvAddress(ARBITRATOR, "ARBITRATOR");
        COLLATERAL_TOKEN = loadEnvAddress(COLLATERAL_TOKEN, "COLLATERAL_TOKEN");
        FEE_TOKEN = loadEnvAddress(FEE_TOKEN, "FEE_TOKEN");
        DISPUTE_FEE = loadEnvUint(DISPUTE_FEE, "DISPUTE_FEE");
        APPEAL_FEE = loadEnvUint(APPEAL_FEE, "APPEAL_FEE");
        RESOLUTION_LOCK_PERIOD = loadEnvUint(RESOLUTION_LOCK_PERIOD, "RESOLUTION_LOCK_PERIOD");
    }

    function storeDeploymentManifest() internal {
        string memory manifest = generateRegisteredContractsJson();

        mkdir(deploymentsPath(""));

        vm.writeFile(deploymentsPath("latest.json"), manifest);

        console.log("Stored deployment manifest at %s.", deploymentsPath("latest.json"));
    }

    function setupTokens() internal {
        MockERC20 token;
        if (COLLATERAL_TOKEN == address(0) || FEE_TOKEN == address(0)) {
            token = new MockERC20("Court Token", "CT", 18);
            token.mint(tx.origin, 314 * 1e18);
        }

        registerContract(
            "CollateralToken",
            COLLATERAL_TOKEN != address(0) ? COLLATERAL_TOKEN : address(token)
        );
        registerContract("FeeToken", FEE_TOKEN != address(0) ? FEE_TOKEN : address(token));
    }

    function setUpContracts() internal {
        setupTokens();
        setUpArbitrator();
        setUpFramework();
    }

    function run() public {
        loadEnvVars();

        vm.startBroadcast();

        setUpContracts();

        vm.stopBroadcast();

        logDeployments();

        storeDeploymentManifest();
    }
}
