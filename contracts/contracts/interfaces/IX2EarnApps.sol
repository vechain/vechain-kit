// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

/**
 * @title IX2EarnApps
 * @dev Interface designed to be a lighter version of the X2EarnApps contract.
 */
interface IX2EarnApps {
    // ---------- Custom Errors ------------ //

    /**
     * @dev Error thrown when an unauthorized user tries to perform an action
     * @param account The address of the unauthorized user
     */
    error X2EarnUnauthorizedUser(address account);

    /**
     * @dev Error thrown when trying to access a non-existent app
     * @param appId The ID of the non-existent app
     */
    error X2EarnNonexistentApp(bytes32 appId);

    /**
     * @dev Error thrown when an invalid address is provided
     * @param addr The invalid address
     */
    error X2EarnInvalidAddress(address addr);

    /**
     * @dev Error thrown when trying to create an app that already exists
     * @param appId The ID of the app that already exists
     */
    error X2EarnAppAlreadyExists(bytes32 appId);

    /**
     * @dev Error thrown when the maximum number of moderators is reached
     * @param appId The ID of the app
     */
    error X2EarnMaxModeratorsReached(bytes32 appId);

    /**
     * @dev Error thrown when the maximum number of creators is reached
     * @param appId The ID of the app
     */
    error X2EarnMaxCreatorsReached(bytes32 appId);

    /**
     * @dev Error thrown when trying to add a creator that already exists
     * @param creator The address of the creator
     */
    error X2EarnAlreadyCreator(address creator);

    /**
     * @dev Error thrown when an invalid allocation percentage is provided
     * @param percentage The invalid percentage
     */
    error X2EarnInvalidAllocationPercentage(uint256 percentage);

    // ---------- Events ------------ //

    /**
     * @dev Emitted when the base URI is updated
     * @param oldBaseURI The old base URI
     * @param newBaseURI The new base URI
     */
    event BaseURIUpdated(string oldBaseURI, string newBaseURI);

    /**
     * @dev Emitted when a new app is added
     * @param appId The ID of the app
     * @param teamWalletAddress The team wallet address
     * @param appName The name of the app
     * @param isActive Whether the app is active
     */
    event AppAdded(
        bytes32 indexed appId,
        address teamWalletAddress,
        string appName,
        bool isActive
    );

    /**
     * @dev Emitted when a moderator is added to an app
     * @param appId The ID of the app
     * @param moderator The address of the moderator
     */
    event ModeratorAddedToApp(bytes32 indexed appId, address moderator);

    /**
     * @dev Emitted when a creator is added to an app
     * @param appId The ID of the app
     * @param creator The address of the creator
     */
    event CreatorAddedToApp(bytes32 indexed appId, address creator);

    /**
     * @dev Emitted when an app admin is updated
     * @param appId The ID of the app
     * @param oldAdmin The old admin address
     * @param newAdmin The new admin address
     */
    event AppAdminUpdated(
        bytes32 indexed appId,
        address oldAdmin,
        address newAdmin
    );

    /**
     * @dev Emitted when a team wallet address is updated
     * @param appId The ID of the app
     * @param oldAddress The old team wallet address
     * @param newAddress The new team wallet address
     */
    event TeamWalletAddressUpdated(
        bytes32 indexed appId,
        address oldAddress,
        address newAddress
    );

    /**
     * @dev Emitted when team allocation percentage is updated
     * @param appId The ID of the app
     * @param oldPercentage The old allocation percentage
     * @param newPercentage The new allocation percentage
     */
    event TeamAllocationPercentageUpdated(
        bytes32 indexed appId,
        uint256 oldPercentage,
        uint256 newPercentage
    );

    /**
     * @dev Emitted when app metadata URI is updated
     * @param appId The ID of the app
     * @param oldURI The old metadata URI
     * @param newURI The new metadata URI
     */
    event AppMetadataURIUpdated(
        bytes32 indexed appId,
        string oldURI,
        string newURI
    );

    // ---------- Functions ------------ //

    /**
     * @dev Check if there is an app with the specified `appId`.
     * @dev This function should be used to check if an app exists is part of the VeBetter DAO ecosystem.
     * @notice An app is considered to exist if it has been included in at least one allocation round.
     *
     * @param appId the id of the app
     */
    function appExists(bytes32 appId) external view returns (bool);

    /**
     * @dev Check if an account is the admin of the app
     *
     * @param appId the hashed name of the app
     * @param account the address of the account
     */
    function isAppAdmin(
        bytes32 appId,
        address account
    ) external view returns (bool);

    /**
     * @dev Check if an account is the creator of the app
     *
     * @param appId the hashed name of the app
     * @param account the address of the account
     */
    function isAppCreator(
        bytes32 appId,
        address account
    ) external view returns (bool);

    /**
     * @dev Check if an account is a moderator of the app
     * @param appId the hashed name of the app
     * @param account the address of the account
     */
    function isAppModerator(
        bytes32 appId,
        address account
    ) external view returns (bool);

    /**
     * @dev Add a new moderator to the app.
     *
     * @param appId the id of the app
     * @param moderator the address of the moderator
     *
     * Emits a {ModeratorAddedToApp} event.
     */
    function addAppModerator(bytes32 appId, address moderator) external;

    /**
     * @dev Add a new creator to the app.
     *
     * @param appId the id of the app
     * @param creator the address of the creator
     *
     * Emits a {CreatorAddedToApp} event.
     */
    function addCreator(bytes32 appId, address creator) external;

    /**
     * @dev Register a new app.
     *
     * @param _teamWalletAddress the address where the app will receive the allocation funds
     * @param _admin the address of the admin
     * @param _appName the name of the app
     * @param _appMetadataURI the metadata URI of the app
     *
     * Emits a {AppAdded} event.
     */
    function submitApp(
        address _teamWalletAddress,
        address _admin,
        string memory _appName,
        string memory _appMetadataURI
    ) external;
}
