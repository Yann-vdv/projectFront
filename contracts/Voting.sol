// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Voting
/// @author Yann Van De Vaire & Louis Seeuws

contract Voting is Ownable {

    ///@dev enregistre le propriétaire/admin & le workflow
    constructor() Ownable(msg.sender) {
        register("Admin");
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }
    
    ///@dev récupère des infomation complémentaire à un utilisateur
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

    ///@dev convertis deux string pour pouvoir comparer les deux
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    ///@dev permet de s'assurer que l'expéditeur est enregistrer dans la whiteList
    modifier check(){
        require(voterInfo[msg.sender].isRegistered, "you are not autorised");
        _;
    }

    ///@notice requête pour s'inscrire dans la whitList
    ///@param _nickName pseudo du nouvel inscris
    function register(string memory _nickName) public returns (string memory) {
        if (voterInfo[msg.sender].isRegistered) {
            return "Vous avez deja un compte";
        } else if (compareStrings(_nickName, "Admin") && msg.sender != owner()) {
            return "Vous n'etes pas l'Admin";
        } else {
            Voter memory newVoter = voterInfo[msg.sender];
            newVoter.isRegistered = true;
            newVoter.nickname = _nickName;
            newVoter.myVoteId = 0;
            newVoter.myProposalId = 0;
            newVoter.votedProposalId = 0;
            voterInfo[msg.sender] = newVoter;
            voters.push(msg.sender);
            emit VoterRegistered(msg.sender);
            return "compte ajoute";
        }
    }

    ///@notice requête pour vérifier si l'expéditeur est déjà enregistrer
    function login() public view returns (bool, string memory) {
        if (voterInfo[msg.sender].isRegistered) {
            return (true,voterInfo[msg.sender].nickname);
        } else {
            return (false,"Vous n'avez pas de compte");
        }
    }

    ///@notice démarrer la session d'enregistrement des propositions
    function startRegisteringProposals() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "La session d'enregistrement des propositions est deja demarre");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    ///@notice terminer la session d enregistrement des propositions
    function stopRegisteringProposals() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d enregistrement des propositions n a pas demarre");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    ///@notice démarrer la session de vote
    function startVoting() public onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "La session de vote a deja demarre ou la session des proprositions n est pas finis");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    ///@notice terminer la session de vote
    function stopVoting() public onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "La session de vote n a pas demarre");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    ///@notice enregistre un proposition
    ///@param _description description de la proposition
    function proposing(string memory _description) public check {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "La session d enregistrement des propositions n a pas demarre");
        proposals.push(Proposal({
            description: _description,
            voteCount: 0,
            owner : msg.sender
        }));
        uint proposalId = proposals.length -1;
        emit ProposalRegistered(proposalId);
    }

    ///@notice requête pour voter pour une proposition
    ///@param _proposalId id de la proposition
    function vote(uint _proposalId) public check {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "La session d enregistrement des propositions n a pas demarre");
        require(_proposalId < proposals.length, "L'ID de proposition n est pas valide");
        if (voterInfo[msg.sender].myVoteId == currentVoteId) {
            uint oldProposalID = voterInfo[msg.sender].votedProposalId;
            proposals[oldProposalID].voteCount--;
        } else {
            voterInfo[msg.sender].myVoteId = currentVoteId;
        }
        voterInfo[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        emit Voted (msg.sender, _proposalId);
    }

    ///@notice requête pour récupèrer le score des votes d'une proposition par son ID
    ///@param _proposalId id de la proposition
    function getVote(uint _proposalId) public check view returns (uint) {
        require(_proposalId < proposals.length, "L ID de proposition n'est pas valide");
        return proposals[_proposalId].voteCount;
    }

    ///@notice requête pour répcupèrer les propositions
    function getProposals() public view check returns (Proposal[] memory) {
        return proposals;
    }

    ///@notice requête pour récupérer la liste des adresses des utilisateurs
    function getUsers() public view onlyOwner returns (address[] memory) {
        return voters;
    }

    ///@notice requête pour récupérer la liste des informations (sauf adresse) des utilisateurs
    function getUsersData() public view check returns (Voter[] memory) {
        Voter[] memory votersData = new Voter[](voters.length);
        for (uint i = 0; i < voters.length; i++) {
            votersData[i] = voterInfo[voters[i]];
        }
        return votersData;
    }
    
    ///@notice requête pour récupérer le workflow du contract
    function getEvent() public view onlyOwner returns (string memory) {
        if (workflowStatus == WorkflowStatus.RegisteringVoters) {
            return "RegisteringVoters";
        } else if (workflowStatus == WorkflowStatus.ProposalsRegistrationStarted) {
            return "ProposalsRegistrationStarted";
        } else if (workflowStatus == WorkflowStatus.ProposalsRegistrationEnded) {
            return "ProposalsRegistrationEnded";
        } else if (workflowStatus == WorkflowStatus.VotingSessionStarted) {
            return "VotingSessionStarted";
        } else if (workflowStatus == WorkflowStatus.VotingSessionEnded) {
            return "VotingSessionEnded";
        } else if (workflowStatus == WorkflowStatus.VotesTallied) {
            return "VotesTallied";
        }
        else {
            return "unknow";
        }
    }

    ///@notice requête pour récupéré la proposition guagnante
    function getWinner() public returns (Proposal memory) {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "La session d enregistrement des propositions n a pas demarre");
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
        uint winningProposalId;
        uint maxCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxCount) {
                maxCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        return proposals[winningProposalId];
    }


    ///@dev test event
    event TestEvent(bool status, address indexed player);
    function triggerTestEvent() public {
        emit TestEvent(true, msg.sender);
    }
    ///@dev test User
    function getUsersTest() public view returns (address[] memory) {
        return voters;
    }
    function getUsersDataTest(address _address) public view returns (Voter memory) {
        return voterInfo[_address];
    }
    function getMyDataTest() public view returns (Voter memory, address) {
        return (voterInfo[msg.sender],msg.sender);
    }
}