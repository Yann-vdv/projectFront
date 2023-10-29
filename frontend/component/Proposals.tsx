import * as React from 'react';
import Web3 from 'web3';

interface ProposalI {
    description: string
    voteCount: number
    owner: string
}

interface propsI {
    instance:any
    contractAdress:string
    userAddress:string
    currentState:string
    web3init: Web3
}

const Proposals = (props:propsI) => {
    const [proposals, setProposals] = React.useState<ProposalI[]>();
    const [error,setError] = React.useState("");
    const [inputValue, setInputValue] = React.useState("");
    const [currentState, setCurrentState] = React.useState("initial");
    const [winningProposals, setWinningProposals] = React.useState<ProposalI[]>([]);
    const [HasVoted, setHasVoted] = React.useState(false);

        React.useEffect(() => {
        console.log("Nouvel état actuel :", props.currentState);
        setCurrentState(props.currentState);
        getProposals();
        if(currentState == "TallingVote"){
            getWinnerPanel();
        }
    }, [props.currentState]);
    
    const getProposals = async () => {
        try {
            const res = await props.instance.methods.getProposals().call({from:props.userAddress})
            setProposals(res); 
        } catch (err) {
            typeof(err) == "string" && setError(err);
        }
    }

    const submitProposal = async () => {
        console.log("Proposition :", inputValue);
        try {
        const description = inputValue;

        let gasEstimate = await props.instance.methods
            .proposing(description)
            .estimateGas({ from: props.userAddress });

        let encode = await props.instance.methods.proposing(description).encodeABI();
        await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: props.contractAdress,
            gas: gasEstimate,
            data: encode,
        })
        console.log("Proposition soumise avec succès !");
        } catch (error) {
        console.error("Erreur lors de la soumission de la proposition :", error);
        }
    }

    const getWinnerPanel = async () => {
        try {
            const result = await props.instance.methods.getWinner().call({ from: props.userAddress });
            console.log("Résultat de la fonction getWinner :", result);
        } catch (error) {
            console.error("Erreur lors de l'appel à getWinner :", error);
        }
    }

    const VotePanel = async (proposal: ProposalI, key: number) => {
        console.log("Proposition :", proposal);
        console.log("Index :", key)

        if (HasVoted) {
            console.log("Vous avez déjà voté.");
            return; 
        }

        let gasEstimate = await props.instance.methods
            .vote(key)
            .estimateGas({ from: props.userAddress });

        let encode = await props.instance.methods.vote(key).encodeABI();
        await props.web3init.eth.sendTransaction({
            from: props.userAddress,
            to: props.contractAdress,
            gas: gasEstimate,
            data: encode,
        })
        console.log(proposals);
        setHasVoted(true);
    }

    const submitWinner = async () => {
        console.log(proposals);
        let maxVotes = -1;
        let winningProposals: ProposalI[] = [];
        
        for (const proposal of proposals) {
            if (proposal.voteCount > maxVotes) {
                maxVotes = proposal.voteCount;
                winningProposals = [proposal];
            } else if (proposal.voteCount === maxVotes) {
                winningProposals.push(proposal);
            }
        }
        if (winningProposals.length === 0) {
            console.log("Aucune proposition gagnante trouvée.");
        } else if (winningProposals.length === 1) {
            console.log("Proposition gagnante : ", winningProposals[0]);
        } else {
            console.log("Égalité entre plusieurs propositions gagnantes : ", winningProposals);
        }
        setWinningProposals(winningProposals);
        console.log("fjrkfor : ", winningProposals);
        
    }

    React.useEffect(() => {
        getProposals();
        console.log(currentState);
    },[])

    return (
        <div style={{display:'flex',flexGrow:1, flexDirection:'column', alignItems:'center', rowGap:20, marginTop:20}}>
            {props.currentState !== "startRegisteringProposals"  && (
                proposals?.map((proposal, key) => (
                    <div key={key} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: 10,
                        minWidth: 800,
                        }}>
                        <h3 style={{ margin: 5 }}>{proposal.description}</h3>
                        {props.currentState !== "startRegisteringProposals"  && (
                            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 5, columnGap: 5 }}>
                                <div>
                                    <p>Votes : {parseInt(proposal.voteCount)}</p>
                                    <p>Owner : {proposal.owner}</p>
                                </div>
                                {props.currentState === "startVoting"  && (
                                <button onClick={() => VotePanel(proposal, key)} style={{ backgroundColor: "blue", color: "white", borderRadius: "5px" }}>Voter</button>
                            )}
                            </div>
                        )}
                    </div>
                ))
            )}
            {props.currentState == "startRegisteringProposals" && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3>Soumettre une proposition</h3>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Entrez votre proposition"
                    />
                    <button onClick={submitProposal} style={{ backgroundColor: "blue", color: "white", borderRadius: "5px", margin : 10 }}>Soumettre</button>
                </div>
            )}
            {props.currentState === "TallingVote" && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button onClick={submitWinner} style={{ backgroundColor: "blue", color: "white", borderRadius: "5px", margin: 10 }}>WINNER</button>
                    {winningProposals.length > 0 && (
                        <div>
                            <h3>Propositions Gagnantes : </h3>
                            <ul>
                                {winningProposals.map((proposal, index) => (
                                    <li key={index} className="winner">
                                        {proposal.description} - avec votes : {parseInt(proposal.voteCount)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default Proposals;