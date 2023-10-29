import React, { Component, useState } from "react";
import Voting from "./artifacts/contracts/Voting.sol/Voting.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import UserSidebar from "../component/UserSidebar";
import Proposals from "../component/Proposals";
import RegisterPanel from "../component/RegisterPanel";
import AdminPanel from "../component/AdminPanel";

const App = () => {
  const [instance,setInstance] = useState();
  const [userAddress, setUserAddress] = useState("");
  const [fullUserAddress, setFullUserAddress] = useState("");
  const [isOwner,setIsOwner] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [address, setAdress] = useState("");
  const [webAdmin, setWeb3init] = useState();
  const [currentState, setCurrentState] = React.useState("initial");

  React.useEffect(() => {
    componentDidMount();
  },[])

    React.useEffect(() => {
    componentDidMount();
    console.log(currentState);
  
  },[currentState])

  React.useEffect(() => {
            try {
            const status = newInstance.methods.getEvent().call({ from: account });
            console.log("État actuel du contrat :", status);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'état :", error);
        }
        handleWorkflowStatusChange(currentState);
  }, []);

  
  const handleWorkflowStatusChange = (newStatus: any) => {
    setCurrentState(newStatus);
    console.log("nouvel état du workflow  depuis AdminPanel : ", newStatus);
    setCurrentState(newStatus);
    };
  // componentDidMount : méthode qui permet de lancer une fonction au moment ou app.js est instancié, si la page se lance bien elle envoie componentDidMount
  const componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()
      setWeb3init(web3);

      // Use web3 to get the user's accounts.
      /* on récupère le tableau des comptes sur le metamask du user */
      const accounts = await web3.eth.getAccounts()

      console.log('accounts',accounts)
  
      /* Création de l'objet de contrat avec l'abi et l'addresse du contrat  */
      const newInstance = new web3.eth.Contract(
        Voting.abi,
        "0x17d1eaC511B5bEd6176D093743e77EBff3000478"
      )
      setInstance(newInstance);

      const account = accounts[0];

      setUserAddress(account.slice(0, 6) + "..." + account.slice(38, 42));
      setFullUserAddress(account);
      
      try {
            const status = await newInstance.methods.getEvent().call({ from: account });
            console.log("État actuel du contrat :", status);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'état :", error);
        }
      
      // const addressContrat ='0xDef4C6155d3ECB9E7596b7Ecf51BCdbbc9729ACd';
      // let gasEstimate = await newInstance.methods
      // .startRegisteringProposals()
      // .estimateGas({ from: accounts[0] });
      // console.log(gasEstimate);

      // let encode = await newInstance.methods.startRegisteringProposals().encodeABI();
      // let tx = await web3.eth.sendTransaction({
      //   from: accounts[0],
      //   to: addressContrat,
      //   gas: gasEstimate,
      //   data: encode,
      // });
      // console.log("instance", tx);

			// Check if the user is the owner
      // const owner = await newInstance.methods.owner().call()
      // if (account === owner) {
      //   console.log("isOwner")
      //   // this.setState({
      //   //   isOwner: true,
      //   // })
      // } else console.log('is not owner')

      newInstance.methods.getUsersTest().call()
          .then((res) => console.log('getUsersTest',res))
          .catch((err) => console.error("getUsersTest error",err))

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  const getData = () => {
    instance?.methods.getUsersDataTest(address).call().then((res) => console.log('userData',res)).catch((err) => console.error('userData error',err))
  }

  const getMyData = () => {
    instance?.methods.getMyDataTest(address).call({from:fullUserAddress}).then((res) => console.log('userData',res)).catch((err) => console.error('userData error',err))
  }
  


  return (
    <div className="App">
      <header className="flex">
        <nav className="bg-yellow-10 border-yellow-30 z-50 w-full">
          <div className="sm:px-6 sm:py-3 md:px-8 md:py-6 flex flex-row items-center justify-between border border-b">
            <div className="flex flex-row items-center">
              <a className="logo md:w-170 w-80" href="/">
                Vote App
              </a>
            </div>
            <div className="flex">
              <button className="p-1 block md:hidden">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  className="h-8 w-auto"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                </svg>
              </button>
            </div>
            <ul className="hidden list-none md:flex flex-row gap-4 items-baseline ml-10">
              <li>
                <button id="web3-status-connected" className="web3-button">
                  <p className="Web3StatusText">{userAddress}</p>
                  <div
                    size="16"
                    className="Web3Status__IconWrapper-sc-wwio5h-0 hqHdeW"
                  >
                    <div className="Identicon__StyledIdenticon-sc-1ssoit4-0 kTWLky">
                      <span>
                        <div className="avatar">
                          <svg x="0" y="0" width="16" height="16">
                            <rect
                              x="0"
                              y="0"
                              width="16"
                              height="16"
                              transform="translate(-1.1699893080448718 -1.5622487594391614) rotate(255.7 8 8)"
                              fill="#2379E1"
                            ></rect>
                            <rect
                              x="0"
                              y="0"
                              width="16"
                              height="16"
                              transform="translate(4.4919645360147475 7.910549295855059) rotate(162.8 8 8)"
                              fill="#03595E"
                            ></rect>
                            <rect
                              x="0"
                              y="0"
                              width="16"
                              height="16"
                              transform="translate(11.87141302372359 2.1728091065947037) rotate(44.1 8 8)"
                              fill="#FB1877"
                            ></rect>
                          </svg>
                        </div>
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      {instance && 
        !isRegistered ?
          <RegisterPanel instance={instance} setIsRegistered={setIsRegistered} userAddress={fullUserAddress}/>
        :
          <div style={{ display: "flex"}}>
            {isOwner && <AdminPanel instance={instance} userAddress={fullUserAddress} web3init={webAdmin} onWorkflowStatusChange={handleWorkflowStatusChange}/>}
            <UserSidebar instance={instance} userAddress={fullUserAddress}/>
          </div>
      }
      <input type="text" name="address" onChange={(val) => setAdress(val.target.value)} value={address}/>
      <button onClick={() => getData()}>get data</button>
      <button onClick={() => getMyData()}>get my data</button>
    </div>
  );
}
export default App
