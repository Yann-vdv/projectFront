import * as React from "react";
import Web3 from "web3";
import Proposals from "./Proposals";

interface propsI {
    instance:any
    userAddress:string
    web3init: Web3
    onWorkflowStatusChange: (newStatus: string) => void
    contractAdress: string
}

const AdminPanel =  (props:propsI) => {
    const [currentState, setCurrentState] = React.useState("initial");
    
    async function getEventPanel() {
        try {
            const status = await props.instance.methods.getEvent().call({ from: props.userAddress });
            console.log("État actuel du contrat :", status);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'état :", error);
        }
    }

    const sendNewWorkflowStatus = (currentState: string) => {
        props.onWorkflowStatusChange(currentState);
    };

    React.useEffect(() => {
        if(props.instance)
        {
            getEventPanel();
        }
    }, [props.instance]);

    async function startRegisteringProposalsPanel() {
        let gasEstimate = await props.instance.methods
            .startRegisteringProposals()
            .estimateGas({ from: props.userAddress });

        let encode = await props.instance.methods.startRegisteringProposals().encodeABI();
        await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: props.contractAdress,
            gas: gasEstimate,
            data: encode,
        });
        setCurrentState("startRegisteringProposals")
        getEventPanel();
        props.onWorkflowStatusChange("startRegisteringProposals");
    }

    async function stopRegisteringProposalsPanel() {
        let gasEstimate = await props.instance.methods
            .stopRegisteringProposals()
            .estimateGas({ from: props.userAddress });

        let encode = await props.instance.methods.stopRegisteringProposals().encodeABI();
        await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: props.contractAdress,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("stopRegisteringProposals");
        sendNewWorkflowStatus("stopRegisteringProposals");
    }

    async function startVotingPanel() {
        let gasEstimate = await props.instance.methods
            .startVoting()
            .estimateGas({ from: props.userAddress });

        let encode = await props.instance.methods.startVoting().encodeABI();
        await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: props.contractAdress,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("startVoting");
        sendNewWorkflowStatus("startVoting");
    }

    async function stopVotingPanel() {
        let gasEstimate = await props.instance.methods
            .stopVoting()
            .estimateGas({ from: props.userAddress });

        let encode = await props.instance.methods.stopVoting().encodeABI();
        await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: props.contractAdress,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("stopVoting");
        sendNewWorkflowStatus("stopVoting");
    }

    async function VoteTalling() {
        let gasEstimate = await props.instance.methods
            .getWinner()
            .estimateGas({ from: props.userAddress });

        let encode = await props.instance.methods.getWinner().encodeABI();
        await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: props.contractAdress,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("TallingVote");
        sendNewWorkflowStatus("TallingVote");
    }

    return (
        <div className="border border-b h-full" style={{ width: 250 }}>
            <div className="border-b">
                <h3>Panel Admin</h3>
            </div>
            <div className="border-b">
                <p onClick={() => startRegisteringProposalsPanel()} style={{ cursor: "pointer", padding: "5px", margin: "5px", backgroundColor: currentState === "startRegisteringProposals" ? "#FFA500" : "#4CAF50", color: "white", border: "1px solid black", borderRadius: "5px" }}>Début des propositions</p>
                <p onClick={() => stopRegisteringProposalsPanel()} style={{ cursor: "pointer", padding: "5px", margin: "5px", backgroundColor: currentState === "stopRegisteringProposals" ? "#FFA500" : "#4CAF50", color: "white", border: "1px solid black", borderRadius: "5px" }}>Fin des propositions</p>
                <p onClick={() => startVotingPanel()} style={{ cursor: "pointer", padding: "5px", margin: "5px", backgroundColor: currentState === "startVoting" ? "#FFA500" : "#4CAF50", color: "white", border: "1px solid black", borderRadius: "5px" }}>Début du vote</p>
                <p onClick={() => stopVotingPanel()} style={{ cursor: "pointer", padding: "5px", margin: "5px", backgroundColor: currentState === "stopVoting" ? "#FFA500" : "#4CAF50", color: "white", border: "1px solid black", borderRadius: "5px" }}>Fin des votes</p>
                <p onClick={() => VoteTalling()} style={{ cursor: "pointer", padding: "5px", margin: "5px", backgroundColor: currentState === "TallingVote" ? "#FFA500" : "#4CAF50", color: "white", border: "1px solid black", borderRadius: "5px" }}>Comptage des votes</p>
            </div>
        </div>
    );
};
export default AdminPanel;