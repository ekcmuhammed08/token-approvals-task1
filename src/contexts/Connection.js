import { createContext, useState, useEffect,} from "react";
import { ethers } from "ethers";

export const ConnectionContext = createContext()    

export const ConnectionProvider = ({ children })=>{
    const [errorMessage,setErrorMessage] = useState(null)
    const [userAddress, setUserAddress] = useState(null)
    const [userBalance, setUserBalance] = useState(null)
    const [endpoint, setEndpoint] = useState(null)
    const provider = new ethers.providers.Web3Provider(window.ethereum,'any')

    const walletConnectHandler= ()=>{
      console.log('changed')
        try {
          if(window.ethereum){
            provider.send("eth_requestAccounts",[]).then(async(res)=>{  
              console.log(res[0])
              setUserAddress(res[0])
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
    window.ethereum.on('accountsChanged', ()=>{walletConnectHandler()})
    window.ethereum.on('networkChanged', ()=>{balanceHandler()})
    const balanceHandler = async()=> {
        const bal = userAddress && await provider.getBalance(userAddress)     
        bal&&setUserBalance(ethers.utils.formatEther(bal))
    }

    const endpointHandler = ()=>{
      let current = JSON.parse(localStorage.getItem(`currentNetwork`))
      if(current && current === 'Ethereum'){
        console.log('Eth')
        setEndpoint(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
      }else if(current && current === 'Mumbai'){
        console.log('Mumbai')
        setEndpoint(`https://polygon-mumbai.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
      }else if(current && current === 'Polygon'){
        console.log('Polygon')
        setEndpoint(`https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
      }else if(current && current === 'Celo'){
        console.log('Celo')
        setEndpoint(`https://celo-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
      }else if(current && current === 'Celo Alfajores'){
        console.log('Alfajores')
        setEndpoint(`https://celo-alfajores.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
      }
    }
    
    useEffect(() => {
      walletConnectHandler()
      endpointHandler()
    }, [])
    useEffect(() => {
      balanceHandler()
    }, [userAddress])
    
    
    return (<ConnectionContext.Provider
    value = {{provider,errorMessage,userAddress,userBalance,
    setErrorMessage,endpoint,endpointHandler
    
    }}
    >{children}</ConnectionContext.Provider>)
}