// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;

import { Script, console } from "forge-std/Script.sol";

struct ContractData {
    string key;
    address addr;
}

contract DeploymentUtils is Script {
    ContractData[] registeredContracts;
    mapping(string => address) registeredContractsAddress;

    mapping(string => bool) __madeDir;

    function deploymentsPath(string memory path) internal pure virtual returns (string memory) {
        return string.concat("deployments/", path);
    }

    function registerContract(string memory key, address addr) internal virtual {
        registeredContracts.push(ContractData(key, addr));
        registeredContractsAddress[key] = addr;
    }

    function mkdir(string memory path) internal virtual {
        if (__madeDir[path]) return;

        string[] memory script = new string[](3);
        script[0] = "mkdir";
        script[1] = "-p";
        script[2] = path;

        vm.ffi(script);

        __madeDir[path] = true;
    }

    function generateRegisteredContractsJson() internal virtual returns (string memory json) {
        if (registeredContracts.length == 0) return "";

        json = string.concat("{\n");

        for (uint256 i; i < registeredContracts.length; i++) {
            json = string.concat(
                json,
                ' "',
                registeredContracts[i].key,
                '": "',
                vm.toString(registeredContracts[i].addr),
                i + 1 == registeredContracts.length ? '"\n' : '",\n'
            );
        }

        json = string.concat(json, "}");
    }

    function logDeployments() internal view virtual {
        for (uint256 i; i < registeredContracts.length; i++) {
            console.log("%s=%s", registeredContracts[i].key, registeredContracts[i].addr);
        }
    }

    function loadEnvUint(uint256 defaultValue, string memory varName)
        internal
        virtual
        returns (uint256 value)
    {
        value = defaultValue;

        try vm.envUint(varName) returns (uint256 envValue) {
            value = envValue;
        } catch {}
    }

    function loadEnvAddress(address defaultValue, string memory varName)
        internal
        virtual
        returns (address value)
    {
        value = defaultValue;

        try vm.envAddress(varName) returns (address envValue) {
            value = envValue;
        } catch {}
    }
}
