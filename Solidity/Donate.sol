// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AtylaToken.sol";

contract Donate is Ownable{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for AtylaToken;

    address private donationRecipient;
    address private contractAddressBUSD = 0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee;
    IERC20 private BUSD = IERC20(contractAddressBUSD);
    address private contractAddressATYLA = 0x8fd5f66668eacD509cc92E9cf3D0a0eB3de78772;
    AtylaToken private ATYLA = AtylaToken(contractAddressATYLA);

    constructor(){
        donationRecipient = msg.sender;
    }

    function donate(uint256 amount) external {
         BUSD.safeTransferFrom(msg.sender, donationRecipient, amount);
    }

    function buyATYLA(uint256 amount) external {
        BUSD.safeTransferFrom(msg.sender, donationRecipient, amount);
        ATYLA.mintBacked(amount);
        ATYLA.safeTransfer(msg.sender, amount);
    }

    function getDonationRecipient() external view returns (address){
        return donationRecipient;
    }

    function changeDonationRecipient(address newRecipient) external  onlyOwner{
         donationRecipient = newRecipient;
    }

}
