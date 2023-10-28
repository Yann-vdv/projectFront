import * as React from 'react';

interface propsI {
    instance:any,
    setIsRegistered:(arg0: boolean)=>void,
    userAddress:string
}

const RegisterPanel = (props:propsI) => {
    const [nickname,setNickname] = React.useState("");
    const [errorRegister,setErrorRegister] = React.useState("");
    const [errorLogin,setErrorLogin] = React.useState("");

    const register = async () => {
        setErrorRegister("");
        try {
            const res = await props.instance.methods.register(nickname).call({from:props.userAddress});
            if (res == "Vous avez deja un compte") {
                setErrorRegister("Vous avez déjà un compte");
                props.setIsRegistered(true);
            }
            else if (res == "Vous n'etes pas l'Admin") setErrorRegister("Vous n'êtes pas l'Administrateur");
            else if (res == "compte ajoute") props.setIsRegistered(true);
            else {
                setErrorRegister(`erreur inconnu : ${res}`);
                console.error("register error",res);
            }
        } catch (err) {
            typeof(err) == "string" && setErrorRegister(err);
            console.error("register error",err);
        }
    }

    const login = async () => {
        setErrorLogin("");
        try {
            const res = await props.instance.methods.login().call({from:props.userAddress});

            // console.log('login',res)
            if (res[0] == true) {
                props.setIsRegistered(true);
            }
            else {
                setErrorLogin(`erreur : ${res[1]}`);
                console.error("Login error",res);
            }
        } catch (err) {
            typeof(err) == "string" && setErrorLogin(err);
            console.error("Login error",err);
        }
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
            {errorRegister != "" &&
                <p style={{color:'red',marginTop:10, marginBottom:5}}>{errorRegister}</p>
            }
            <div>
                <button type="submit" style={{marginTop:5, borderWidth:1, borderColor:'black'}} onClick={() => login()}>J'ai déjà un compte</button>
            </div>
            {errorLogin != "" &&
                <p style={{color:'red',marginTop:10}}>{errorLogin}</p>
            }
        </div>
    )
}
export default RegisterPanel;