import React from 'react'
import '../App.css'

const Loading = ({loading}) => {
  return (
  <div className={`${loading?'':'hidden'} fixed top-0 left-0 w-[100%] h-[100%] bg-[#0000003b] flex justify-center items-center`}>
        <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
  )
}


export default Loading
