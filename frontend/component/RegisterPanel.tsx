import * as React from 'react';

interface propsI {
    instance:any,
    setIsRegistered:(arg0: boolean)=>void,
    userAddress:string
}

const RegisterPanel = (props:propsI) => {
    const [nickname,setNickname] = React.useState("");
    const [error,setError] = React.useState("");

    const register = async () => {
        // console.log("test",props.instance.methods);
        try {
            const res = await props.instance.methods.register(nickname).send({from:props.userAddress});
            if (res == "Vous avez deja un compte") setError("Vous avez déjà un compte");
            else if (res == "Vous n'etes pas l'Admin") setError("Vous n'êtes pas l'Administrateur");
            else if (res == "compte ajoute") props.setIsRegistered(true);
            else setError(`erreur inconnu : ${res}`);
        } catch (err) {
            typeof(err) == "string" && setError(err);
        }
        
        console.log('res',test)
        // props.instance.methods.register().send({from:props.userAddress, _nickName:nickname}).then((res) => {
        //   console.log('test',res)
        //   props.setIsRegistered(true);
        // }).catch((err) => {
        //     console.error("register error",err);
        //     setError(err);
        // })
    }

    return (
        <div style={{display:'flex', flexDirection:'column',placeContent:'center', flexWrap:'wrap'}}>
            <h3 style={{marginLeft:'auto'}}>Je m'inscris aux votes</h3>
            <div style={{display:'flex',flexDirection:'row', alignItems:'center'}}>
                <label htmlFor="nickname" style={{marginRight:8}}>Pseudo : </label>
                <input type="text" name="nickname" onChange={(val) => setNickname(val.target.value)} value={nickname}/>
            </div>
            <div>
                <button type="submit" style={{marginTop:10, borderWidth:1, borderColor:'black'}} onClick={() => register()}>S'inscrire</button>
            </div>
            {error != "" &&
                <p>{error}</p>
            }
        </div>
    )
}
export default RegisterPanel;