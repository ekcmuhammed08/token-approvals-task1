import { createContext, useState, useEffect, useContext} from "react";
import { ethers } from "ethers";
import { NetworkContext } from './Network';

export const ConnectionContext = createContext()    

export const ConnectionProvider = ({ children })=>{
    const [errorMessage,setErrorMessage] = useState(null)
    const [userAddress, setUserAddress] = useState(null)
    const [userBalance, setUserBalance] = useState(null)
    const [endpoint, setEndpoint] = useState(null)
    const provider = window.ethereum && new ethers.providers.Web3Provider(window.ethereum,'any')

    const walletConnectHandler= ()=>{
        try {
          if(window.ethereum){
            provider.send("eth_requestAccounts",[]).then(async(res)=>{  
              setUserAddress(res[0])
              localStorage.setItem(`userAddress`,JSON.stringify(res[0]))
              setErrorMessage(null)
            }).catch((error)=>{
              console.log(`error occured with code ${error.code} : `,error)
            })
        }
        else{
            setErrorMessage('Please install Metamask')
        }
          
        } catch (error) {
          console.log(error)
        }
    }
    const disconnectHandler = async()=>{
        try {
          await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [{eth_accounts: {}}]
        }).then((res)=>{
          localStorage.setItem(`userAddress`,null)
          setUserAddress(null)
        }).catch((error) =>{
          console.log(`error occured with code ${error.code} : `,error)
        })

        } catch (error) {
          console.log(`error occured with code ${error.code} : `,error)
        }
    }
    window.ethereum &&window.ethereum.on('accountsChanged', ()=>{changedHandler()})
    window.ethereum &&window.ethereum.on('networkChanged', ()=>{balanceHandler()})

    const balanceHandler = async()=> {
        const bal = userAddress && await provider.getBalance(userAddress)     
        bal&&setUserBalance(ethers.utils.formatEther(bal))
    }
    const changedHandler = async()=> {
      localStorage.setItem(`userAddress`,null)
      setUserAddress(null)
      walletConnectHandler()
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
      }else if(current && current === 'Alfajores'){
        console.log('Alfajores')
        setEndpoint(`https://celo-alfajores.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`)
      }
    }
    
    useEffect(() => {
      if(localStorage.getItem(`userAddress`)==null && localStorage.getItem(`currentNetwork`) !=null){
        walletConnectHandler()
      }else{
        setUserAddress(JSON.parse(localStorage.getItem(`userAddress`)))
      }
      endpointHandler()
    }, [])


    useEffect(() => {
      balanceHandler()
    }, [userAddress])
    
    
    return (<ConnectionContext.Provider
    value = {{provider,errorMessage,userAddress,userBalance,
    setErrorMessage,endpoint,endpointHandler,walletConnectHandler,disconnectHandler
    
    }}
    >{children}</ConnectionContext.Provider>)
}