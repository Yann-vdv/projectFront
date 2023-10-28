import * as React from 'react';

interface voterI {
    isRegistered: boolean,
    nickname: string,
    myVoteId: 0,
    myProposalId: 0,
    votedProposalId: 0
}

const UserSidebar = (instance:any) => {
    const [users,setUsers] = React.useState<voterI[]>();

    React.useEffect(() => {
        instance.methods && instance.methods.getUsers().call()
            .then((res) => setUsers(res))
            .catch((err) => console.error("getUsers error",err))
    },[instance.methods])

    return (
        <div className="border border-b h-full" style={{width:150}}>
            <div className='border-b'>
                <h3>Utilisateurs</h3>
            </div>
            {users?.map((user,key) => 
                <div key={key} className='border-b'>
                    <p style={{color:user.nickname == "Admin" ? "red" : "black"}}>{user.nickname}</p>
                </div>
            )}
        </div>
    )
}
export default UserSidebar;