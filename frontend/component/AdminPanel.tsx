import * as React from "react";
import Web3 from "web3";
import Proposals from "./Proposals";

interface propsI {
    instance:any,
    userAddress:string
    web3init: Web3;
    onWorkflowStatusChange: (newStatus: string) => void;
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
        const addressContrat = '0x17d1eaC511B5bEd6176D093743e77EBff3000478';
        let gasEstimate = await props.instance.methods
            .startRegisteringProposals()
            .estimateGas({ from: props.userAddress });
        console.log(gasEstimate);

        let encode = await props.instance.methods.startRegisteringProposals().encodeABI();
        let tx = await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: addressContrat,
            gas: gasEstimate,
            data: encode,
        });
        setCurrentState("startRegisteringProposals")
        getEventPanel();
        sendNewWorkflowStatus(currentState);
        console.log("instance", tx);
    }

    async function stopRegisteringProposalsPanel() {
        const addressContrat = '0x17d1eaC511B5bEd6176D093743e77EBff3000478';
        let gasEstimate = await props.instance.methods
            .stopRegisteringProposals()
            .estimateGas({ from: props.userAddress });
        console.log(gasEstimate);

        let encode = await props.instance.methods.stopRegisteringProposals().encodeABI();
        let tx = await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: addressContrat,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("stopRegisteringProposals");
        sendNewWorkflowStatus(currentState);
        console.log("instance", tx);
    }

    async function startVotingPanel() {
        const addressContrat = '0x17d1eaC511B5bEd6176D093743e77EBff3000478';
        let gasEstimate = await props.instance.methods
            .startVoting()
            .estimateGas({ from: props.userAddress });
        console.log(gasEstimate);

        let encode = await props.instance.methods.startVoting().encodeABI();
        let tx = await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: addressContrat,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("startVoting");
        sendNewWorkflowStatus(currentState);
        console.log("instance", tx);
    }

    async function stopVotingPanel() {
        const addressContrat = '0x17d1eaC511B5bEd6176D093743e77EBff3000478';
        let gasEstimate = await props.instance.methods
            .stopVoting()
            .estimateGas({ from: props.userAddress });
        console.log(gasEstimate);

        let encode = await props.instance.methods.stopVoting().encodeABI();
        let tx = await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: addressContrat,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("stopVoting");
        sendNewWorkflowStatus(currentState);
        console.log("instance", tx);
    }

    async function VoteTalling() {
        const addressContrat = '0x17d1eaC511B5bEd6176D093743e77EBff3000478';
        let gasEstimate = await props.instance.methods
            .getWinner()
            .estimateGas({ from: props.userAddress });
        console.log(gasEstimate);

        let encode = await props.instance.methods.getWinner().encodeABI();
        let tx = await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: addressContrat,
            gas: gasEstimate,
            data: encode,
        });
        getEventPanel();
        setCurrentState("TallingVote");
        sendNewWorkflowStatus(currentState);
        console.log("instance", tx);
    }

    return (
    <><div className="border border-b h-full" style={{ width: 250 }}>
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
        <div>
            {(currentState == "startRegisteringProposals") && <Proposals instance={props.instance} userAddress={props.userAddress} />}
        </div>
    </>
    
    );
};
export default AdminPanel;