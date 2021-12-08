// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";

contract AtylaToken is ERC20, Ownable{

    mapping(address => bool) private minterContracts;

    constructor() ERC20("Atyla Token", "ATYLA"){
        //transferOwnership("address de contrato RifasViajes");
    }

    modifier onlyMinterContracts() {
        require(minterContracts[msg.sender] == true, "Caller is not a minter contract");
        _;
    }

    function mintAir(uint256 amount) external onlyOwner{
         _mint(msg.sender, amount);
    }

    function mintBacked(uint256 amount) external  onlyMinterContracts{
         _mint(msg.sender, amount);
    }

    function burn(address account, uint256 amount) external  onlyOwner{
        _burn(account, amount);
    }

    function addMinterContract(address contractAddress) external onlyOwner{
         minterContracts[contractAddress] = true;
    }

    function removeMinterContract(address contractAddress) external onlyOwner{
         minterContracts[contractAddress] = false;
    }

}

