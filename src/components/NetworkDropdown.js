import React, { useContext, useState } from 'react'
import { NetworkContext } from '../contexts/Network'

const NetworkDropdown = ({selectNetwork}) => {
    const [mainHidden,setMainHidden] = useState(true)
    const [celoHidden,setCeloHidden] = useState('hidden')
    const [polygonHidden,setPolygonHidden] = useState('hidden')

    const  {currentNetwork} = useContext(NetworkContext)

    const handleSelectNetwork = (network) => {
        selectNetwork(network)
        setMainHidden(true)
    }
  return (
    <div className='flex h-full '>   
        <div className='flex flex-col mt-4 w-96'>
            {console.log(mainHidden)}  
            <button id="multiLevelDropdownButton" data-dropdown-toggle="dropdown" class={`w-1/2 mb-1 h- justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
            onClick={()=>{setMainHidden(!mainHidden)}}>
                {currentNetwork? currentNetwork:'Select Network'} 
                <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
            </button>
        
            <div className={`${mainHidden?'hidden':''} flex`}
            >
                <div id="dropdown" class=" w-1/2 z-10 h-fit bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                    <ul class=" py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
                        <li>
                            <button class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={()=>{handleSelectNetwork('Ethereum')}}>Ethereum</button>
                        </li>
                        <li className='flex'
                        onMouseEnter={()=>{setCeloHidden('')}} onMouseLeave={()=>{setCeloHidden('hidden')}}
                        >
                            <button id="doubleDropdownButton" data-dropdown-toggle="doubleDropdown" data-dropdown-placement="right-start" type="button" class={`flex items-center justify-between w-full px-4 py-2 ${(celoHidden==='')&&'bg-gray-100'} hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
                                Celo
                                <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            </button>                           
                        </li> 
                        <li
                        onMouseEnter={()=>{setPolygonHidden('')}} onMouseLeave={()=>{setPolygonHidden('hidden')}}
                        >
                            <button id="doubleDropdownButton" data-dropdown-toggle="doubleDropdown" data-dropdown-placement="right-start" type="button" class={`flex items-center justify-between w-full px-4 py-2 ${(polygonHidden==='')&&'bg-gray-100'} hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}>
                                Polygon
                                <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
                <div id="doubleDropdown" className={`${celoHidden} mt-9 transition-duration: 1500ms; z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 h-auto align-end dark:bg-gray-700`}
                onMouseEnter={()=>{setCeloHidden('')}} onMouseLeave={()=>{setCeloHidden('hidden')}}>
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
                        <li>
                            <button class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={()=>{handleSelectNetwork('Celo')}}>Mainnet</button>
                        </li>
                        <li>
                            <button class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={()=>{handleSelectNetwork('Alfajores')}}>Alfajores</button>
                        </li>
                    </ul>
                </div>
                <div id="doubleDropdown" className={`${polygonHidden} mt-[4.5rem] transition-duration: 1500ms; z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 h-auto align-end dark:bg-gray-700`}
                onMouseEnter={()=>{setPolygonHidden('')}} onMouseLeave={()=>{setPolygonHidden('hidden')}}>
                    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="doubleDropdownButton">
                        <li>
                            <button class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={()=>{handleSelectNetwork('Polygon')}}>Mainnet</button>
                        </li>
                        <li>
                            <button class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={()=>{handleSelectNetwork('Mumbai')}}>Mumbai</button>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>
        
    </div> 
  )
}

export default NetworkDropdown