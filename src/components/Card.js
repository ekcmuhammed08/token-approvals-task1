import React, { useContext } from 'react'
import ERC20abi from './erc-20-abi.json' 
import { ConnectionContext } from './contexts/Connection'

const Card = ({contractAddress}) => {
    const {provider,setErrorMessage} = useContext(ConnectionContext)
    const contractAbi = ERC20abi

    const contractHandler = async()=>{
        try { 
         if(userAddress){
           setErrorMessage('') 
           contractAddress.map(async(item,i)=>{
             try {
             console.log('inn')
             console.log(item.address)
             item.id = i
             const contract = new ethers.Contract(item.address,contractAbi,provider)  
             console.log(contract)
             const name = await contract.name()
             item.name = await name
             const symbol = await contract.symbol()
             item.symbol = await symbol
             const balance = await contract.balanceOf(userAddress)
             item.balance = await ethers.utils.formatEther(balance)
             
             } catch (error) {
               console.log(error)
             }
           })
           console.log(contractAddress)
         }
         else{
           setErrorMessage("please connect with your wallet first")
         }
         
        } catch (error) {
         console.log(error)
        }
       }
  return (
    <div>
      
    </div>
  )
}

export default Card
