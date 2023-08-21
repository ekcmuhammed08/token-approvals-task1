import React, { useContext, useRef, useEffect, useState } from 'react'
import { ConnectionContext } from './contexts/Connection'
import Card from './components/Card'
import ERC20abi from './erc-20-abi.json' 
import { NetworkContext } from './contexts/Network'
import { ethers } from 'ethers'
import Modal from './components/Modal'
import Head from './components/Head'
import Web3 from 'web3'
require('dotenv').config() 

const Test = () => {
  const selectRef = useRef()
  const inputRef = useRef()
  const recipientRef = useRef()
  const sendAmountRef = useRef()
  const allowanceRecipientRef = useRef()
  const giveAllowanceRef = useRef()
  const contractAbi = ERC20abi
  
  const [modalOpen,setModalOpen]=useState(false)
  const [currentContract,setCurrentContract] = useState()
  const [currentSymbol,setCurrentSymbol] = useState()
  const [refreshContract,setRefreshContract] = useState(false)
  const [allowanceList,setAllowanceList] = useState(null)
  const [allowancesGiven,setAllowancesGiven] = useState(false)
  const [endpoint,setEndpoint] = useState(null)

  const {userBalance,userAddress,provider} = useContext(ConnectionContext)
  const {switchNetwork, currentNetwork, currentChainId} = useContext(NetworkContext)

  const handleSelectNetwork =()=>{ 
    switchNetwork(selectRef.current.value)
    localStorage.setItem(`currentNetwork`,JSON.stringify(selectRef.current.value))
  }
  useEffect(() => {
    document.getElementById('select').value =  currentNetwork
    refreshInfo(1000)
  }, [currentNetwork])

  useEffect(() => {
    if(localStorage.getItem(`currentNetwork`)===null){
      switchNetwork('Ethereum')
    }else{
      switchNetwork(JSON.parse(localStorage.getItem(`currentNetwork`))) 
    }
  }, [])

  const endpointHandler = ()=>{
    let current = JSON.parse(localStorage.getItem(`currentNetwork`))
    if(current && current === 'Ethereum'){
      console.log('Eth')
      setEndpoint(`https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY_ETHEREUM}`)
    }else if(current && current === 'Mumbai'){
      console.log('Mumbai')
      setEndpoint(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY_MUMBAI}`)
    }else if(current && current === 'Polygon'){
      console.log('Polygon')
      setEndpoint(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY_POLYGON}`)
    }else if(current && current === 'Celo'){
      console.log('Celo')
      setEndpoint(`https://celo-mainnet-rpc.allthatnode.com`)
    }else if(current && current === 'Celo Alfajores'){
      console.log('Alfajores')
      setEndpoint(`https://alfajores-forno.celo-testnet.org`)
    }
  }

  const sendTokens= async() =>{
    const contract = new ethers.Contract(currentContract,ERC20abi,provider) 
    const signer = await provider.getSigner()
    const contractWSigner =contract.connect(signer) 
    await contractWSigner.transfer(recipientRef.current.value,ethers.utils.parseEther(sendAmountRef.current.value))
    .then((res)=>{refreshInfo(10000)}).catch(error=>{console.log(error)})
    return true
  }

  const giveAllowance= async(to,amount) =>{
    const contract = new ethers.Contract(currentContract,ERC20abi,provider) 
    const signer = await provider.getSigner()
    const contractWSigner =contract.connect(signer) 
    await contractWSigner.approve(to,ethers.utils.parseEther(amount))
    .then((res)=>{refreshInfo(10000)}).catch(error=>{console.log(error)})
    return true
  }
  
  const getAllowances= async(contractAddress,spender) =>{
    const contract = new ethers.Contract(contractAddress,contractAbi,provider) 
    const signer = await provider.getSigner()
    const contractWSigner =contract.connect(signer) 
    const allowance = await contractWSigner.allowance(userAddress,spender);
    return allowance
  }

  const refreshInfo =(duration) =>{
    setTimeout(()=>{
      setRefreshContract(!refreshContract)
      console.log('refreshed')
      setModalOpen(false)
    },duration)
  }
  const parseAddress = (address)=>{
    var parsed = address.slice(0,7) + '......' +address.slice(address.length-7, address.length)
    return parsed
  }
  const parseBalance = (balance)=>{
      var bal = balance.slice(1,7) 
      return bal
  } 

  useEffect(() => {
    endpointHandler()
  }, [currentNetwork])

  return (
    <div className=""> 
      {/* {endpoint && endpoint} */}
      <Head 
      setCurrentContract={setCurrentContract} setModalOpen={setModalOpen} 
      modalOpen={modalOpen} setCurrentSymbol={setCurrentSymbol} refreshContract={refreshContract} 
      setRefreshContract={setRefreshContract} inputRef={inputRef} selectRef={selectRef}  
      handleSelectNetwork={handleSelectNetwork} getAllowances={getAllowances}
      currentNetwork={currentNetwork}userBalance={userBalance}userAddress={userAddress}
      setAllowanceList={setAllowanceList} parseAddress={parseAddress} parseBalance={parseBalance}
      allowancesGiven={allowancesGiven} endpoint={endpoint}
      />
      {JSON.stringify(currentChainId)} 
      <Modal modalOpen={modalOpen}
      setModalOpen={setModalOpen} 
      currentSymbol={currentSymbol} 
      sendTokens={sendTokens} 
      recipientRef={recipientRef}
      sendAmountRef={sendAmountRef}
      allowanceRecipientRef={allowanceRecipientRef}
      giveAllowanceRef={giveAllowanceRef}
      giveAllowance={giveAllowance}
      allowanceList={allowanceList}
      setAllowancesGiven={setAllowancesGiven}
      />
      
    </div>
  )
}

export default Test
