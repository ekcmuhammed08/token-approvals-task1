import React, { useEffect, useState, useContext } from 'react'
import {FaUserCircle,FaCoins} from 'react-icons/fa'
import ERC20abi from '../erc-20-abi.json' 
import { ConnectionContext } from '../contexts/Connection'
import {RiArrowDropDownLine, RiArrowDropUpLine} from 'react-icons/ri'
import {BiEdit} from 'react-icons/bi'
import {ImCross} from 'react-icons/im'
import {LuSendHorizonal} from 'react-icons/lu'
import { ethers } from 'ethers'

const Modal = ({modalOpen,currentBalance,currentSymbol,sendTokens,giveAllowance,setModalOpen,currentContract}) => {
    const [allowanceList,setAllowanceList] = useState('')
    const [operation, setOperation] = useState('Send')
    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState(null)
    const [isMax,setIsMax] = useState(false)
    const [openAllowances,setOpenAllowances] = useState(false)
    const [message,setMessage] = useState('')

    const contractAbi = ERC20abi
    const {provider,setErrorMessage,userAddress,endpoint} = useContext(ConnectionContext)
    
    const listenApprovals2 = async(contractAddress)=>{
        // setLoading(true)
        setErrorMessage('loading...')
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
    
    const handleSendTokens = ()=>{
        sendTokens(recipient,amount)
        .then(()=>{
            setRecipient('')
            setAmount(0)
        })
    }
    const handleGiveAllowance = ()=>{
        if(isMax){
            const max = ethers.constants.MaxUint256  
            giveAllowance(recipient,'max').then(()=>{
                setRecipient('')
                setAmount(0)
                setIsMax(false)
            })  
        }else{
            giveAllowance(recipient,amount).then(()=>{
            setRecipient('')
            setAmount(0)
            })  
        }
        
    }
    const handleRemoveAllowance = (address)=>{
        setRecipient('')
        setAmount(0)
        giveAllowance(address,'0')
    }
    const handleOpenAllowances = async()=>{
        setMessage('loading...')
        setOpenAllowances(!openAllowances)
        await listenApprovals2(currentContract).then(()=>{
            if(allowanceList.length===0){
                setMessage('No Allowances Found.')
            }else{setMessage('')}
        })
        
    }

    const handleSetOperation = (e)=>{
        if(e.target.value==='Send'){
          setOperation('Send')
        }else if(e.target.value==='Approve'){
          setOperation('Approve')
        }
        console.log(operation) 
    }

    const handleOperation = ()=>{
        if(operation === 'Send'){
            handleSendTokens()
        }else if(operation === 'Approve'){
            handleGiveAllowance()
        }
    }
    const handleSetMaximum = ()=>{
        if(operation === 'Send'){
            setIsMax(false)
            setAmount(currentBalance)
        }else if(operation === 'Approve'){
            setIsMax(true)
            setAmount(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
        }
    }

    const handleEdit = (address, amount)=>{
        setOperation('Approve')
        setRecipient(address)
        setTimeout(()=>{setAmount(amount)},100)
    }

    const handleModalClose =()=>{
        setModalOpen(false)
        setOpenAllowances(false)
        setAllowanceList('')
        setRecipient('')
        setAmount(0)
        setOperation('Send')
    }

    useEffect(() => {
      setAmount(0)
    }, [operation])
    
  return (
    <div className={`flex ${!modalOpen&&'hidden'}`} >
        <div className={`flex flex-col w-[36%] p-8 rounded-md bg-slate-300 ${!modalOpen&&'hidden'} absolute top-[25%] left-[32%] z-10`} >            
            <div className="">
             {operation} {currentSymbol&&currentSymbol} Tokens 
            </div>
            <div className="">
                <input type="text" className='w-2/3 h-12 p-4 text-center' placeholder='recipient' onChange={(e)=>{setRecipient(e.target.value)}} value={recipient}/> 
            </div>
            <div className="flex justify-center mt-2 gap-4">
                <button onClick={(e)=>{handleSetOperation(e)}} value={'Send'} className={`${operation==='Send'&&'bg-blue-100'} p-2`}>Send</button>
                <button onClick={(e)=>{handleSetOperation(e)}} value={'Approve'} className={`${operation==='Approve'&&'bg-blue-100'} p-2`}>Approve</button>
            </div>
            <div className="flex justify-center mt-2 gap-6"> 
                <div className="flex items-center">
                    <input type="number" placeholder='Amount' className='h-12 p-4 pr-16 m-0 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                    onChange={(e)=>{setAmount(e.target.value)}}
                    value={amount} /> 
                    <button className='-ml-14 bg-blue-200 w-12 h-8 p-1 rounded-xl' onClick={handleSetMaximum}>Max</button> 
                </div>
                
                <button className='p-2 bg-white' onClick={handleOperation}>
                    <LuSendHorizonal size={24}/>
                </button>
            </div>
            {/* <div className="flex flex-col items-center">
                <p className='font-bold'>Send {currentSymbol} Tokens</p> 
                <div className="flex flex-row">
                    <input type="text" className='border-4 mr-4' placeholder='recipient address' ref={recipientRef}/>
                    <input type='number' className='border-4 w-20' placeholder='amount' ref={sendAmountRef} step='.000000000000000001'/>
                    <button className='bg-gray-300 border rounded w-full px-2 mx-2' onClick={handleSendTokens}>Send</button>
                </div>
            </div>
            <hr className='my-4'/>
            <div className="flex flex-col items-center">
                <p className='font-bold'>Set Allowance For {currentSymbol} Tokens</p> 
                <div className="flex flex-row">
                    <input type="text" className='border-4 mr-4' placeholder='recipient address' ref={allowanceRecipientRef}/>
                    <input type='number' className='border-4 w-20' placeholder='amount' ref={giveAllowanceRef} step='.000000000000000001'/>
                    <button className='bg-gray-300 border rounded w-full px-2 mx-2' onClick={handleGiveAllowance}>Give</button>
                </div>
            </div> */}
            <div className="mt-2">
                <button className='flex justify-between bg-[#d9eafa] border p-1 rounded w-full' onClick={handleOpenAllowances}>
                    <p> </p>
                    Show Allowances Given  
                {openAllowances?<RiArrowDropUpLine className='flex justify-end' size={24}/>: <RiArrowDropDownLine className='flex justify-end' size={24}/>}
                </button>
                {openAllowances&&<div className="">
                    {allowanceList.length===0 && <p>{message}</p>}
                    {allowanceList &&<div className="">
                        {allowanceList.map((e,i)=>{ 
                        return<div className="flex justify-between border rounded my-2 p-4 w-full items-center gap-4">
                            <div className='flex'>
                                <p className='pl-2'> {e.address} </p>
                            </div>
                            
                            <div className="flex items-center">
                                <div className='flex justify-between items-center border px-6 w-30 h-12 relative'>
                                        <div className="">
                                            <FaCoins size={16} className='mt-1'/>
                                        </div>
                                        <p className='text-lg font-medium pl-2'> {e.value} </p>
                                        <div className="absolute top-1 right-1 cursor-pointer"
                                        onClick={()=>{handleEdit(e.address,e.value)}}
                                        >
                                            <BiEdit size={16} className='text-gray-500 hover:text-black'/>
                                        </div>
                                </div>
                                <button className='ml-4 h-full flex justify-center items-center hover:bg-slate-100'
                                onClick={()=>{handleRemoveAllowance(e.address)}}
                                >
                                    <ImCross size={16}/>
                                </button>
                            </div>
                            
                        </div>
                        })} 
                    </div>
                    }
                </div>}
            </div>
        </div>
        <div className="bg-[#00000080] w-screen h-screen absolute top-[0%] left-[0%]"  onClick={handleModalClose}></div>
    </div>
  )
}

export default Modal
