// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;
import { PositionParams } from "./lib/AgreementStructs.sol";
import { IArbitrable } from "./interfaces/IArbitrable.sol";
import { IArbitrator } from "./interfaces/IArbitrator.sol";
enum ResolutionStatus {
    Default,
    Pending,
    Endorsed,
    Appealed,
    Executed
}

struct Resolution {
    ResolutionStatus status;
    bytes32 mark;
    string metadataURI;
    uint256 unlockBlock;
}

contract Arbitrator is IArbitrator {

    // @dev Number of blocks needed to wait before exeucuting a resolution.
    uint256 public executionLockPeriod;
    // @dev Mapping of all submitted resolutions.
    mapping(bytes32 => Resolution) public resolution;

    /// @dev Setup arbitrator variables
    function setUp(uint256 executionLockPeriod_) public onlyOwner {
        executionLockPeriod = executionLockPeriod_;
    }

    /// @inheritdoc IArbitrator
    function submitResolution(
        IArbitrable framework,
        bytes32 id,
        string calldata metadataURI,
        PositionParams[] calldata settlement
    ) public returns (bytes32) {
        bytes32 hash = getResolutionHash(address(framework), id);
        Resolution storage resolution_ = resolution[hash];

        if (resolution_.status == ResolutionStatus.Executed)
            revert ResolutionIsExecuted();

        resolution_.status = ResolutionStatus.Pending;
        resolution_.mark = keccak256(abi.encode(settlement));
        resolution_.metadataURI = metadataURI;
        resolution_.unlockBlock = block.number + executionLockPeriod;

        return hash;
    }

    /// @inheritdoc IArbitrator
    function executeResolution(
        IArbitrable framework,
        bytes32 id,
        PositionParams[] calldata settlement
    ) public {
        bytes32 hash = getResolutionHash(address(framework), id);
        Resolution storage resolution_ = resolution[hash];

        framework.settleDispute(id, settlement);

        resolution_.status = ResolutionStatus.Executed;
    }
}
