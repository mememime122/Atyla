// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AtylaToken.sol";
import "./Donate.sol";

contract AtylaNFTs is ERC1155, Ownable{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for AtylaToken;

    uint256 MAX_INT = 2**256 - 1;

    mapping(uint256 => uint256) private currentSupplies;
    mapping(uint256 => uint256) private supplyCaps;
    mapping(uint256 => uint256) private prices;

    uint256 private constant NFTC1 = 0;
    uint256 private constant NFTC2 = 1;
    uint256 private constant NFTC3 = 2;
    uint256 private constant NFTC4 = 3;

    // address private donationRecipient;
    address private contractAddressBUSD = 0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee;
    IERC20 private BUSD = IERC20(contractAddressBUSD);
    address private contractAddressATYLA = 0x8fd5f66668eacD509cc92E9cf3D0a0eB3de78772;
    // IERC20 private  ATYLA = IERC20(contractAddressATYLA);
    AtylaToken private ATYLA = AtylaToken(contractAddressATYLA);
    address private contractAddressDonate = 0x64AD9F4544D2ACB06FF8c1Fb4D2F964D146EFC66;
    Donate private Don = Donate(contractAddressDonate);

    uint256 private transferDonation = 5*10**uint(ATYLA.decimals()-1);

    constructor() ERC1155("https://lfhjun1gu6if.usemoralis.com/{id}.json"){
        _mint(msg.sender, NFTC1, 1, "");
        currentSupplies[NFTC1] = 1;
        supplyCaps[NFTC1] = 1;
        prices[NFTC1] = 2*10**uint(ATYLA.decimals());
        _mint(msg.sender, NFTC2, 5, "");
        currentSupplies[NFTC2] = 5;
        supplyCaps[NFTC2] = 5;
        prices[NFTC2] = 10**uint(ATYLA.decimals());
        _mint(msg.sender, NFTC3, 5, "");
        currentSupplies[NFTC3] = 5;
        supplyCaps[NFTC3] = 5;
        prices[NFTC3] = 10**uint(ATYLA.decimals());
        _mint(msg.sender, NFTC4, 5, "");
        currentSupplies[NFTC4] = 5;
        supplyCaps[NFTC4] = 5;
        prices[NFTC4] = 10**uint(ATYLA.decimals());
    }

    function mintAir(address account, uint256 id, uint256 amount) external onlyOwner{
        if (currentSupplies[id].add(amount) <= supplyCaps[id]){
            supplyCaps[id] = currentSupplies[id].add(amount);
        }
        _mint(account, id, amount, "");
        currentSupplies[id] = currentSupplies[id].add(amount);
        if (prices[id] == 0){
            prices[id] = MAX_INT;
        }
    }

    function setPrice(uint256 id, uint256 price) external onlyOwner{
        prices[id] = price;
    }

    function getPrice(uint256 id) external view returns(uint256) {
        return prices[id];
    }

    function increaseCap(uint256 id, uint256 amount) external onlyOwner{
        supplyCaps[id] = supplyCaps[id].add(amount);
    }

    function decreaseCap(uint256 id, uint256 amount) external onlyOwner{
        require(currentSupplies[id] <= supplyCaps[id].sub(amount),
            "Supply cap must remain greater or equal to current supply.");
        supplyCaps[id] = supplyCaps[id].sub(amount);
    }

    function getCap(uint256 id) external view returns(uint256) {
        return supplyCaps[id];
    }

    function mintBackedATYLA(address account, uint256 id, uint256 amount) external{
        require(currentSupplies[id].add(amount) <= supplyCaps[id], "You can't mint that many tokens.");
        address donationRecipient = Don.getDonationRecipient();
        ATYLA.safeTransferFrom(msg.sender, donationRecipient, prices[id].mul(amount));
        _mint(account, id, amount, "");
        currentSupplies[id] = currentSupplies[id].add(amount);
    }

    function mintBackedBUSD(address account, uint256 id, uint256 amount) external{
        require(currentSupplies[id].add(amount) <= supplyCaps[id], "You can't mint that many tokens.");
        address donationRecipient = Don.getDonationRecipient();
        BUSD.safeTransferFrom(msg.sender, donationRecipient, prices[id].mul(amount));
        _mint(account, id, amount, "");
        currentSupplies[id] = currentSupplies[id].add(amount);
    }

    function burn(address account, uint256 id, uint256 amount) external {
        require(msg.sender == account, "You can only burn your own tokens");
        _burn(account, id, amount);
        currentSupplies[id] = currentSupplies[id].sub(amount);
    } 

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );

        address donationRecipient = Don.getDonationRecipient();
        BUSD.safeTransferFrom(msg.sender, donationRecipient, transferDonation);
        ATYLA.mintBacked(transferDonation);
        ATYLA.safeTransfer(msg.sender, transferDonation);

        _safeTransferFrom(from, to, id, amount, data);
    }

    function setTransferDonation(uint256 donationAmount) external onlyOwner{
        transferDonation = donationAmount;
    }

    function getTransferDonation() external view returns(uint256) {
        return transferDonation;
    }

}
