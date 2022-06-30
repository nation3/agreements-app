// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";
import {SafeTransferLib} from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";

import {DSTestPlus} from "@rari-capital/solmate/src/test/utils/DSTestPlus.sol";

struct PartyPosition {
    address party;
    uint256 balance;
}

struct Position {
    uint256 partyId;
    uint256 balance;
    uint8 status;
}

struct CriteriaResolver {
    uint256 index;
    address party;
    bytes32[] criteriaProof;
}

struct Agreement {
    /// @dev Hash of the detailed terms of the agreement.
    bytes32 termsHash;
    /// @dev Required amount to join or merkle root of (address,amount).
    uint256 criteria;
    /// @dev Number of settlement confirmations.
    uint256 settlements;
    /// @dev All parties involved in the agreement.
    address[] party;
    /// @dev Position id by party.
    mapping(address => Position) position;
}

struct AgreementParams {
    bytes32 termsHash;
    uint256 criteria;
}

interface IAgreementFramework {

    event AgreementCreated(uint256 agreementId, bytes32 termsHash, uint256 criteria);
    event AgreementJoined(uint256 agreementId, address party);
    event AgreementSettlement(uint256 agreementId, address party);
    event AgreementWithdrawn(uint256 agreementId, address party);

    error CriteriaUnderArbitrationFee();
    error InsuficientBalance();
    error NoPartOfAgreement();
    error PartyAlreadySettled();
    error AgreementNotSettled();

    /// @notice Address capable of settle agreements on dispute
    function arbitrator() external view returns(address);

    /// @notice Create a new agreement with given params
    /// @param params Struct of agreement params
    function createAgreement(AgreementParams calldata params) external returns (uint256 agreementId);

    /// @notice Join an existent agreement, requires a deposit over agreement criteria.
    /// @param agreementId Id of the agreement to join.
    function joinAgreement(uint256 agreementId) external;

    /// @notice Allows a party to vote in favor of settle an agreement.
    /// @param agreementId Id of the agreement to settle.
    function settleAgreement(uint256 agreementId) external;

    /// @notice Allows a party to withdraw theirselve from a settled agreement.
    /// @param agreementId Id of the agreement to withdraw from.
    function withdrawFromAgreement(uint256 agreementId) external;

    // function disputeAgreement(uint256 agreementId) public;

    // function settleDispute(Agreement agreement, Position[] positions) public;
}

contract AgreementFramework is IAgreementFramework {

    /// @dev Token used in agreements & to pay arbitratotion fees.
    ERC20 token;

    address public arbitrator;
    mapping(uint256 => Agreement) public agreement;

    /// @dev Amount of jurisdiction token to reserve to pay for arbitration.
    uint256 public arbitrationFee;

    /// @dev Current last agreement index.
    uint256 private _currentIndex;

    function getAgreementParams(uint256 id) external view returns (AgreementParams memory params) {
        params = AgreementParams(agreement[id].termsHash, agreement[id].criteria);
    }

    function getAgreementPositions(uint256 id) external view returns (PartyPosition[] memory) {
        uint256 partyLength = agreement[id].party.length;
        PartyPosition[] memory agreementPositions = new PartyPosition[](partyLength);

        for (uint256 i = 0; i < partyLength; i++) {
            address party = agreement[id].party[i];
            uint256 balance = agreement[id].position[party].balance;

            agreementPositions[i] = PartyPosition(party, balance);
        }

        return agreementPositions;
    }

    function isSettled(uint256 id) public view returns (bool) {
        return agreement[id].settlements >= agreement[id].party.length;
    }

    constructor(ERC20 token_, address arbitrator_, uint256 arbitrationFee_) {
        arbitrator = arbitrator_;
        token = token_;
        arbitrationFee = arbitrationFee_;
    }

    function createAgreement(AgreementParams calldata params) external returns (uint256 agreementId) {
        if (params.criteria < arbitrationFee) revert CriteriaUnderArbitrationFee();
        agreementId = _currentIndex;

        agreement[agreementId].termsHash = params.termsHash;
        agreement[agreementId].criteria = params.criteria;

        _currentIndex++;

        emit AgreementCreated(agreementId, params.termsHash, params.criteria);
    }

    function joinAgreement(uint256 id) external {
        uint256 requiredBalance = agreement[id].criteria;

        if (token.balanceOf(msg.sender) < requiredBalance) revert InsuficientBalance();

        SafeTransferLib.safeTransferFrom(token, msg.sender, address(this), requiredBalance);

        uint256 newPartyId = agreement[id].party.length;

        Position memory newPositon = Position(newPartyId, requiredBalance, 0);

        agreement[id].party.push(msg.sender);
        agreement[id].position[msg.sender] = newPositon;

        emit AgreementJoined(id, msg.sender);
    }

    function settleAgreement(uint256 id) external {
        if (agreement[id].party[agreement[id].position[msg.sender].partyId] != msg.sender) revert NoPartOfAgreement();
        if (agreement[id].position[msg.sender].status == 1) revert PartyAlreadySettled();

        agreement[id].position[msg.sender].status = 1;
        agreement[id].settlements += 1;

        emit AgreementSettlement(id, msg.sender);
    }

    function withdrawFromAgreement(uint256 id) public {
        if (!isSettled(id)) revert AgreementNotSettled();
        if (agreement[id].party[agreement[id].position[msg.sender].partyId] != msg.sender) revert NoPartOfAgreement();

        uint256 withdrawBalance = agreement[id].position[msg.sender].balance;
        agreement[id].position[msg.sender].balance = 0;

        SafeTransferLib.safeTransfer(token, msg.sender, withdrawBalance);

        emit AgreementWithdrawn(id, msg.sender);
    }
}
