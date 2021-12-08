// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AtylaToken.sol";
import "./Donate.sol";

contract AtylaNFTs is ERC1155, Ownable{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 MAX_INT = 2**256 - 1;

    mapping(uint256 => uint256) private currentSupplies;
    mapping(uint256 => uint256) private supplyCaps;
    mapping(uint256 => uint256) private prices;

    uint256 private constant NFTC1 = 0;
    uint256 private constant NFTC2 = 1;
    uint256 private constant NFTC3 = 2;
    uint256 private constant NFTC4 = 3;

    address private donationRecipient;
    address private contractAddressBUSD = 0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee;
    IERC20 private BUSD = IERC20(contractAddressBUSD);
    address private contractAddressATYLA = 0x81ad7F16424233b2272672860E7be3F749ca10f0;
    IERC20 private  ATYLA = IERC20(contractAddressATYLA);
    AtylaToken private AT = AtylaToken(contractAddressATYLA);
    address private contractAddressDonate = 0x81ad7F16424233b2272672860E7be3F749ca10f0;

    Donate private Don = Donate(contractAddressDonate);
    uint256 private transferDonation = 5*10**uint(AT.decimals()-1);

    constructor() ERC1155("https://lfhjun1gu6if.usemoralis.com/{id}.json"){
        _mint(msg.sender, NFTC1, 1, "");
        currentSupplies[NFTC1] = 1;
        supplyCaps[NFTC1] = 1;
        prices[NFTC1] = 2*10**uint(AT.decimals());
        _mint(msg.sender, NFTC2, 5, "");
        currentSupplies[NFTC2] = 5;
        supplyCaps[NFTC2] = 5;
        prices[NFTC2] = 10**uint(AT.decimals());
        _mint(msg.sender, NFTC3, 5, "");
        currentSupplies[NFTC3] = 5;
        supplyCaps[NFTC3] = 5;
        prices[NFTC3] = 10**uint(AT.decimals());
        _mint(msg.sender, NFTC4, 5, "");
        currentSupplies[NFTC4] = 5;
        supplyCaps[NFTC4] = 5;
        prices[NFTC4] = 10**uint(AT.decimals());
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

    function increaseCap(uint256 id, uint256 amount) external onlyOwner{
        supplyCaps[id] = supplyCaps[id].add(amount);
    }

    function decreaseCap(uint256 id, uint256 amount) external onlyOwner{
        require(currentSupplies[id] <= supplyCaps[id].sub(amount),
            "Supply cap must remain greater or equal to current supply.");
        supplyCaps[id] = supplyCaps[id].sub(amount);
    }

    function mintBackedATYLA(address account, uint256 id, uint256 amount) external{
        require(currentSupplies[id].add(amount) <= supplyCaps[id], "You can't mint that many tokens.");
        ATYLA.safeTransfer(donationRecipient, prices[id].mul(amount));
        _mint(account, id, amount, "");
        currentSupplies[id] = currentSupplies[id].add(amount);
    }

    function mintBackedBUSD(address account, uint256 id, uint256 amount) external{
        require(currentSupplies[id].add(amount) <= supplyCaps[id], "You can't mint that many tokens.");
        BUSD.safeTransfer(donationRecipient, prices[id].mul(amount));
        _mint(account, id, amount, "");
        currentSupplies[id] = currentSupplies[id].add(amount);
    }

    function burn(address account, uint256 id, uint256 amount) external {
        require(msg.sender == account, "You can only burn your own tokens");
        _burn(account, id, amount);
        currentSupplies[id] = currentSupplies[id].sub(amount);
    } 

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        Don.buyATYLA(transferDonation);
        _safeTransferFrom(from, to, id, amount, data);
    }

    function setTransferDonation(uint256 donationAmount) external onlyOwner{
        transferDonation = donationAmount;
    }





}
