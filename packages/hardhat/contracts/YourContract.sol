//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";

contract YourContract {
    address public immutable owner;
    string public proposal;
    uint256 public totalVotes;
    bool public votingEnded;

    mapping(address => bool) public hasVoted;
    mapping(string => uint256) public votesForProposal;

    event NewVote(address indexed voter, string proposal, uint256 voteCount);
    event VotingEnded(string proposal, uint256 totalVotes);

    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
        votingEnded = false;
    }

    function setProposal(string memory _proposal) public isOwner {
        require(!votingEnded, "Voting has already ended.");
        proposal = _proposal;
        totalVotes = 0;
        emit NewVote(msg.sender, _proposal, totalVotes);
    }

    function vote() public {
        require(!votingEnded, "Voting has already ended.");
        require(!hasVoted[msg.sender], "You have already voted.");
        
        hasVoted[msg.sender] = true;
        
        votesForProposal[proposal] += 1;
        totalVotes += 1;
        
        emit NewVote(msg.sender, proposal, votesForProposal[proposal]);
    }

    function endVoting() public isOwner {
        require(!votingEnded, "Voting has already ended.");
        votingEnded = true;
        emit VotingEnded(proposal, totalVotes);
    }

    function withdraw() public isOwner {
        (bool success, ) = owner.call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    receive() external payable {}
}


