import React, { useContext, useState, useEffect } from 'react'
import ERC20abi from '../erc-20-abi.json' 
import { ConnectionContext } from '../contexts/Connection'
import { ethers } from 'ethers'
import Web3 from 'web3'
import {useApprovalStore} from '../contexts/ZustandStore'


const Card = ({contractAddress,setCurrentContract,setModalOpen,modalOpen,setCurrentSymbol,
refreshContract,setAllowanceList,fetchAllowances}) => {
    
    const {provider,setErrorMessage,userAddress} = useContext(ConnectionContext)
    let web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/fxPKPIxJbZYT8vrW2NC7IyTBSs1VIhb-')
    
    const contractAbi = ERC20abi
    const [name,setName] = useState(null)
    const [symbol,setSymbol] = useState(null)
    const [balance,setBalance] = useState(null)
    // const allowanceList = useApprovalStore((state)=>state.allowanceList)
    // const setAllowance = useApprovalStore((state)=>state.setAllowance) 
    

    const loadContract = async()=>{
      try { 
        if(userAddress){
          setErrorMessage('') 
            try {
            const contract = new ethers.Contract(contractAddress,contractAbi,provider)  
            const name = await contract.name()
            name && setName(name)
            const symbol = await contract.symbol()
            symbol &&setSymbol(symbol)
            const bal = await contract.balanceOf(userAddress)
            const balance = await ethers.utils.formatEther(bal)
            balance && setBalance(balance)
            
            } catch (error) {
              console.log(error)
            }
        }
        else{
          setErrorMessage("please connect with your wallet first")
        }
        
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      loadContract()
    }, [])

    useEffect(() => {
      loadContract()
    }, [refreshContract])

    const getAllowance= async(contractAddress,spender) =>{
      const contract = new ethers.Contract(contractAddress,contractAbi,provider) 
      const signer = await provider.getSigner()
      const contractWSigner =contract.connect(signer) 
      const allowance = await contractWSigner.allowance(userAddress,spender);
      return allowance
     }

    const listenApprovals = async(tokenAddress)=>{
      var filter = {
        address: tokenAddress,
        fromBlock: 0 
      }
      var arr = []
      var newArr = []
      let events = await web3.eth.getPastLogs(filter)
      events &&console.log(events[12])
      events && events.filter((e)=>{
        if(e.topics[0]==='0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
        &&e.topics[1] === '0x0000000000000000000000005c78b1e594644012980445094da95951c255fc0f'){
          console.log(e.transactionHash + ' is an Approval Event')
          if(!arr.includes(e.topics[2].slice(0,2) + e.topics[2].slice(26,e.topics[2].length))){
            arr.push(e.topics[2].slice(0,2) + e.topics[2].slice(26,e.topics[2].length))
          }
        }
      })
      arr && console.log(arr)
      arr && arr.map(async(e)=>{
        var allowance = await getAllowance(tokenAddress,e)
        allowance && console.log(e,ethers.utils.formatEther(allowance))
        allowance && allowance>0 && newArr.push({address:e,value:ethers.utils.formatEther(allowance)}) 
      })
      newArr && console.log(newArr)
      newArr && setAllowanceList(newArr)    
    }  

    const handleClick=async()=>{
      setCurrentContract(contractAddress)
      setCurrentSymbol(symbol)
      await listenApprovals(contractAddress)
      setModalOpen(!modalOpen)
    }
    
  return (
    <div className='border w-96 h-full m-4 py-6 rounded-md bg-[#426f97] text-slate-100' onClick={handleClick}>
      <p className='font-medium'>Token Contract Address: {contractAddress}</p>
      <p className='font-medium'>{name && name}({symbol && symbol})</p>
      <p className='font-medium'>Balance : {balance && balance}</p>
    </div>
  )
}

export default Card
