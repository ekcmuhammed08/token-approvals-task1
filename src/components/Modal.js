import React, { useEffect, useState } from 'react'
import {FaUserCircle,FaCoins} from 'react-icons/fa'
import {MdCancel} from 'react-icons/md'

const Modal = ({modalOpen,recipientRef,sendAmountRef,allowanceRecipientRef,giveAllowanceRef,
currentSymbol,sendTokens,giveAllowance,setModalOpen,allowanceList}) => {

    const [openAllowances,setOpenAllowances] = useState(false) 
    const handleSendTokens = ()=>{
        sendTokens()
        .then(()=>{
        recipientRef.current.value = ''
        sendAmountRef.current.value = '' 
        })
    }
    const handleGiveAllowance = ()=>{
        giveAllowance(allowanceRecipientRef.current.value,giveAllowanceRef.current.value)
        .then(()=>{
          recipientRef.current.value = ''
          sendAmountRef.current.value = ''
        })
    }
    const handleRemoveAllowance = (address)=>{
        console.log(address)
        giveAllowance(address,'0')
        .then(()=>{
          recipientRef.current.value = ''
          sendAmountRef.current.value = ''
        })
    }
    const handleOpenAllowances = ()=>{
        setOpenAllowances(!openAllowances)
    }

    useEffect(() => {
      if(modalOpen===false){
        setOpenAllowances(false)
      }
    }, [modalOpen])
    
  return (
    <div className={`flex ${!modalOpen&&'hidden'}`} >
        <div className={`flex flex-col w-[30%] m-4 p-4 rounded-md bg-slate-300 ${!modalOpen&&'hidden'} absolute top-[25%] left-[35%] z-10`} >
            <div className="flex flex-col items-center">
                <p className='font-bold'>Send {currentSymbol} Tokens</p> 
                <div className="flex flex-row">
                    <input type="text" className='border-4 mr-4' placeholder='recipient address' ref={recipientRef}/>
                    <input type='number' className='border-4 w-20' placeholder='amount' ref={sendAmountRef} step='.000000000000000001'/>
                    <button className='bg-gray-300 border rounded w-full px-2 mx-2' onClick={handleSendTokens}>Send</button>
                </div>
            </div>
            <hr className='my-4'/>
            <div className="flex flex-col items-center">
                <p className='font-bold'>Give Allowance For {currentSymbol} Tokens</p> 
                <div className="flex flex-row">
                    <input type="text" className='border-4 mr-4' placeholder='recipient address' ref={allowanceRecipientRef}/>
                    <input type='number' className='border-4 w-20' placeholder='amount' ref={giveAllowanceRef} step='.000000000000000001'/>
                    <button className='bg-gray-300 border rounded w-full px-2 mx-2' onClick={handleGiveAllowance}>Give</button>
                </div>
            </div>
            <div className="mt-2">
                {openAllowances?<button className='bg-[#f0f8ff] border p-1 rounded' onClick={handleOpenAllowances}>Show Allowances Given ^</button>
                :<button className='bg-[#d9eafa] border p-1 rounded' onClick={handleOpenAllowances}>Show Allowances Given v</button>}
                {openAllowances&&<div className="">
                    {allowanceList && allowanceList.length>0 ?<div className="">
                        {allowanceList.map((e,i)=>{ 
                        console.log(e)
                        return<div className="flex justify-between border rounded my-2 p-4 p items-center">
                            <div className='flex'><FaUserCircle size={'24px'}/><p className='pl-2'> {e.address} </p></div>
                            <div className='flex justify-between items-center'>
                                <FaCoins size={'20px'} className='mt-1'/>
                                <p className='text-lg font-medium pl-2'> {e.value} </p>
                                <div className="" onClick={()=>{handleRemoveAllowance(e.address)}}><MdCancel className='ml-3'/></div>
                            </div>
                        </div>
                        })} 
                    </div>
                    :<div>
                    Loading..
                    </div>}
                </div>}
            </div>
        </div>
        <div className="bg-[#00000080] w-screen h-screen absolute top-[0%] left-[0%]" onClick={()=>{setModalOpen(false)}}></div>
    </div>
  )
}

export default Modal
