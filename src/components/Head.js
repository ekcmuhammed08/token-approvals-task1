import React from 'react'
import Card from './Card'
import {MdAccountBalanceWallet} from 'react-icons/md'
import {FaEthereum} from 'react-icons/fa'

const Head = ({inputRef,selectRef,handleSelectNetwork,userAddress,currentNetwork,userBalance,setCurrentContract,
    setModalOpen,modalOpen,setCurrentSymbol,refreshContract, setRefreshContract, setAllowanceList,
  parseAddress,parseBalance,allowancesGiven,getAllowances, endpoint}) => { 

    const handleSubmit = (e)=>{
        e.preventDefault()
        if(localStorage.getItem(`${currentNetwork}Contracts`)===null){
          localStorage.setItem(`${currentNetwork}Contracts`,JSON.stringify([inputRef.current.value]))
        }
        else{
          const arr = JSON.parse(localStorage.getItem(`${currentNetwork}Contracts`))
          !arr.includes(inputRef.current.value) && arr.push(inputRef.current.value)
          localStorage.setItem(`${currentNetwork}Contracts`,JSON.stringify(arr))
        }
        inputRef.current.value = ''
    }
  return (
    <div className=" mb-8">
        <div className="flex bg-[#afeeee] w-full h-20 items-center justify-end px-16">
            <div className="flex"> 
                <MdAccountBalanceWallet size={'30px'} className='mt-1 mr-2'/>
                {userAddress&&<p className='text-3xl font-medium pr-8'>{parseAddress(userAddress)}</p>}
                <FaEthereum size={'28px'} className='mt-1 mr-2'/>
                {userBalance&&<p className='text-3xl font-medium pr-8'>{parseBalance(JSON.stringify(userBalance))}</p>}
            </div>
            <div className="">
                <select id="select" ref={selectRef} onClick={handleSelectNetwork}>
                    <option value="Mumbai" id='Mumbai'>Mumbai</option>
                    <option value="Polygon" id='Polygon'>Polygon</option>
                    <option value="Ethereum" id='Ethereum'>Ethereum</option>
                    <option value="Celo" id='Celo'>Celo</option>
                    <option value="Celo Alfajores" id='Celo Alfajores'>Celo Alfajores</option>
                </select>
            </div>
        </div>
        {userAddress&&
        <div className='flex flex-col items-center'>
          {currentNetwork&& <div className='add-tokens mt-12'>
              <form onSubmit={(e)=>{handleSubmit(e)}}>
                <label>
                    <p className='text-3xl font-medium'>Add Tokens</p>
                    <p className='text-md font-medium'>with Contract Address</p>
                    <br />
                    <input type="text"
                    placeholder='contract address'
                    ref={inputRef}
                    />
                    <input type='submit' value='+add' className='bg-gray-500 rounded border px-2 ml-2 text-white cursor-pointer'/>
                </label>
              </form> 
          </div>}
          <div className="flex flex-wrap w-2/3 bg-[#f0f8ff] justify-center mt-12 border-dashed border-4 rounded">
            {localStorage.getItem(`${currentNetwork}Contracts`) &&
            JSON.parse(localStorage.getItem(`${currentNetwork}Contracts`)).map((c)=>{
              return <Card contractAddress={c} setCurrentContract={setCurrentContract} 
              setModalOpen={setModalOpen} modalOpen={modalOpen} setCurrentSymbol={setCurrentSymbol}
              refreshContract={refreshContract} setRefreshContract={setRefreshContract} 
              setAllowanceList={setAllowanceList} allowancesGiven={allowancesGiven}
              getAllowances={getAllowances} endpoint={endpoint}/>
            })}
          </div>
        </div>}
      </div>
  )
}

export default Head
