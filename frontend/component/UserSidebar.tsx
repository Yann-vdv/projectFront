import * as React from 'react';

interface voterI {
    isRegistered: boolean,
    nickname: string,
    myVoteId: 0,
    myProposalId: 0,
    votedProposalId: 0
}

const UserSidebar = (instance:any) => {
    const [users,setUsers] = React.useState<voterI[]>([
        {
            isRegistered:true,
            nickname: "Admin",
            myVoteId: 0,
            myProposalId: 0,
            votedProposalId: 0
        },
        {
            isRegistered:true,
            nickname: "testUser2",
            myVoteId: 0,
            myProposalId: 0,
            votedProposalId: 0
        },
        {
            isRegistered:true,
            nickname: "testUser3",
            myVoteId: 0,
            myProposalId: 0,
            votedProposalId: 0
        },
    ])

    // React.useEffect(() => {
    //     instance.methods.getUsers().call()
    //         .then((res) => setUsers(res))
    //         .catch((err) => console.error("getUsers error",err))
    // },[])

    return (
        <div className="border border-b h-full" style={{width:150}}>
            <div className='border-b'>
                <h3>Utilisateurs</h3>
            </div>
            {users.map((user,key) => 
                <div key={key} className='border-b'>
                    <p style={{color:user.nickname == "Admin" ? "red" : "black"}}>{user.nickname}</p>
                </div>
            )}
        </div>
    )
}
export default UserSidebar;