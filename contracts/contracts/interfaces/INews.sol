// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {IX2EarnApps} from './IX2EarnApps.sol';

/**
 * @title INews
 * @dev Interface designed to be used by admins of x2EarnApps contract to publish or retrieve news.
 */
interface INews {
    struct NewsType {
        uint256 id;
        string title;
        string description;
        string image;
        string callToActionUrl;
        uint256 timestamp;
        address publisher;
    }

    /// @dev Error thrown when a user is not authorized to perform an action
    error NewsUnauthorizedUser(address user);

    /// @dev Error thrown when the start index is invalid
    error NewsInvalidStartIndex();

    /**
     * @dev Event emitted when a new news is published.
     *
     * @param appId The ID of the app for which the news was published.
     * @param title The title of the news.
     * @param description The description of the news.
     * @param image The image of the news.
     * @param callToActionUrl The call to action URL of the news.
     * @param publisher The address of the user that published the news.
     */
    event NewsPublished(
        uint256 indexed id,
        bytes32 indexed appId,
        string title,
        string description,
        string image,
        string callToActionUrl,
        address indexed publisher
    );

    /**
     * @dev Event emitted when the cooldown period is updated.
     *
     * @param oldCooldownPeriod The old cooldown period.
     * @param newCooldownPeriod The new cooldown period.
     */
    event CooldownPeriodUpdated(
        uint256 oldCooldownPeriod,
        uint256 newCooldownPeriod
    );

    /**
     * @dev Initializes the contract with role-based access control
     * @param _x2EarnApps The address of the X2EarnApps contract
     * @param _cooldownPeriod The cooldown period
     * @param _defaultAdmin Address to be assigned the default admin role
     * @param _upgrader Address to be assigned the upgrader role
     * @param _pauser Address to be assigned the pauser role
     */
    function initialize(
        IX2EarnApps _x2EarnApps,
        uint256 _cooldownPeriod,
        address _defaultAdmin,
        address _upgrader,
        address _pauser
    ) external;

    /**
     * @dev Publishes news for an app
     * @param appId The ID of the app for which the news was published
     * @param title The title of the news
     * @param description The description of the news
     * @param image The image of the news
     * @param callToActionUrl The call to action URL of the news
     */
    function publish(
        bytes32 appId,
        string memory title,
        string memory description,
        string memory image,
        string memory callToActionUrl
    ) external;

    /**
     * @dev Sets the X2EarnApps contract address.
     * @param _x2EarnApps the new X2EarnApps contract
     */
    function setX2EarnApps(IX2EarnApps _x2EarnApps) external;

    /**
     * @dev Sets the cooldown period.
     * @param _cooldownPeriod The new cooldown period.
     */
    function setCooldownPeriod(uint256 _cooldownPeriod) external;

    /**
     * @dev Retrieves the X2EarnApps contract.
     */
    function x2EarnApps() external view returns (IX2EarnApps);

    /**
     * @dev Retrieves the cooldown period.
     * @return The cooldown period.
     */
    function cooldownPeriod() external view returns (uint256);

    /**
     * @dev Retrieves the cooldown status of an app.
     * @param appId The ID of the app.
     * @return True if the app is in a cooldown period.
     */
    function isUnderCooldown(bytes32 appId) external view returns (bool);

    /**
     * @dev Retrieves the last news block.
     * @param appId The ID of the app.
     * @return The last news block.
     */
    function lastNewsBlock(bytes32 appId) external view returns (uint256);

    /**
     * @dev Retrieves the news for an app.
     * @param appId The ID of the app.
     * @param _resultsPerPage The number of results per page.
     * @param _page The page number.
     * @return The news.
     */
    function appNewsPaginated(
        bytes32 appId,
        uint256 _resultsPerPage,
        uint256 _page
    ) external view returns (NewsType[] memory);

    /**
     * @dev Retrieves the latest news for an app.
     * @param appId The ID of the app.
     * @return The latest news.
     */
    function appLatestNews(
        bytes32 appId
    ) external view returns (NewsType memory);

    /**
     * @dev Retrieves the latest news for all apps with pagination.
     * @param _resultsPerPage The number of results per page.
     * @param _page The page number (0-based).
     * @return The latest news from all apps.
     */
    function latestNewsPaginated(
        uint256 _resultsPerPage,
        uint256 _page
    ) external view returns (NewsType[] memory);

    /**
     * @dev Retrieves the news for an app by ID.
     * @param newsId The ID of the news.
     * @return The news.
     */
    function getNewsById(
        uint256 newsId
    ) external view returns (NewsType memory);

    /**
     * @dev Removes a news item by ID.
     * @param newsId The ID of the news.
     */
    function removeNewsById(uint256 newsId) external;

    /**
     * @dev Checks if a news item exists by ID.
     * @param newsId The ID of the news.
     * @return True if the news item exists, false otherwise.
     */
    function newsExists(uint256 newsId) external view returns (bool);

    /**
     * @dev Pauses all contract operations
     */
    function pause() external;

    /**
     * @dev Unpauses the contract operations
     */
    function unpause() external;

    /**
     * @dev Retrieves the current version of the contract.
     * @return The version of the contract.
     */
    function version() external pure returns (uint256);
}
