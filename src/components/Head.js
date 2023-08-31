import React, { useContext } from 'react'
import Card from './Card'
import Error  from './Error'
import {MdAccountBalanceWallet, MdExitToApp} from 'react-icons/md'
import {FaEthereum} from 'react-icons/fa'
import { ConnectionContext } from '../contexts/Connection'


const Head = ({inputRef,selectRef,handleSelectNetwork,userAddress,currentNetwork,userBalance,setCurrentContract,
    setModalOpen,modalOpen,setCurrentSymbol,refreshContract, setAllowanceList,
  parseAddress,parseBalance,allowancesGiven, endpoint, refreshInfo, setLoading}) => { 

    const { disconnectHandler } = useContext(ConnectionContext)
    const handleSubmit = (e)=>{
        e.preventDefault()
        if(localStorage.getItem(`${currentNetwork} Contracts`)===null){
          localStorage.setItem(`${currentNetwork} Contracts`,JSON.stringify([inputRef.current.value]))
        }
        else{
          const arr = JSON.parse(localStorage.getItem(`${currentNetwork} Contracts`))
          !arr.includes(inputRef.current.value) && arr.push(inputRef.current.value)
          localStorage.setItem(`${currentNetwork} Contracts`,JSON.stringify(arr))
        }
        inputRef.current.value = ''
        refreshInfo(4000)
    }
  return (
    <div className=" mb-8">
        {console.log(window.ethereum.isConnected())}
        <div className="flex bg-[#afeeee] w-full h-20 items-center justify-end px-16">
        {userAddress&&
        <div className="flex"> 
            <MdAccountBalanceWallet size={'30px'} className='mt-1 mr-2'/>
            {userAddress&&<p className='text-3xl font-medium pr-8'>{parseAddress(userAddress)}</p>}
            <FaEthereum size={'28px'} className='mt-1 mr-2'/>
            {userBalance&&<p className='text-3xl font-medium pr-8'>{parseBalance(JSON.stringify(userBalance))}</p>}
        </div>}
        <div className="">
            <select id="select" ref={selectRef} onClick={handleSelectNetwork}>
                <option value="Mumbai" id='Mumbai'>Mumbai</option>
                <option value="Polygon" id='Polygon'>Polygon</option>
                <option value="Ethereum" id='Ethereum'>Ethereum</option>
                <option value="Celo" id='Celo'>Celo</option>
                <option value="Celo Alfajores" id='Celo Alfajores'>Celo Alfajores</option>
            </select>
        </div>
        {userAddress&& 
        <div className="ml-4 mt-1">
          <button onClick={disconnectHandler}>
            <MdExitToApp size={'25px'}/>
          </button>
        </div>}
        </div>
        {userAddress?
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
            {localStorage.getItem(`${currentNetwork} Contracts`) &&
            JSON.parse(localStorage.getItem(`${currentNetwork} Contracts`)).map((c)=>{
              return <Card contractAddress={c} setCurrentContract={setCurrentContract} 
              setModalOpen={setModalOpen} modalOpen={modalOpen} setCurrentSymbol={setCurrentSymbol}
              refreshContract={refreshContract} setAllowanceList={setAllowanceList} 
              allowancesGiven={allowancesGiven} endpoint={endpoint} refreshInfo={refreshInfo} 
              setLoading={setLoading}/>
            })}
          </div>
        </div>
        :
        <Error errorCode={2}/>
        }
      </div>
  )
}

export default Head
