import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { ethers } from "ethers";
import Web3 from 'web3'

export const ConnectionContext = createContext()    

export const ConnectionProvider = ({ children })=>{
    const provider = window.ethereum && new ethers.providers.Web3Provider(window.ethereum,"any")

    const [errorMessage,setErrorMessage] = useState(null)
    const [userAddress, setUserAddress] = useState(null)
    const [userBalance, setUserBalance] = useState(null)
    const [endpoint, setEndpoint] = useState(null)

    let web3 = useMemo(()=>{
      let obj = new Web3(`https://celo-alfajores.infura.io/v3/${process.env.REACT_APP_INFURA_KEY_CELO}`)
      console.log('instance')
      return obj
    },[])
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
      web3&&setEndpoint(web3)
    }, [])    
    
    return (<ConnectionContext.Provider
    value = {{provider,errorMessage,userAddress,userBalance,
    setErrorMessage,endpoint
    
    }}
    >{children}</ConnectionContext.Provider>)
}