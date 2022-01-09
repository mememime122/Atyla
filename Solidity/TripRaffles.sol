// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/utils/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC20/utils/SafeERC20.sol";
import "./AtylaToken.sol";
import "./Donate.sol";

contract TripRaffles is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for AtylaToken;

    uint256 latestRaffleId = 0;
    mapping(uint256 => bool) private activeRaffles;
    mapping(uint256 => uint256) private totalTicketNum;
    mapping(uint256 => uint256) private targetTicketNum;
    mapping(uint256 => address[]) private participants;
    mapping(uint256 => mapping(address => uint256)) private ticketNum;
    mapping(uint256 => address) private raffleWinner;
    // mapping(uint256 => uint256) private endDate;

    address private contractAddressBUSD = 0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee;
    IERC20 private BUSD = IERC20(contractAddressBUSD);
    address private contractAddressATYLA = 0x8fd5f66668eacD509cc92E9cf3D0a0eB3de78772;
    AtylaToken private ATYLA = AtylaToken(contractAddressATYLA);
    address private contractAddressDonate = 0x64AD9F4544D2ACB06FF8c1Fb4D2F964D146EFC66;
    Donate private Don = Donate(contractAddressDonate);

    modifier raffleIsActive(uint256 raffleId) {
        require(activeRaffles[raffleId], "Invalid raffle ID");
        _;
    }

    function createRaffle(uint256 targetPrice) external onlyOwner returns (uint256){
        latestRaffleId = latestRaffleId.add(1);
        activeRaffles[latestRaffleId] =  true;
        targetTicketNum[latestRaffleId] = targetPrice;
        return latestRaffleId;
    }

    function endRaffle(uint256 raffleId) external onlyOwner raffleIsActive(raffleId) returns (address){
        // require(endDate[raffleId] > now, "Raffle end date hasn't arrived yet");
        address winner;
        if (totalTicketNum[raffleId] >= targetTicketNum[raffleId]){
            uint256 pseudoRandom = uint(keccak256(abi.encode(block.difficulty, block.timestamp, participants[raffleId])));
            uint256 winnerTicket = pseudoRandom.mod(totalTicketNum[raffleId]).add(1);
            uint256 ticketsCounted = 0;
            uint256 i = 0;
            while (ticketsCounted < winnerTicket){
                address participant = participants[raffleId][i];
                ticketsCounted = ticketsCounted.add(ticketNum[raffleId][participant]);
                winner = participant;
                i++;
            }
            // Return some ATYLA to losers
            uint256 loserPie = totalTicketNum[raffleId].sub(ticketNum[raffleId][winner]);
            uint256 consolationPrize = totalTicketNum[raffleId].sub(targetTicketNum[raffleId]);
            for (uint j = 0; j < participants[raffleId].length; j++){
                address participant = participants[raffleId][j];
                if (participant != winner){
                    // returnAmount is calculated in a way that doesn't avoid phantom overflow
                    uint256 returnAmount = consolationPrize.mul(ticketNum[raffleId][participant]);
                    returnAmount = returnAmount.div(loserPie);
                    ATYLA.safeTransfer(participant, returnAmount);
                }
            }
        } else{
            for (uint i = 0; i < participants[raffleId].length; i++){
                address participant = participants[raffleId][i];
                ATYLA.safeTransfer(participant, ticketNum[raffleId][participant]);
            }
            winner = address(this); // Atyla Foundation may win some BUSD :)
        }

        activeRaffles[raffleId] =  false;
        raffleWinner[raffleId] = winner;
        return winner;
    }

    //function winnerContactInfo(string name, string surname, string email, string phone) external onlyWinner{}

    function getRaffleWinner(uint256 raffleId) external view returns (address){
        require(!activeRaffles[raffleId], "Ongoing raffle, no winner yet");
        require(raffleWinner[raffleId] != address(0), "This raffle doesn't exist");
        return raffleWinner[raffleId];
    }

    function getTotalTicketNum(uint256 raffleId) external view raffleIsActive(raffleId) returns (uint256){
        return totalTicketNum[raffleId];
    }

    function getTMyTicketNum(uint256 raffleId) external view raffleIsActive(raffleId) returns (uint256){
        return ticketNum[raffleId][msg.sender];
    }

    function getTargetTicketNum(uint256 raffleId) external view raffleIsActive(raffleId) returns (uint256){
        return targetTicketNum[raffleId];
    }
    
    function buyWithBUSD(uint256 raffleId, uint256 amount) external raffleIsActive(raffleId){
        address donationRecipient = Don.getDonationRecipient();
        BUSD.safeTransferFrom(msg.sender, donationRecipient, amount);
        ATYLA.mintBacked(amount);
        if (ticketNum[raffleId][msg.sender] == 0){
            participants[raffleId].push(msg.sender);
        }
        ticketNum[raffleId][msg.sender] = ticketNum[raffleId][msg.sender].add(amount);
        totalTicketNum[raffleId] = totalTicketNum[raffleId].add(amount);
    }

    function buyWithATYLA(uint256 raffleId, uint256 amount) external raffleIsActive(raffleId){
        ATYLA.safeTransferFrom(msg.sender, address(this), amount);
        if (ticketNum[raffleId][msg.sender] == 0){
            participants[raffleId].push(msg.sender);
        }
        ticketNum[raffleId][msg.sender] = ticketNum[raffleId][msg.sender].add(amount);
        totalTicketNum[raffleId] = totalTicketNum[raffleId].add(amount);
    }

}
