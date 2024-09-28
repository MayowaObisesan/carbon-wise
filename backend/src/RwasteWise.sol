// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Carbon-Wise Receipt Token
 * @author Mayowa Obisesan, Isaac Wanger, konyeri Joshua and Mitong Dapal
 * @notice This is the Receipt token that the user gets upon successful deposit of pet bottles on the Carbon-Wise Protocol
 * @dev This implements an ERC2O Token using the OpenZeppelin library
 *
 */

contract RwasteWise is ERC20 {
    address private i_owner;
    address public depositorAddress;
    uint initialSupply;

    constructor() ERC20("WasteWise Receipt Token", "RWISE") {
        i_owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == i_owner, "Only the Owner can call this function");
        _;
    }

    function mint(
        address userAccount,
        uint256 amountToMint
    ) external onlyOwner {
        _mint(userAccount, amountToMint);
    }

    function mintReceipt(address userAccount, uint256 amountToMint) external {
        _mint(userAccount, amountToMint);
    }

    function burn(
        address userAccount,
        uint256 amountToBurn
    ) external onlyOwner {
        _burn(userAccount, amountToBurn);
    }

    function burnReceipt(address userAccount, uint256 amountToBurn) external {
        _burn(userAccount, amountToBurn);
    }
}
