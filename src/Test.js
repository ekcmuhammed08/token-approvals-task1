import React, { useContext } from 'react'
import { ConnectionContext } from './contexts/Connection'

const Test = () => {
    const {errorMessage,userBalance,userAddress} = useContext(ConnectionContext)
  return (
    <div>
      <p>{errorMessage}</p>
      <p>{userBalance}</p>
      <p>{userAddress}</p>
    </div>
  )
}

export default Test
