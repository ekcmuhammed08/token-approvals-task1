import { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

export const ConnectionContext = createContext()    

export const ConnectionProvider = ({ children })=>{
    const provider = window.ethereum && new ethers.providers.Web3Provider(window.ethereum,"any")
    const [errorMessage,setErrorMessage] = useState(null)
    const [userAddress, setUserAddress] = useState(null)
    const [userBalance, setUserBalance] = useState(null)

    const walletConnectHandler= ()=>{
        try {
          if(window.ethereum){
            provider.send("eth_requestAccounts",[]).then(async()=>{
               await accountChangeHandler()
               setErrorMessage('')
            })
        }
        else{
            setErrorMessage('Please install Metamask')
        }
          
        } catch (error) {
          console.log(error)
        }
    }

    
    const accountChangeHandler =async()=> {
        const signer = await provider.getSigner()
        console.log(signer)
        const address = await signer.getAddress()
        console.log(address)
        setUserAddress(address)
        const balance = await signer.getBalance()
        console.log(ethers.utils.formatEther(balance))
        setUserBalance(ethers.utils.formatEther(balance))
    } 
    window.ethereum.on('accountsChanged', accountChangeHandler);

    useEffect(() => {
      walletConnectHandler()
    }, [])
    
    return (<ConnectionContext.Provider
    value = {{provider,errorMessage,userAddress,userBalance,
    setErrorMessage
    
    }}
    >{children}</ConnectionContext.Provider>)
}