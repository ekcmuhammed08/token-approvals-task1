import { createContext, useState} from "react";

export const NetworkContext = createContext()  

export const NetworkProvider = ({ children })=>{
    
    const [currentNetwork,setCurrentNetwork] = useState(null)
    window.ethereum &&window.ethereum.on('networkChanged', ()=>{networkChangeHandler()})
    const networkChangeHandler = async()=>{
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if(chainId==='0x13881'){
        switchNetwork('Mumbai')
      }else if(chainId==='0x89'){
        switchNetwork('Polygon')
      }else if(chainId==='0x1'){
        switchNetwork('Ethereum')
      }else if(chainId==='0xa4ec'){
        switchNetwork('Celo')
      }else if(chainId==='0xaef3'){
        switchNetwork('Alfajores')
      }
    }    
    const switchNetwork = async(key) =>{
        switch (key) {
          case "Mumbai":
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }],
              }).then(()=>{setCurrentNetwork('Mumbai')})
                .then(()=>{localStorage.setItem(`currentNetwork`,JSON.stringify('Mumbai'))})
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x13881',
                        chainName: 'Mumbai',
                        rpcUrls: ['https://rpc-mumbai.maticvigil.com'] /* ... */,
                      },
                    ],
                  });
                } catch (addError) {
                  // handle "add" error
                }
              }
              // handle other "switch" errors
            }
            break;
          case "Polygon":
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }],
              }).then(()=>{setCurrentNetwork('Polygon')})
                .then(()=>{localStorage.setItem(`currentNetwork`,JSON.stringify('Polygon'))})
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x89',
                        chainName: 'Polygon Mainnet',
                        rpcUrls: ['https://polygon-rpc.com'] /* ... */,
                      },
                    ],
                  });
                } catch (addError) {
                  // handle "add" error
                }
              }
              // handle other "switch" errors
            }
            break;
          case "Ethereum":
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }],
              }).then(()=>{setCurrentNetwork('Ethereum')})
                .then(()=>{localStorage.setItem(`currentNetwork`,JSON.stringify('Ethereum'))})
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x1',
                        chainName: 'Ethereum Mainnet',
                        rpcUrls: ['https://ethereum.publicnode.com'] /* ... */,
                      },
                    ],
                  });
                } catch (addError) {
                  // handle "add" error
                }
              }
              // handle other "switch" errors
            }
            break;
          case "Celo":
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xa4ec' }],
              }).then(()=>{setCurrentNetwork('Celo')})
                .then(()=>{localStorage.setItem(`currentNetwork`,JSON.stringify('Celo'))})
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0xa4ec',
                        chainName: 'Celo Mainnet',
                        rpcUrls: ['https://forno.celo.org'] /* ... */,
                      },
                    ],
                  });
                } catch (addError) {
                  // handle "add" error
                }
              }
              // handle other "switch" errors
            }
            break;
          case "Alfajores":
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaef3' }],
              }).then(()=>{setCurrentNetwork('Alfajores')})
                .then(()=>{localStorage.setItem(`currentNetwork`,JSON.stringify('Alfajores'))})
            } catch (switchError) {
              // This error code indicates that the chain has not been added to MetaMask.
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0xaef3',
                        chainName: 'Alfajores Testnet',
                        rpcUrls: ["https://alfajores-forno.celo-testnet.org"] /* ... */,
                      },
                    ],
                  });
                } catch (addError) {
                  // handle "add" error
                }
              }
              // handle other "switch" errors
            }
            break;
        }
    }
    
    return (<NetworkContext.Provider
    value = {{switchNetwork, currentNetwork,setCurrentNetwork
    }}
    >{children}</NetworkContext.Provider>)
}