// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface USDToken {
    
    event Transfer(address indexed from, address indexed to, uint256 value);

    
    event Approval(address indexed owner, address indexed spender, uint256 value);


    function totalSupply() external view returns (uint256);

    
    function balanceOf(address account) external view returns (uint256);

   
    function transfer(address to, uint256 value) external returns (bool);

    
    function allowance(address owner, address spender) external view returns (uint256);

    
    function approve(address spender, uint256 value) external returns (bool);

    
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

interface CarbonWise {
    function getAdmins() external view returns (address[] memory);
}

contract CcMarketPlace {
    /// @dev Structure to represent information about an item listing.
    struct ItemInfo {
        string description;
        uint256 price;
        address lister;
        uint256 itemId;
    }

    /// @dev Mapping to store item information by their unique listing ID.
    mapping(uint256 => ItemInfo) public itemInfoToId;

    /// @dev The address of the administrator of the marketplace.
    address public admin;

    /// @dev The ID to assign to the next listing.
    uint256 public listingId;

    /* ERRORS */

    error MinPriceTooLow();
    error DeadlineTooSoon();
    error MinDurationNotMet();
    error InvalidSignature();
    error ListingDoesNotExist();
    error ListingNotActive();
    error PriceNotMet(int256 difference);
    error ListingExpired();
    error PriceMismatch(uint256 originalPrice);
    error NoImageUrl();
    error NotAdmin();
    error NotEnoughToken();

    /* EVENTS */
    event ListingCreated(
        string _description,
        uint indexed _price);

    event ListingEdited(string _description, uint listingId, uint _newPrice);

    event ListingBought(
        uint listingId,
        uint indexed _price);

    USDToken carbonwisetoken;
    CarbonWise carbonwise;

    modifier onlyAdmins() {
        bool isAdmin;
        for (uint i = 0; i < carbonwise.getAdmins().length; i++) {
            if (carbonwise.getAdmins()[i] == msg.sender) {
                isAdmin = true;
            }
        }
        require(isAdmin, "Not Admin");
        _;
    }

    constructor(address tokenAddress, address carbonWiseAddr) {
        carbonwisetoken = USDToken(tokenAddress);
        carbonwise = CarbonWise(carbonWiseAddr);
    }

    function createListing(
        string calldata _description,
        uint _price
    ) public onlyAdmins {
        // Append item information to storage.
        // append to Storage
        listingId++;
        ItemInfo storage newItemInfo = itemInfoToId[listingId];
        newItemInfo.description = _description;
        newItemInfo.price = _price;
        newItemInfo.lister = msg.sender;
        newItemInfo.itemId = listingId;
        emit ListingCreated(_description, _price);
    }

    /// @dev Buy an item from the marketplace.
    /// @param _listingId The unique identifier of the item listing to buy.
    function buyListing(uint256 _listingId) public {
        ItemInfo memory newItemInfo = itemInfoToId[_listingId];
        if (newItemInfo.itemId != _listingId) revert ListingDoesNotExist();
        if (carbonwisetoken.balanceOf(msg.sender) < newItemInfo.price)
            revert NotEnoughToken();

        // transfer tokens from buyer to seller
        carbonwisetoken.transferFrom(msg.sender, address(carbonwise), newItemInfo.price * 10 ** 18);

        emit ListingBought(listingId, newItemInfo.price);
    }

    function updateListing(
        string calldata _description,
        uint256 _listingId,
        uint256 _newPrice
    ) public onlyAdmins {
        if (_listingId > listingId) revert ListingDoesNotExist();
        ItemInfo storage itemInfo = itemInfoToId[_listingId];
        itemInfo.description = _description;
        itemInfo.price = _newPrice;
        emit ListingEdited(_description, listingId, _newPrice);
    }

    /**
     * @dev Get information about an item listing by its unique identifier.
     * @param _listingId The unique identifier of the item listing.
     * @return ItemInfo The information about the item listing.
     */
    function getItemInfo(
        uint256 _listingId
    ) public view returns (ItemInfo memory) {
        return itemInfoToId[_listingId];
    }

    function getAllItemInfo() public view returns (ItemInfo[] memory) {
        ItemInfo[] memory allItemInfo = new ItemInfo[](listingId);
        for (uint i = 0; i < listingId; i++) {
            allItemInfo[i] = itemInfoToId[i + 1];
        }
        return allItemInfo;
    }
}