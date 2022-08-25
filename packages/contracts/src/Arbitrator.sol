// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.15;
import { PositionParams } from "./lib/AgreementStructs.sol";
import { IArbitrable } from "./interfaces/IArbitrable.sol";
import { IArbitrator } from "./interfaces/IArbitrator.sol";
import { Controlled } from "./lib/auth/Controlled.sol";

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

contract Arbitrator is IArbitrator, Controlled {

    // @dev Number of blocks needed to wait before executing a resolution.
    uint256 public executionLockPeriod;
    // @dev Mapping of all submitted resolutions.
    mapping(bytes32 => Resolution) public resolution;

    constructor() Controlled(msg.sender, msg.sender) {}

    /// @dev Setup arbitrator variables
    function setUp(uint256 executionLockPeriod_) public onlyOwner {
        executionLockPeriod = executionLockPeriod_;
    }

    /// @inheritdoc IArbitrator
    /// @dev Only controller is able to submit resolutions.
    function submitResolution(
        IArbitrable framework,
        bytes32 id,
        string calldata metadataURI,
        PositionParams[] calldata settlement
    ) public onlyController returns (bytes32) {
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

        if (resolution_.status == ResolutionStatus.Appealed)
            revert ResolutionIsAppealed();
        if (resolution_.status == ResolutionStatus.Executed)
            revert ResolutionIsExecuted();
        if (
            resolution_.status != ResolutionStatus.Endorsed
            && block.number < resolution_.unlockBlock
        )
            revert ExecutionStillLocked();
        if (resolution_.mark != keccak256(abi.encode(settlement)))
            revert ResolutionMustMatch();

        framework.settleDispute(id, settlement);

        resolution_.status = ResolutionStatus.Executed;
    }

    /// @inheritdoc IArbitrator
    function appealResolution(bytes32 hash, PositionParams[] calldata settlement) external {
        _canAppeal(msg.sender, hash, settlement);

        resolution[hash].status = ResolutionStatus.Appealed;
        // TODO: Charge appeal fee
    }

    /// @dev Check if account can appeal a resolution.
    /// @param account address to check.
    /// @param hash hash of the resolution.
    function _canAppeal(address account, bytes32 hash, PositionParams[] calldata settlement) internal view {
        Resolution storage resolution_ = resolution[hash];

        if (resolution_.status == ResolutionStatus.Default)
            revert ResolutionNotSubmitted();
        if (resolution_.status == ResolutionStatus.Executed)
            revert ResolutionIsExecuted();
        if (resolution_.status == ResolutionStatus.Endorsed)
            revert ResolutionIsEndorsed();
        if (resolution_.mark != keccak256(abi.encode(settlement)))
            revert ResolutionMustMatch();
        if (!_isParty(account, settlement))
            revert NoPartOfResolution();
    }

    function _isParty(address account, PositionParams[] calldata settlement) internal pure returns (bool found) {
        for (uint256 i = 0; !found && i < settlement.length; i++) {
            if (settlement[i].party == account)
                found = true;
        }
    }

    /// @inheritdoc IArbitrator
    function endorseResolution(bytes32 hash, PositionParams[] calldata settlement) external onlyOwner {
        Resolution storage resolution_ = resolution[hash];

        if (resolution_.status == ResolutionStatus.Default)
            revert ResolutionNotSubmitted();
        if (resolution_.status == ResolutionStatus.Executed)
            revert ResolutionIsExecuted();
        if (resolution_.mark != keccak256(abi.encode(settlement)))
            revert ResolutionMustMatch();

        resolution_.status = ResolutionStatus.Endorsed;
    }

    function getResolutionHash(address framework, bytes32 id) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(framework, id));
    }
}
