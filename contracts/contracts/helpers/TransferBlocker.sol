// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title TransferBlocker
/// @notice This contract blocks direct transfers of VET, ERC721, ERC1155 and calls/data to the contract.
contract TransferBlocker {
    /**
     * @notice Direct transfers of VET to this contract are not allowed.
     */
    receive() external payable virtual {
        revert("Unauthorized: contract does not accept VET");
    }

    /**
     * @notice Contract does not accept calls/data.
     */
    fallback() external payable {
        revert("Unauthorized: contract does not accept calls/data");
    }

    /**
     * @notice Direct transfers of ERC721 tokens to this contract are not allowed.
     *
     * @dev supported only when safeTransferFrom is used
     */
    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        revert("Unauthorized: contract does not accept direct transfer of ERC721");
    }

    /**
     * @notice Direct transfers of ERC1155 tokens to this contract are not allowed.
     */
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        revert("Unauthorized: contract does not accept ERC1155 tokens");
    }

    /**
     * @notice Direct transfers of ERC1155 tokens to this contract are not allowed.
     */
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        revert("Unauthorized: contract does not accept batch transfers of ERC1155 tokens");
    }
}
