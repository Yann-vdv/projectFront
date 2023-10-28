import * as React from "react";


interface propsI {
    instance:any,
    userAddress:string
}

const AdminPanel =  (props:propsI) => {
    const [Event, setEvent] = React.useState("initialisation");
    
    async function getEventPanel() {
        try {
            const status = await props.instance.methods.getEvent().call({ from: props.userAddress });
            console.log("État actuel du contrat :", status);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'état :", error);
        }
    }

    React.useEffect(() => {
        if(props.instance)
        {
            getEventPanel();
        }
        
    }, [props.instance]);

    

async function startRegisteringProposalsPanel() {
    try {
        const result = await props.instance.methods
            .startRegisteringProposals()
            .call({ from: props.userAddress });
            console.log("Transaction réussie :", result);
            getEventPanel()
    } catch (error) {
        console.error("Erreur lors de la transaction :", error);
    }
}


    function stopRegisteringProposalsPanel() {
        const test = props.instance.methods
        .stopRegisteringProposals()
        .call({ from: props.userAddress })
        console.log("res stopRegisteringProposalsPanel", test);
        console.log("Event ", Event); 
    }


    function startVotingPanel() {
        const test = props.instance.methods
        .startVoting()
        .call({ from: props.userAddress })
        console.log("res startVotingPanel", test);
    }

    function stopVotingPanel() {
        const test = props.instance.methods
        .stopVoting()
        .call({ from: props.userAddress })
        console.log("res stopVotingPanel", test);
    }

    return (
    <div className="border border-b h-full" style={{ width: 150 }}>
        <div className="border-b">
        <h3>Panel Administrateur</h3>
        </div>
        <div className="border-b">
            <p onClick={() => startRegisteringProposalsPanel()}>Début des propositions</p>
            <p onClick={() => stopRegisteringProposalsPanel()}>Fin des propositions</p>
            <p onClick={() => startVotingPanel()}>Début du vote</p>
            <p onClick={() => stopVotingPanel()}>Fin des votes</p>
            {/* <p onClick={() => startRegisteringProposalsPanel()}>Comptage des votes</p> */}
        </div>
    </div>
    );
};
export default AdminPanel;