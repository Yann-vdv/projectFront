// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

    constructor() Ownable(msg.sender) {}

    mapping(address => Voter) public voterInfo;

    WorkflowStatus public workflowStatus;
    uint public currentVoteId = 1;

    event VoterRegistered();
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    struct Voter {
        bool isRegistered;
        string nickname;
        uint voteId;
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

    modifier check(){
        require(voterInfo[msg.sender].isRegistered==true, "you are not autorised");
        _;
    }

    function test() public pure returns (string memory) {
        return "coucou je test";
    }

    function authorize(address _address) public onlyOwner  {
        voterInfo[_address].isRegistered = true;
        emit VoterRegistered();
    }

    function startRegisteringProposals() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "La session d'enregistrement des propositions est deja demarre");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
    }

    function stopRegisteringProposals() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d enregistrement des propositions n a pas demarre");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        }

    function startVoting() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "La session de vote a deja demarre ou la session des proprositions n est pas finis");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
    }

    function stopVoting() public onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "La session de vote n a pas demarre");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
    }

    function proposing(string memory _description, address _address) public check {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d enregistrement des propositions n a pas demarre");
        proposals.push(Proposal({
            description: _description,
            voteCount: 0,
            owner : _address
        }));
    }

    function vote(uint _propoalID) public check {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "La session d enregistrement des propositions n a pas demarre");
        require(_propoalID < proposals.length, "L'ID de proposition n est pas valide");
        if (voterInfo[msg.sender].voteId == currentVoteId) {
            uint oldProposalID = voterInfo[msg.sender].votedProposalId;
            proposals[oldProposalID].voteCount--;
        } else {
            voterInfo[msg.sender].voteId = currentVoteId;
        }
        voterInfo[msg.sender].votedProposalId = _propoalID;
        proposals[_propoalID].voteCount++;
    }
}
