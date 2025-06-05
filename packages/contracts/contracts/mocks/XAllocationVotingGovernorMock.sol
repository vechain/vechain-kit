// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";
import {IERC6372} from "@openzeppelin/contracts/interfaces/IERC6372.sol";
import "./interfaces/IXAllocationVotingGovernor.sol";

contract XAllocationVotingGovernorMock is IXAllocationVotingGovernor {
    uint256 private _currentRoundId;
    uint256 private _votingPeriodInBlocks;
    mapping(uint256 => RoundState) private _roundStates;
    mapping(uint256 => uint256) private _roundSnapshots;
    mapping(uint256 => uint256) private _roundDeadlines;
    mapping(uint256 => address) private _roundProposers;

    constructor(uint256 votingPeriodInBlocks) {
        require(
            votingPeriodInBlocks > 0,
            "Voting period must be greater than 0"
        );
        _votingPeriodInBlocks = votingPeriodInBlocks;
        _currentRoundId = 0;
    }

    function startNewRound() external override returns (uint256 roundId) {
        // current round must be ended
        require(
            _roundDeadlines[_currentRoundId] < block.number,
            "Current round must be ended"
        );

        _currentRoundId += 1;
        roundId = _currentRoundId;

        // Set round properties
        _roundStates[roundId] = RoundState.Active;
        _roundSnapshots[roundId] = block.number;
        _roundDeadlines[roundId] = block.number + _votingPeriodInBlocks;
        _roundProposers[roundId] = msg.sender;

        // previous round is finalized
        _roundStates[_currentRoundId - 1] = RoundState.Succeeded;

        // Emit the round creation event
        bytes32[] memory appsIds; // For this mock, we're assuming no apps
        emit RoundCreated(
            roundId,
            msg.sender,
            _roundSnapshots[roundId],
            _roundDeadlines[roundId],
            appsIds
        );
    }

    function setVotingPeriodInBlocks(uint256 votingPeriodInBlocks) external {
        _votingPeriodInBlocks = votingPeriodInBlocks;
    }

    function currentRoundId() external view override returns (uint256) {
        return _currentRoundId;
    }

    function state(
        uint256 roundId
    ) external view override returns (RoundState) {
        return _roundStates[roundId];
    }

    function roundSnapshot(
        uint256 roundId
    ) external view override returns (uint256) {
        return _roundSnapshots[roundId];
    }

    function roundDeadline(
        uint256 roundId
    ) external view override returns (uint256) {
        return _roundDeadlines[roundId];
    }

    function roundProposer(
        uint256 roundId
    ) external view override returns (address) {
        return _roundProposers[roundId];
    }

    function votingPeriod() external view override returns (uint256) {
        return _votingPeriodInBlocks;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external view override returns (bool) {}

    function clock() external view override returns (uint48) {}

    function CLOCK_MODE() external view override returns (string memory) {}

    function name() external view override returns (string memory) {}

    function version() external view override returns (string memory) {}

    function COUNTING_MODE() external view override returns (string memory) {}

    function quorum(
        uint256 timepoint
    ) external view override returns (uint256) {}

    function roundQuorum(
        uint256 roundId
    ) external view override returns (uint256) {}

    function getVotes(
        address account,
        uint256 timepoint
    ) external view override returns (uint256) {}

    function totalVotes(
        uint256 roundId
    ) external view override returns (uint256) {}

    function totalVoters(
        uint256 roundId
    ) external view override returns (uint256) {}

    function getAppVotes(
        uint256 roundId,
        bytes32 appId
    ) external view override returns (uint256) {}

    function getAppVotesQF(
        uint256 roundId,
        bytes32 app
    ) external view override returns (uint256) {}

    function totalVotesQF(
        uint256 roundId
    ) external view override returns (uint256) {}

    function hasVoted(
        uint256 roundId,
        address account
    ) external view override returns (bool) {}

    function castVote(
        uint256 roundId,
        bytes32[] memory appsIds,
        uint256[] memory voteWeights
    ) external override {}

    function currentRoundSnapshot() external view override returns (uint256) {
        return _roundSnapshots[_currentRoundId];
    }

    function currentRoundDeadline() external view override returns (uint256) {
        return _roundDeadlines[_currentRoundId];
    }

    function quorumReached(
        uint256 roundId
    ) external view override returns (bool) {}

    function getAppIdsOfRound(
        uint256 roundId
    ) external view override returns (bytes32[] memory) {}

    function isEligibleForVote(
        bytes32 appId,
        uint256 roundId
    ) external view override returns (bool) {}

    function isActive(uint256 roundId) external view override returns (bool) {
        return _roundStates[roundId] == RoundState.Active;
    }

    function latestSucceededRoundId(
        uint256 roundId
    ) external view override returns (uint256) {}

    function hasVotedOnce(address user) external view override returns (bool) {}

    function getRoundBaseAllocationPercentage(
        uint256 roundId
    ) external view override returns (uint256) {}

    function getRoundAppSharesCap(
        uint256 roundId
    ) external view override returns (uint256) {}
}
