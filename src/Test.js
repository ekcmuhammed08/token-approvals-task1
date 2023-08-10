import React, { useContext, useRef, useEffect, useState } from 'react'
import { ConnectionContext } from './contexts/Connection'
import Card from './components/Card'
import ERC20abi from './erc-20-abi.json' 
import { NetworkContext } from './contexts/Network'
import { ethers } from 'ethers'
import Modal from './components/Modal'
import Head from './components/Head'
import Web3 from 'web3'

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
  const [fetchAllowances,setFetchAllowances] = useState(false)

  const {errorMessage,userBalance,userAddress,provider} = useContext(ConnectionContext)
  const {switchNetwork, currentNetwork, setCurrentNetwork} = useContext(NetworkContext)

  const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/fxPKPIxJbZYT8vrW2NC7IyTBSs1VIhb-')
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
      console.log('okauyy')
      switchNetwork('Ethereum')
    }else{
      switchNetwork(JSON.parse(localStorage.getItem(`currentNetwork`))) 
      console.log('nope')
    }
  }, [])

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
  
  const getAllowance= async(contractAddress,spender) =>{
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
  // const listenApprovals = async()=>{
  //   var filter = {
  //     address: currentContract,
  //     fromBlock: 0 
  //   }
  //   var arr = []
  //   var newArr = []
  //   let events = await web3.eth.getPastLogs(filter)
  //   events &&console.log(events[12])
  //   events && events.filter((e)=>{
  //     if(e.topics[0]==='0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
  //     &&e.topics[1] === '0x0000000000000000000000005c78b1e594644012980445094da95951c255fc0f'){
  //       console.log(e.transactionHash + ' is an Approval Event')
  //       if(!arr.includes(e.topics[2].slice(0,2) + e.topics[2].slice(26,e.topics[2].length))){
  //         arr.push(e.topics[2].slice(0,2) + e.topics[2].slice(26,e.topics[2].length))
  //       }
  //     }
  //   })
  //   arr && console.log(arr)
  //   arr && arr.map(async(e)=>{
  //     var allowance = await getAllowance(currentContract,e)
  //     allowance && console.log(e,ethers.utils.formatEther(allowance))
  //     allowance && newArr.push({address:e,value:ethers.utils.formatEther(allowance)}) 
  //   })
  //   newArr && console.log(newArr)
  //   newArr && setAllowanceList(newArr)    
  // }  

  return (
    <div className=""> 
      <Head 
      setCurrentContract={setCurrentContract} setModalOpen={setModalOpen} 
      modalOpen={modalOpen} setCurrentSymbol={setCurrentSymbol} refreshContract={refreshContract} 
      setRefreshContract={setRefreshContract} inputRef={inputRef} selectRef={selectRef}  
      handleSelectNetwork={handleSelectNetwork} errorMessage={errorMessage} 
      currentNetwork={currentNetwork}userBalance={userBalance}userAddress={userAddress}
      setAllowanceList={setAllowanceList} parseAddress={parseAddress} parseBalance={parseBalance}
      fetchAllowances={fetchAllowances}
      />
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
      setFetchAllowances={setFetchAllowances}
      fetchAllowances={fetchAllowances}
      parseAddress={parseAddress}
      />
      
    </div>
  )
}

export default Test
