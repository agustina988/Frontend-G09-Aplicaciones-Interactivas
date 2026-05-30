import './App.css'
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navigation from './components/Navigation';
import Home from './views/Home'
import Joyeria from './views/Joyeria';

function App() {

  return (
    <>
     <Navigation></Navigation>
     <Routes>
      <Route path = '/home' element = {<Home/>}/>
      <Route path="/joyeria" element = {<Joyeria/>}/>
     </Routes>
    </>
  )
}

export default App
