import './App.css';
import MainContainer from './MainContainer';
import Error from './components/Error'
import ChooseNetwork from './components/ChooseNetwork';
import { useContext, useEffect } from 'react';
import { NetworkContext } from './contexts/Network';
function App() {  
  return (
    <div className="App mt-0 w-screen h-screen bg-slate-100 ">
      {window.ethereum ?
        (localStorage.getItem('currentNetwork')==null) ? 
        <ChooseNetwork/>
        :<MainContainer/>
      :<Error errorCode={1}/>}
    </div>
  );
}

export default App;
