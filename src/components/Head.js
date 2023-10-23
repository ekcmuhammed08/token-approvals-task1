import React, { useContext, useState, useEffect} from 'react' 
import Card from './Card'
import Error  from './Error'
import ERC20abi from '../erc-20-abi.json' 
import {MdAccountBalanceWallet, MdExitToApp} from 'react-icons/md'
import {FaEthereum} from 'react-icons/fa'
import {GrFormAdd} from 'react-icons/gr'
import {GoStack} from 'react-icons/go'
import { ConnectionContext } from '../contexts/Connection'
import { NetworkContext } from '../contexts/Network'
import { ethers } from 'ethers'
import NetworkDropdown from './NetworkDropdown'


const Head = ({inputRef,selectRef,handleSelectNetwork, setCurrentContract,
    setModalOpen,modalOpen,setCurrentSymbol,refreshContract, setAllowanceList,
  parseAddress,parseBalance,allowancesGiven, refreshInfo, setLoading, setCurrentBalance}) => { 
    const [symbol,setSymbol] = useState('')
    const [tokenName,setTokenName] = useState('')
    const [hidden,setHidden] = useState('hidden')
    // const [newToken,setNewToken] = useState('')
    
    const contractAbi = ERC20abi
    const { disconnectHandler, endpoint, provider, userBalance, userAddress } = useContext(ConnectionContext)
    const {switchNetwork, currentNetwork} = useContext(NetworkContext)
    const fetchTokenInfo = async(contractAddress)=>{
      const contract = new ethers.Contract(contractAddress,contractAbi,provider)
      const symbol = await contract.symbol()
      const name = await contract.name()
      setSymbol(symbol)
      setTokenName(name)
    }
    const handleChange = (e)=>{
      setHidden('hidden')
      setTokenName('')
      if(e.target.value.length === 42){
        setTokenName('loading...')
        setSymbol('loading...') 
        setHidden('')
        fetchTokenInfo(e.target.value).catch
        ((error)=>{
          console.log(error)
          setSymbol('symbol')
          setTokenName('')
          setHidden('hidden')
        })
        
      }
    }

    useEffect(() => {
      setSymbol('symbol')
      setTokenName('')
      setHidden('hidden')
    }, [currentNetwork])

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
        setTokenName('')
        setHidden('hidden')
        refreshInfo(4000)
    }

    // useEffect(() => {
    //  inputRef.current.value = inputRef && inputRef.current.value&& ''
    //   }, [currentNetwork])
  return (
    <div className=" mb-8">
        <div className="flex bg-[#afeeee] w-full h-20 items-center justify-between px-16">
          {/* <div className="">
              <select id="select" ref={selectRef} onClick={handleSelectNetwork}>
                  <option value="Mumbai" id='Mumbai'>Mumbai</option>
                  <option value="Polygon" id='Polygon'>Polygon</option>
                  <option value="Ethereum" id='Ethereum'>Ethereum</option>
                  <option value="Celo" id='Celo'>Celo</option>
                  <option value="Alfajores" id='Alfajores'>Alfajores</option>
              </select>
          </div> */}
          <NetworkDropdown selectNetwork={handleSelectNetwork}/>
          
          {userAddress&&<div className="flex">
            <div className="flex"> 
                <MdAccountBalanceWallet size={'30px'} className='mt-1 mr-2'/>
                {userAddress&&<p className='text-3xl font-medium pr-8'>{parseAddress(userAddress)}</p>}
                <FaEthereum size={'28px'} className='mt-1 mr-2'/>
                {userBalance&&<p className='text-3xl font-medium pr-8'>{parseBalance(JSON.stringify(userBalance))}</p>}
            </div>
            <div className="ml-4 mt-1">
              <button onClick={disconnectHandler}>
                <MdExitToApp size={'25px'}/>
              </button>
            </div>
          </div>}
        </div>
        {userAddress?
        <div className='flex flex-col items-center'>
          {currentNetwork&& <div className='add-tokens mt-12'>
              <form onSubmit={(e)=>{handleSubmit(e)}} >
                <label className='flex flex-col items-center'>
                    <p className='text-3xl font-medium'>Add Tokens</p>
                    <p className='text-md font-medium'>with Contract Address</p>
                    <br />
                    <input 
                    onChange={(e)=>{handleChange(e)}}
                    type="text"
                    placeholder='contract address'
                    ref={inputRef}
                    size={'50px'}
                    className='h-16 w-96 rounded-xl p-4'
                    />
                    
                    <div className='flex justify-between w-96 mt-2 items-center'>
                      <div className="flex items-center">
                        <input disabled='true' placeholder={hidden?'symbol':symbol} className='rounded border px-2 mr-4 text-white h-[3rem] w-[6rem]'/>
                        <FaEthereum className={`${hidden}`}/> {hidden?'':tokenName}
                      </div>
                      
                      <div className={`flex bg-white w-[8rem] p-2 rounded  ${(tokenName==='' || tokenName ==='loading...')?'hidden':''} 
                      cursor-pointer items-center justify-center hover:bg-gray-200`}
                      onClick={(e)=>{handleSubmit(e)}}> 
                        Add Token 
                        <GrFormAdd size={'24px'}  color='blue'/>
                      </div>  
                    </div>
                     
                </label>
              </form>
              
          </div>}
           <div className='w-2/3 border mt-12 border-dashed border-4 rounded'>
            <ul>
              {localStorage.getItem(`${currentNetwork} Contracts`) ?
              JSON.parse(localStorage.getItem(`${currentNetwork} Contracts`)).map((c)=>{
                return <li>
                    <Card contractAddress={c} setCurrentContract={setCurrentContract} 
                    setModalOpen={setModalOpen} modalOpen={modalOpen} setCurrentSymbol={setCurrentSymbol}
                    refreshContract={refreshContract} setAllowanceList={setAllowanceList} 
                    allowancesGiven={allowancesGiven} endpoint={endpoint} refreshInfo={refreshInfo} 
                    setLoading={setLoading} setCurrentBalance={setCurrentBalance}/>
                </li>
              }):
              <div className="flex flex-col items-center gap-4 m-12">
                <GoStack size={64}/>
                No tokens imported yet 
              </div>
              }
            </ul>
          </div>
          {/* <div className="flex flex-col flex-wrap w-2/3 bg-[#f0f8ff] justify-center mt-12 border-dashed border-4 rounded">
         
            {localStorage.getItem(`${currentNetwork} Contracts`) ?
            JSON.parse(localStorage.getItem(`${currentNetwork} Contracts`)).map((c)=>{
              return <Card contractAddress={c} setCurrentContract={setCurrentContract} 
              setModalOpen={setModalOpen} modalOpen={modalOpen} setCurrentSymbol={setCurrentSymbol}
              refreshContract={refreshContract} setAllowanceList={setAllowanceList} 
              allowancesGiven={allowancesGiven} endpoint={endpoint} refreshInfo={refreshInfo} 
              setLoading={setLoading}/>
            }):
            <div className="flex flex-col items-center gap-4 m-12">
              <GoStack size={64}/>
              No tokens imported yet
            </div>
            
            }
          </div> */}
        </div>
        :
        <Error errorCode={2}/>
        }
      </div>
  )
}

export default Head
