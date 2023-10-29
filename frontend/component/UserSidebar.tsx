import * as React from 'react';

interface voterI {
    isRegistered: boolean,
    nickname: string,
    myVoteId: 0,
    myProposalId: 0,
    votedProposalId: 0
}

interface propsI {
    instance:any
    userAddress:string
}

const UserSidebar = (props:propsI) => {
    const [users,setUsers] = React.useState<voterI[]>();

    React.useEffect(() => {
        props?.instance?.methods && props.instance.methods.getUsersData().call({ from:props.userAddress })
            .then((res:any) => {
                setUsers(res);
            })
            .catch((err:any) => console.error("getUsers error",err))
    },[props?.instance?.methods])

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