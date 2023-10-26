// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

    constructor() Ownable(msg.sender) {
        register(msg.sender,"Admin");
    }

    mapping(address => Voter) public voterInfo;

    WorkflowStatus public workflowStatus;
    uint public currentVoteId = 1;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    struct Voter {
        bool isRegistered;
        string nickname;
        uint myVoteId;
        uint myProposalId;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
        address owner;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    Proposal[] public proposals;
    address[] public voters;

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    modifier check(){
        require(voterInfo[msg.sender].isRegistered, "you are not autorised");
        _;
    }

    function register(address _address, string memory _nickName) public returns (string memory) {
        if (voterInfo[_address].isRegistered) {
            return "Vous avez deja un compte";
        } else if (compareStrings(_nickName, "Admin") && _address != owner()) {
            return "Vous n'etes pas l'Admin";
        } else {
            Voter storage newVoter = voterInfo[_address];
            newVoter.isRegistered = true;
            newVoter.nickname = _nickName;
            newVoter.myVoteId = 0;
            newVoter.myProposalId = 0;
            newVoter.votedProposalId = 0;
            voters.push(_address);
            return "compte ajoute";
        }
    }

    function authorize(address _address) public onlyOwner  {
        voterInfo[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    function startRegisteringProposals() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "La session d'enregistrement des propositions est deja demarre");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    function stopRegisteringProposals() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d enregistrement des propositions n a pas demarre");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    function startVoting() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "La session de vote a deja demarre ou la session des proprositions n est pas finis");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    function stopVoting() public onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "La session de vote n a pas demarre");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    function proposing(string memory _description, address _address) public check {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d enregistrement des propositions n a pas demarre");
        proposals.push(Proposal({
            description: _description,
            voteCount: 0,
            owner : _address
        }));
        uint proposalId = proposals.length -1;
        emit ProposalRegistered(proposalId);
    }

    function vote(uint _propoalID) public check {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "La session d enregistrement des propositions n a pas demarre");
        require(_propoalID < proposals.length, "L'ID de proposition n est pas valide");
        if (voterInfo[msg.sender].myVoteId == currentVoteId) {
            uint oldProposalID = voterInfo[msg.sender].votedProposalId;
            proposals[oldProposalID].voteCount--;
        } else {
            voterInfo[msg.sender].myVoteId = currentVoteId;
        }
        voterInfo[msg.sender].votedProposalId = _propoalID;
        proposals[_propoalID].voteCount++;
        emit Voted (msg.sender, _propoalID);
    }

    function getVote(uint _proposalId) public check view returns (uint) {
        require(_proposalId < proposals.length, "L ID de proposition n'est pas valide");
        return proposals[_proposalId].voteCount;
    }

    function getProposals() public view check returns (Proposal[] memory) {
        return proposals;
    }

    function getUsers() public view check returns (Voter[] memory) {
        Voter[] memory votersData;
        for (uint i = 0; i < voters.length; i++) {
            votersData[i] = voterInfo[voters[i]];
        }
        return votersData;
    }

    function getWinner() public view returns (Proposal memory) {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Le vote n a pas encore ete comptabilise");
        uint winningProposalId ;
        uint maxCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxCount) {
                maxCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        return proposals[winningProposalId];
    }
}