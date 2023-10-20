import React, { useContext, useState, useEffect } from 'react'
import ERC20abi from '../erc-20-abi.json' 
import { ConnectionContext } from '../contexts/Connection'
import { ethers } from 'ethers'
import {RiCopperCoinLine, RiCoinsFill} from 'react-icons/ri'
import {PiCurrencyEth} from 'react-icons/pi'
import {SiSymbolab} from 'react-icons/si'
require('dotenv').config()  
 

const Card = ({contractAddress,setCurrentContract,setModalOpen,setCurrentBalance,setCurrentSymbol,
refreshContract,setAllowanceList,setLoading}) => {
    const {provider,setErrorMessage,userAddress,endpoint} = useContext(ConnectionContext)
    const contractAbi = ERC20abi
    const [name,setName] = useState(null)
    const [symbol,setSymbol] = useState(null)
    const [balance,setBalance] = useState(null)

    const loadContract = async()=>{
      try { 
        if(userAddress){
          setErrorMessage(null) 
            try {
            console.log(await provider.getBlockNumber())
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
          setErrorMessage("Please connect your wallet")
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

    const listenApprovals2 = async(contractAddress)=>{
      setLoading(true)
      const provider = new ethers.providers.JsonRpcProvider(endpoint)
      const contract = new ethers.Contract(contractAddress,contractAbi,provider)
      console.log('ethers block number ', await provider.getBlockNumber());
      const filter = contract.filters.Approval(userAddress);
      console.log('filter = ', filter);

      const logs = contract && await contract.queryFilter(filter)
      logs.sort((a, b) => a.blockNumber - b.blockNumber);
      console.log('logs', logs);

      const allowences = [];
      logs.forEach((event) => {
        const item = allowences.find((i) => i.address === event.args.spender);
        if (item) {
          if (event.args.value.isZero()) {
            allowences.splice(allowences.indexOf(item), 1);
          } else {
            item.value = ethers.utils.formatEther(event.args.value);
          }
        } else if(event.args.value.isZero() === false) {
          allowences.push({
            address: event.args.spender,
            value: ethers.utils.formatEther(event.args.value),
          });
        }
      });
      console.log({allowences});
      setAllowanceList(allowences);
    }  

    const handleClick=async()=>{
      setCurrentContract(contractAddress)
      setCurrentSymbol(symbol)
      setCurrentBalance(balance)
      // await listenApprovals2(contractAddress)
      // .then(()=>{setLoading(false)})
      setModalOpen(true)
    }
    
  return (
    <div className='flex justify-between border w-full h-full p-6 bg-slate-400 hover:bg-slate-300 text-black-100 cursor-pointer' onClick={handleClick}>
      
      <div className="flex justify-between gap-12">
        <RiCopperCoinLine size={24}/>
        <p className='font-medium'>{contractAddress}</p>
      </div>
      <div className="flex justify-between w-1/2">
        <div className="flex">
          <PiCurrencyEth size={24}/>
          <p className='font-medium'>{name && name} ({symbol && symbol})</p>
        </div>
        {/* <div className="flex">
          <SiSymbolab size={20}/>
          <p>{symbol && symbol}</p>
        </div> */}
        <div className="flex gap-2">
          
          <p className='font-medium'>{balance && parseFloat(balance).toFixed(3)}</p>
          <RiCoinsFill size={24}/>
        </div>

      </div>
      
    </div>
  )
}

export default Card
