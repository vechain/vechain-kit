// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

/**
 * @title IX2EarnRewardsPool
 * @dev Interface designed to be used by a contract that allows x2Earn apps to reward users that performed sustainable actions.
 * Funds can be deposited into this contract by specifying the app id that can access the funds.
 * Admins of x2EarnApps can withdraw funds from the rewards pool, whihc are sent to the team wallet.
 */
interface IX2EarnRewardsPool {
  /**
   * @dev Event emitted when a new deposit is made into the rewards pool.
   *
   * @param amount The amount of $B3TR deposited.
   * @param appId The ID of the app for which the deposit was made.
   * @param depositor The address of the user that deposited the funds.
   */
  event NewDeposit(uint256 amount, bytes32 indexed appId, address indexed depositor);

  /**
   * @dev Event emitted when a team withdraws funds from the rewards pool.
   *
   * @param amount The amount of $B3TR withdrawn.
   * @param appId The ID of the app for which the withdrawal was made.
   * @param teamWallet The address of the team wallet that received the funds.
   * @param withdrawer The address of the user that withdrew the funds.
   * @param reason The reason for the withdrawal.
   */
  event TeamWithdrawal(
    uint256 amount,
    bytes32 indexed appId,
    address indexed teamWallet,
    address withdrawer,
    string reason
  );

  /**
   * @dev Event emitted when a reward is emitted by an app.
   *
   * @param amount The amount of $B3TR rewarded.
   * @param appId The ID of the app that emitted the reward.
   * @param receiver The address of the user that received the reward.
   * @param proof The proof of the sustainable action that was performed.
   * @param distributor The address of the user that distributed the reward.
   */
  event RewardDistributed(
    uint256 amount,
    bytes32 indexed appId,
    address indexed receiver,
    string proof,
    address indexed distributor
  );

  /**
   * @dev Event emitted when the proof of sustainability external contract call fails.
   *
   * @param reason The reason for the failure.
   * @param lowLevelData The low level data returned by the external contract.
   */
  event RegisterActionFailed(string reason, bytes lowLevelData);

  /**
   * @dev Event emitted when an app's reward distribution is paused.
   * @param appId The ID of the app that was paused.
   * @param admin The address of the admin who paused the app.
   */
  event AppPaused(bytes32 indexed appId, address indexed admin);

  /**
   * @dev Event emitted when an app's reward distribution is unpaused.
   * @param appId The ID of the app that was unpaused.
   * @param admin The address of the admin who unpaused the app.
   */
  event AppUnpaused(bytes32 indexed appId, address indexed admin);


/**
  * @dev Event emitted when a reward is emitted by an app with proof and metadata.
  * @param amount The amount of $B3TR rewarded.
  * @param appId The ID of the app that emitted the reward.
  * @param receiver The address of the user that received the reward.
  * @param metadata The metadata of the sustainable action that was performed.
  * @param distributor The address of the user that distributed the reward.
 */
  event RewardMetadata(
    uint256 amount,
    bytes32 indexed appId,
    address indexed receiver,
    string metadata,
    address indexed distributor
  );

  /**
   * @dev Event emitted when the admin configure the rewards pool balance
   *
   * @param appId - the app ID
   * @param enable - true to enable, false to disable
   */
  event RewardsPoolBalanceEnabled(bytes32 indexed appId, bool enable);

  /**
   * @dev Event emitted when the balance of the rewards pool for an app is initialized or updated.
   *
   * @param appId The ID of the app for which the balance was updated.
   * @param amount The amount being added or removed from the rewards pool.
   * @param availableFunds The current balance of the available funds for the app.
   * @param rewardsPoolBalance The current balance of the rewards pool for the app.
   */
  event RewardsPoolBalanceUpdated(bytes32 indexed appId, uint256 amount, uint256 availableFunds, uint256 rewardsPoolBalance);


  /**
   * @dev Retrieves the current version of the contract.
   *
   * @return The version of the contract.
   */
  function version() external pure returns (string memory);

  /**
   * @dev Function used by x2earn apps to deposit funds into the rewards pool.
   *
   * @param amount The amount of $B3TR to deposit.
   * @param appId The ID of the app.
   */
  function deposit(uint256 amount, bytes32 appId) external returns (bool);

  /**
   * @dev Function used by x2earn apps to withdraw funds from the rewards pool.
   *
   * @param amount The amount of $B3TR to withdraw.
   * @param appId The ID of the app.
   * @param reason The reason for the withdrawal.
   */
  function withdraw(uint256 amount, bytes32 appId, string memory reason) external;

  /**
   * @dev Gets the amount of funds available for an app to withdraw and reward user if the dual-pool is disabled.
   *
   * @param appId The ID of the app.
   */
  function availableFunds(bytes32 appId) external view returns (uint256);

  /**
   * @dev Gets the total of funds available for withdrawal and rewards distribution.
   *
   * @param appId The ID of the app.
   */
  function totalBalance(bytes32 appId) external view returns (uint256);

  /**
   * @dev Gets either the dual-pool rewards pool balance is enabled or not.
   *
   * @param appId The ID of the app.
   */
  function isRewardsPoolEnabled(bytes32 appId) external view returns (bool);

  /**
   * @dev Gets whether the distribution is paused or not for a specific xApp
   *
   * @param appId The ID of the app.
   */
  function isDistributionPaused(bytes32 appId) external view returns (bool);

  /**
   * @dev Enables the rewards pool for a newly created app.
   * @param appId The ID of the app.
   * @notice This function can only be called by the X2EarnApps contract during app submission
   */
  function enableRewardsPoolForNewApp(bytes32 appId) external;  

  /**
   * @dev Gets the amount of funds available for an app to reward users if the dual-pool is enabled.
   *
   * @param appId The ID of the app.
   */
  function rewardsPoolBalance(bytes32 appId) external view returns (uint256);
  
  /**
   * @dev Function used by x2earn apps to reward users that performed sustainable actions.
   *
   * @param appId the app id that is emitting the reward
   * @param amount the amount of B3TR token the user is rewarded with
   * @param receiver the address of the user that performed the sustainable action and is rewarded
   * @param proof deprecated argument, pass an empty string instead
   */
  function distributeReward(bytes32 appId, uint256 amount, address receiver, string memory proof) external;

  /**
   * @dev Function used by x2earn apps to reward users that performed sustainable actions.
   * @notice This function is depracted in favor of distributeRewardWithProof.
   *
   * @param appId the app id that is emitting the reward
   * @param amount the amount of B3TR token the user is rewarded with
   * @param receiver the address of the user that performed the sustainable action and is rewarded
   * @param proof the JSON string that contains the proof and impact of the sustainable action
   */
  function distributeRewardDeprecated(bytes32 appId, uint256 amount, address receiver, string memory proof) external;

  /**
   * @dev Function used by x2earn apps to reward users that performed sustainable actions.
   *
   * @param appId the app id that is emitting the reward
   * @param amount the amount of B3TR token the user is rewarded with
   * @param receiver the address of the user that performed the sustainable action and is rewarded
   * @param proofTypes the types of the proof of the sustainable action
   * @param proofValues the values of the proof of the sustainable action
   * @param impactCodes the codes of the impacts of the sustainable action
   * @param impactValues the values of the impacts of the sustainable action
   * @param description the description of the sustainable action
   */
  function distributeRewardWithProof(
    bytes32 appId,
    uint256 amount,
    address receiver,
    string[] memory proofTypes, // link, image, video, text, etc.
    string[] memory proofValues, // "https://...", "Qm...", etc.,
    string[] memory impactCodes, // carbon, water, etc.
    uint256[] memory impactValues, // 100, 200, etc.,
    string memory description
  ) external;

  /**
   * @dev Function used by x2earn apps to reward users that performed sustainable actions and emit metadata event.
   *
   * @param appId the app id that is emitting the reward
   * @param amount the amount of B3TR token the user is rewarded with
   * @param receiver the address of the user that performed the sustainable action and is rewarded
   * @param proofTypes the types of the proof of the sustainable action
   * @param proofValues the values of the proof of the sustainable action
   * @param impactCodes the codes of the impacts of the sustainable action
   * @param impactValues the values of the impacts of the sustainable action
   * @param description the description of the sustainable action
   * @param metadata the metadata of the sustainable action
   */
  function distributeRewardWithProofAndMetadata(
    bytes32 appId,
    uint256 amount,
    address receiver,
    string[] memory proofTypes, // link, image, video, text, etc.
    string[] memory proofValues, // "https://...", "Qm...", etc.,
    string[] memory impactCodes, // carbon, water, etc.
    uint256[] memory impactValues, // 100, 200, etc.,
    string memory description,
    string memory metadata // "{'country': 'Brazil', 'city': 'Brasilia'}"
  ) external;

  /**
   * @dev Builds the JSON proof string that will be stored
   * on chain regarding the proofs, impacts and description of the sustainable action.
   *
   * @param proofTypes the types of the proof of the sustainable action
   * @param proofValues the values of the proof of the sustainable action
   * @param impactCodes the codes of the impacts of the sustainable action
   * @param impactValues the values of the impacts of the sustainable action
   * @param description the description of the sustainable action
   */
  function buildProof(
    string[] memory proofTypes, // link, photo, video, text, etc.
    string[] memory proofValues, // "https://...", "Qm...", etc.,
    string[] memory impactCodes, // carbon, water, etc.
    uint256[] memory impactValues, // 100, 200, etc.,
    string memory description
  ) external returns (string memory);
}
