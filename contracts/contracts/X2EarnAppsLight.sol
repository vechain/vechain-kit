// SPDX-License-Identifier: MIT

//                                      #######
//                                 ################
//                               ####################
//                             ###########   #########
//                            #########      #########
//          #######          #########       #########
//          #########       #########      ##########
//           ##########     ########     ####################
//            ##########   #########  #########################
//              ################### ############################
//               #################  ##########          ########
//                 ##############      ###              ########
//                  ############                       #########
//                    ##########                     ##########
//                     ########                    ###########
//                       ###                    ############
//                                          ##############
//                                    #################
//                                   ##############
//                                   #########

pragma solidity 0.8.20;

import {IX2EarnApps} from './interfaces/IX2EarnApps.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {AccessControlUpgradeable} from '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import {X2EarnAppsDataTypes} from './libraries/X2EarnAppsDataTypes.sol';

/**
 * @title X2EarnAppsLight
 * @notice Lightweight version of X2EarnApps that contains only the essential functionality needed by News contract.
 * @dev This contract maintains the same interface and storage structure as the full X2EarnApps but removes
 * complex features like endorsements, voting eligibility, and modular architecture.
 *
 * -------------------- Light Version --------------------
 * - Simplified single contract implementation
 * - Contains only features required by News contract
 * - Maintains same interface and storage naming as original
 */
contract X2EarnAppsLight is
    IX2EarnApps,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    /// @notice The role that can upgrade the contract.
    bytes32 public constant UPGRADER_ROLE = keccak256('UPGRADER_ROLE');
    /// @notice The role that can manage the contract settings.
    bytes32 public constant GOVERNANCE_ROLE = keccak256('GOVERNANCE_ROLE');

    uint256 public constant MAX_MODERATORS = 100;
    uint256 public constant MAX_CREATORS = 3;

    // Storage
    mapping(bytes32 appId => X2EarnAppsDataTypes.App) private _apps;
    bytes32[] private _appIds;
    mapping(bytes32 appId => address) private _admin;
    mapping(bytes32 appId => address[]) private _moderators;
    mapping(bytes32 appId => address) private _teamWalletAddress;
    mapping(bytes32 appId => uint256) private _teamAllocationPercentage;
    mapping(bytes32 appId => string) private _metadataURI;
    mapping(bytes32 appId => address[]) private _creators;
    mapping(address creator => uint256 apps) private _creatorApps;
    string private _baseURI;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ---------- Modifiers ------------ //

    /**
     * @dev Modifier to restrict access to only the admin role and the app admin role.
     * @param appId the app ID
     */
    modifier onlyRoleAndAppAdmin(bytes32 role, bytes32 appId) {
        if (!hasRole(role, msg.sender) && !isAppAdmin(appId, msg.sender)) {
            revert X2EarnUnauthorizedUser(msg.sender);
        }
        _;
    }

    /**
     * @dev Modifier to restrict access to only the admin role, the app admin role and the app moderator role.
     * @param appId the app ID
     */
    modifier onlyRoleAndAppAdminOrModerator(bytes32 role, bytes32 appId) {
        if (
            !hasRole(role, msg.sender) &&
            !isAppAdmin(appId, msg.sender) &&
            !isAppModerator(appId, msg.sender)
        ) {
            revert X2EarnUnauthorizedUser(msg.sender);
        }
        _;
    }

    // ---------- Initializer ------------ //

    /**
     * @notice Initialize the contract
     * @param _defaultAdmin Address to be assigned the default admin role
     * @param _upgrader Address to be assigned the upgrader role
     * @param baseURI_ The base URI for app metadata
     */
    function initialize(
        address _defaultAdmin,
        address _upgrader,
        string memory baseURI_
    ) external initializer {
        require(
            _defaultAdmin != address(0),
            'X2EarnApps: defaultAdmin is zero address'
        );
        require(
            _upgrader != address(0),
            'X2EarnApps: upgrader is zero address'
        );

        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _grantRole(UPGRADER_ROLE, _upgrader);

        _baseURI = baseURI_;
    }

    // ---------- Authorizations ------------ //

    /**
     * @dev See {UUPSUpgradeable-_authorizeUpgrade}
     */
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    // ---------- Getters ------------ //

    /**
     * @notice Returns the version of the contract
     * @dev This should be updated every time a new version of implementation is deployed
     * @return string The version of the contract
     */
    function version() public pure virtual returns (string memory) {
        return '1';
    }

    /**
     * @dev See {IX2EarnApps-appExists}.
     */
    function appExists(bytes32 appId) public view returns (bool) {
        return _apps[appId].createdAtTimestamp != 0;
    }

    /**
     * @dev Check if an account is the admin of the app
     *
     * @param appId the hashed name of the app
     * @param account the address of the account
     */
    function isAppAdmin(
        bytes32 appId,
        address account
    ) public view returns (bool) {
        return _admin[appId] == account;
    }

    /**
     * @dev Check if an account is the creator of the app
     *
     * @param appId the hashed name of the app
     * @param account the address of the account
     */
    function isAppCreator(
        bytes32 appId,
        address account
    ) public view returns (bool) {
        return _contains(_creators[appId], account);
    }

    /**
     * @dev Check if an account is a moderator of the app
     * @param appId the hashed name of the app
     * @param account the address of the account
     */
    function isAppModerator(
        bytes32 appId,
        address account
    ) public view returns (bool) {
        return _contains(_moderators[appId], account);
    }

    /**
     * @dev Get the baseURI and metadata URI of the app concatenated
     *
     * @param appId the hashed name of the app
     */
    function appURI(bytes32 appId) public view returns (string memory) {
        if (!_appSubmitted(appId)) {
            revert X2EarnNonexistentApp(appId);
        }

        return string(abi.encodePacked(_baseURI, _metadataURI[appId]));
    }

    /**
     * @dev See {IX2EarnApps-hashAppName}.
     */
    function hashAppName(string memory appName) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(appName));
    }

    /**
     * @dev See {IX2EarnApps-baseURI}.
     */
    function baseURI() public view returns (string memory) {
        return _baseURI;
    }

    /**
     * @dev Get the address where the x2earn app receives allocation funds
     *
     * @param appId the hashed name of the app
     */
    function teamWalletAddress(bytes32 appId) public view returns (address) {
        return _teamWalletAddress[appId];
    }

    /**
     * @dev See {IX2EarnApps-appAdmin}
     */
    function appAdmin(bytes32 appId) public view returns (address) {
        return _admin[appId];
    }

    /**
     * @dev Function to get the percentage of the allocation reserved for the team
     *
     * @param appId the app id
     */
    function teamAllocationPercentage(
        bytes32 appId
    ) public view returns (uint256) {
        return _teamAllocationPercentage[appId];
    }

    /**
     * @dev Returns the list of moderators of the app
     *
     * @param appId the hashed name of the app
     */
    function appModerators(
        bytes32 appId
    ) public view returns (address[] memory) {
        return _moderators[appId];
    }

    /**
     * @dev Get the metadata URI of the app
     *
     * @param appId the app id
     */
    function metadataURI(bytes32 appId) public view returns (string memory) {
        return _metadataURI[appId];
    }

    /**
     * @dev Returns the list of creators of the app
     */
    function appCreators(
        bytes32 appId
    ) external view returns (address[] memory) {
        return _creators[appId];
    }

    /**
     * @dev Returns true if the creator has already been used for another app.
     *
     * @param creator the address of the creator
     */
    function isCreatorOfAnyApp(address creator) public view returns (bool) {
        return _creatorApps[creator] > 0;
    }

    // ---------- Setters ------------ //

    /**
     * @dev Update the base URI to retrieve the metadata of the x2earn apps
     *
     * @param baseURI_ the base URI for the contract
     *
     * Emits a {BaseURIUpdated} event.
     */
    function setBaseURI(
        string memory baseURI_
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        emit BaseURIUpdated(_baseURI, baseURI_);
        _baseURI = baseURI_;
    }

    /**
     * @dev See {IX2EarnApps-submitApp}.
     */
    function submitApp(
        address teamWalletAddr,
        address appAdmin,
        string memory _appName,
        string memory _appMetadataURI
    ) public virtual {
        if (teamWalletAddr == address(0)) {
            revert X2EarnInvalidAddress(teamWalletAddr);
        }
        if (appAdmin == address(0)) {
            revert X2EarnInvalidAddress(appAdmin);
        }

        bytes32 id = hashAppName(_appName);

        if (_appSubmitted(id)) {
            revert X2EarnAppAlreadyExists(id);
        }

        // Store the new app
        _apps[id] = X2EarnAppsDataTypes.App(id, _appName, block.timestamp);
        _admin[id] = appAdmin;
        _teamWalletAddress[id] = teamWalletAddr;
        _metadataURI[id] = _appMetadataURI;
        _teamAllocationPercentage[id] = 0;
        _appIds.push(id);

        // Add the submitter as a creator
        _creators[id].push(msg.sender);
        _creatorApps[msg.sender]++;

        emit AppAdded(id, teamWalletAddr, _appName, false);
    }

    /**
     * @dev See {IX2EarnApps-addAppModerator}.
     */
    function addAppModerator(
        bytes32 _appId,
        address _moderator
    ) public onlyRoleAndAppAdmin(DEFAULT_ADMIN_ROLE, _appId) {
        if (_moderator == address(0)) {
            revert X2EarnInvalidAddress(_moderator);
        }

        if (!_appSubmitted(_appId)) {
            revert X2EarnNonexistentApp(_appId);
        }

        if (_moderators[_appId].length >= MAX_MODERATORS) {
            revert X2EarnMaxModeratorsReached(_appId);
        }

        _moderators[_appId].push(_moderator);

        emit ModeratorAddedToApp(_appId, _moderator);
    }

    /**
     * @dev See {IX2EarnApps-addCreator}.
     */
    function addCreator(
        bytes32 _appId,
        address _creator
    ) public onlyRoleAndAppAdmin(DEFAULT_ADMIN_ROLE, _appId) {
        if (_creator == address(0)) {
            revert X2EarnInvalidAddress(_creator);
        }

        if (!_appSubmitted(_appId)) {
            revert X2EarnNonexistentApp(_appId);
        }

        // Check if max number of creators has been reached
        if (_creators[_appId].length >= MAX_CREATORS) {
            revert X2EarnMaxCreatorsReached(_appId);
        }

        if (_contains(_creators[_appId], _creator)) {
            revert X2EarnAlreadyCreator(_creator);
        }

        // Increase the number of apps created by the creator
        _creatorApps[_creator]++;

        // Add the creator to the app
        _creators[_appId].push(_creator);

        emit CreatorAddedToApp(_appId, _creator);
    }

    /**
     * @dev See {IX2EarnApps-setAppAdmin}.
     */
    function setAppAdmin(
        bytes32 _appId,
        address _newAdmin
    ) public onlyRoleAndAppAdmin(DEFAULT_ADMIN_ROLE, _appId) {
        if (!_appSubmitted(_appId)) {
            revert X2EarnNonexistentApp(_appId);
        }

        if (_newAdmin == address(0)) {
            revert X2EarnInvalidAddress(_newAdmin);
        }

        emit AppAdminUpdated(_appId, _admin[_appId], _newAdmin);

        _admin[_appId] = _newAdmin;
    }

    /**
     * @dev See {IX2EarnApps-updateTeamWalletAddress}.
     */
    function updateTeamWalletAddress(
        bytes32 _appId,
        address _newReceiverAddress
    ) public onlyRoleAndAppAdmin(DEFAULT_ADMIN_ROLE, _appId) {
        if (_newReceiverAddress == address(0)) {
            revert X2EarnInvalidAddress(_newReceiverAddress);
        }

        if (!_appSubmitted(_appId)) {
            revert X2EarnNonexistentApp(_appId);
        }

        address oldTeamWalletAddress = _teamWalletAddress[_appId];
        _teamWalletAddress[_appId] = _newReceiverAddress;

        emit TeamWalletAddressUpdated(
            _appId,
            oldTeamWalletAddress,
            _newReceiverAddress
        );
    }

    /**
     * @dev See {IX2EarnApps-setTeamAllocationPercentage}.
     */
    function setTeamAllocationPercentage(
        bytes32 _appId,
        uint256 _percentage
    ) public onlyRoleAndAppAdmin(DEFAULT_ADMIN_ROLE, _appId) {
        if (!_appSubmitted(_appId)) {
            revert X2EarnNonexistentApp(_appId);
        }

        if (_percentage > 100) {
            revert X2EarnInvalidAllocationPercentage(_percentage);
        }

        uint256 oldAllocationPercentage = _teamAllocationPercentage[_appId];
        _teamAllocationPercentage[_appId] = _percentage;

        emit TeamAllocationPercentageUpdated(
            _appId,
            oldAllocationPercentage,
            _percentage
        );
    }

    /**
     * @dev See {IX2EarnApps-updateAppMetadata}.
     */
    function updateAppMetadata(
        bytes32 _appId,
        string memory _newMetadataURI
    ) public onlyRoleAndAppAdminOrModerator(DEFAULT_ADMIN_ROLE, _appId) {
        if (!_appSubmitted(_appId)) {
            revert X2EarnNonexistentApp(_appId);
        }

        string memory oldMetadataURI = _metadataURI[_appId];
        _metadataURI[_appId] = _newMetadataURI;

        emit AppMetadataURIUpdated(_appId, oldMetadataURI, _newMetadataURI);
    }

    // ---------- Internal Functions ------------ //

    /**
     * @dev Check if the app registration has been submitted.
     *
     * @param appId the id of the app
     */
    function _appSubmitted(bytes32 appId) internal view returns (bool) {
        return _apps[appId].id != bytes32(0);
    }

    /**
     * @dev Checks if an element is in an array.
     */
    function _contains(
        address[] storage list,
        address element
    ) private view returns (bool) {
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == element) return true;
        }
        return false;
    }
}
