import * as React from 'react';

interface ProposalI {
    description: string
    voteCount: number
    owner: string
}

interface propsI {
    instance:any
    userAddress:string
}

const Proposals = (props:propsI) => {
    const [proposals, setProposals] = React.useState<ProposalI[]>();
    const [error,setError] = React.useState("");

    const getProposals = async () => {
        // try {
        //     const res = await props.instance.methods.getProposals().call({from:props.userAddress})
        //     setProposals(res);
        // } catch (err) {
        //     typeof(err) == "string" && setError(err);
        // }
        setProposals([
            {
                description:"je test une propo",
                voteCount:1,
                owner:"higphiu4fgn4w4hbwcv54xns4"
            },
            {
                description:"je test deux propos",
                voteCount:5,
                owner:"higphiu4fgn4wgreygs4hbwcv54xns4"
            },
            {
                description:"je test trois propos",
                voteCount:3,
                owner:"higphiu4f6hd46h8gns4"
            }
        ])
    }

    React.useEffect(() => {
        getProposals();
    },[])

    return (
        <div style={{display:'flex',flexGrow:1, flexDirection:'column', alignItems:'center', rowGap:20, marginTop:20}}>
            {error != "" ?
                <p>{error}</p>
            :
            proposals?.map((proposal,key) =>
                <div key={key} style={{
                    display:'flex', 
                    flexDirection:'column', 
                    justifyContent:'center',
                    alignItems:'center',
                    borderWidth:1,
                    borderRadius:10,
                    minWidth:800,
                }}>
                    <h3 style={{margin:5}}>{proposal.description}</h3>
                    <div style={{display:'flex',flexDirection:'row',marginBottom:5, columnGap:5}}>
                        <p>Votes : </p>
                        <p>{proposal.voteCount}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Proposals;