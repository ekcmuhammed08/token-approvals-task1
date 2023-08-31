import './App.css';
import MainContainer from './MainContainer';
import Error from './components/Error'

function App() {
  return (
    <div className="App mt-0 w-screen h-screen bg-slate-100 ">
      {window.ethereum ?
      <MainContainer/>
      :<Error errorCode={1}/>}
    </div>
  );
}

export default App;
