import React from 'react'
import { useContext } from 'react';
import { NetworkContext } from '../contexts/Network';

const NetworkCard = ({brandColor,networkName,subnetName}) => {
  const {switchNetwork} = useContext(NetworkContext)

  const chooseNetwork = async(network) =>{
    await switchNetwork(network).then(()=>{
      window.location.reload()
    })
  }
  return (
    <div className={`flex flex-col items-center w-40 border rounded py-1 px-2 transition-shadow delay-100 shadow-[0_0px_10px_1px_${brandColor}]`}> 
        <div className="flex w-36"> 
          <div className="w-8 h-8 rounded mr-4">
            <img src={networkName+'-logo.png'} alt={networkName+'-logo'} />
          </div>
         <div className="font-bold text-lg"> 
            {networkName}
         </div>
        </div>
        <hr class="w-40 h-px bg-gray-400 border-0 my-2" />
        <div className="flex w-36 justify-around">
          <div className="font-semibold ">
            <button className='hover:text-gray-400'
            onClick={()=>{chooseNetwork(networkName)}}
            >
              Mainnet
            </button>
          </div>
          {!(networkName === 'Ethereum') &&
          <div className="font-semibold hover:text-gray-400">
            <button
            onClick={()=>{chooseNetwork(subnetName)}}
            >
              {subnetName}
            </button>
          </div>}
        </div>
      </div>
  )
}


const ChooseNetwork = () => {
  return (
    <div>
      <div className="flex flex-col gap-24 h-screen items-center justify-center">
        <div className="-m-16 font-semibold text-3xl">
          Choose Network 
        </div>
        <div className="flex gap-12 ">
        <NetworkCard networkName={"Polygon"} subnetName={"Mumbai"} brandColor={"#8247e5"}/>
        <NetworkCard networkName={"Celo"} subnetName={"Alfajores"} brandColor={"#fcff52"}/>
        <NetworkCard networkName={"Ethereum"} brandColor={"#3c3c3d"}/>
        </div>
      </div>
    </div>
  )
}

export default ChooseNetwork
