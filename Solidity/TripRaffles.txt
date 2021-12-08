// SPDX-License-Identifier: MIT

pragma solidity 0.5.5;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/crowdsale/Crowdsale.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/token/ERC20/ERC20.sol";

contract TripRaffles is Crowdsale{
    
    constructor() public Crowdsale(5000, 0x3e9aC16624835836033AD555A1b154e6a2aFAe50, 
    ERC20(0x200E87877a778db1d5311dF42015D2D0287A642d)) {
    }

    function buyWithBUSD(uint256 amount) external {
        
    }

    function buyWithATYLA(uint256 amount) external {
        
    }
}
