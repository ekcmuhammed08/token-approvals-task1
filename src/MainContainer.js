import React, { useContext, useRef, useEffect, useState } from 'react'
import { ConnectionContext } from './contexts/Connection'
import ERC20abi from './erc-20-abi.json' 
import { NetworkContext } from './contexts/Network'
import { ethers } from 'ethers'
import Modal from './components/Modal'
import Head from './components/Head'
import Loading from './components/Loading'

require('dotenv').config() 

const MainContainer = () => {
  const selectRef = useRef()
  const inputRef = useRef()
  const recipientRef = useRef()
  const sendAmountRef = useRef()
  const allowanceRecipientRef = useRef()
  const giveAllowanceRef = useRef()
  
  const [modalOpen,setModalOpen]=useState(false)
  const [currentContract,setCurrentContract] = useState()
  const [currentSymbol,setCurrentSymbol] = useState()
  const [refreshContract,setRefreshContract] = useState(false)
  const [allowanceList,setAllowanceList] = useState(null)
  const [allowancesGiven,setAllowancesGiven] = useState(false)
  const [loading,setLoading] = useState(true)
  const [currentBalance,setCurrentBalance] = useState()

  const {userAddress,provider,endpointHandler} = useContext(ConnectionContext)
  const {switchNetwork, currentNetwork} = useContext(NetworkContext)

  const handleSelectNetwork =(network)=>{ 
    switchNetwork(network)
    localStorage.setItem(`currentNetwork`,JSON.stringify(network))
    inputRef.current.value = ''
  }
  useEffect(() => {
    refreshInfo(1000)
  }, [currentNetwork])
  
  useEffect(() => {
    refreshInfo(1000)
  }, [userAddress])

  useEffect(() => {
    if(localStorage.getItem(`currentNetwork`)===null){
      switchNetwork('Ethereum')
    }else{
      switchNetwork(JSON.parse(localStorage.getItem(`currentNetwork`))) 
    }
  }, [])


  const sendTokens= async(to,amount) =>{
    const contract = new ethers.Contract(currentContract,ERC20abi,provider) 
    const signer = await provider.getSigner(userAddress)
    const contractWSigner =contract.connect(signer) 
    await contractWSigner.transfer(to,ethers.utils.parseEther(amount))
    .then((res)=>{refreshInfo(10000)}).catch(error=>{console.log(error)})
    return true
  }

  const giveAllowance= async(to,amount) =>{
    let newAmount;
    if(amount==='max'){
      newAmount = ethers.constants.MaxUint256
    }else{
      newAmount = amount
    }
    const contract = new ethers.Contract(currentContract,ERC20abi,provider) 
    const signer = await provider.getSigner(userAddress)
    const contractWSigner =contract.connect(signer) 
    await contractWSigner.approve(to,newAmount)
    .then((res)=>{refreshInfo(10000)}).catch(error=>{console.log(error)})
    return true
  }
  
  // const getAllowances= async(contractAddress,spender) =>{
  //   const contract = new ethers.Contract(contractAddress,ERC20abi,provider) 
  //   const signer = await provider.getSigner(userAddress)
  //   const contractWSigner =contract.connect(signer) 
  //   const allowance = await contractWSigner.allowance('0x5C78b1E594644012980445094da95951c255FC0F','0x698b8333FF583cdAAf0bDD5a588bB459ceD3024B');
  //   return allowance
  // }
  const refreshInfo =(duration) =>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
      setRefreshContract(!refreshContract)
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
      <Head 
      setCurrentContract={setCurrentContract} setModalOpen={setModalOpen} modalOpen={modalOpen} 
      setCurrentSymbol={setCurrentSymbol} refreshContract={refreshContract} inputRef={inputRef}   
      handleSelectNetwork={handleSelectNetwork} setAllowanceList={setAllowanceList} 
      parseAddress={parseAddress} parseBalance={parseBalance} allowancesGiven={allowancesGiven}  
      refreshInfo={refreshInfo} setLoading={setLoading} selectRef={selectRef} setCurrentBalance={setCurrentBalance}
      />
      <Modal modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      currentContract={currentContract} 
      currentSymbol={currentSymbol} 
      sendTokens={sendTokens} 
      recipientRef={recipientRef}
      sendAmountRef={sendAmountRef}
      allowanceRecipientRef={allowanceRecipientRef}
      giveAllowanceRef={giveAllowanceRef}
      giveAllowance={giveAllowance}
      allowanceList={allowanceList}
      setAllowancesGiven={setAllowancesGiven}
      currentBalance={currentBalance}
      />
      <Loading loading={loading}/>
    </div>
  )
}

export default MainContainer
