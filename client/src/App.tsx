 import { Routes,Route } from "react-router-dom"
import Lobby from "./pages/lobby"
import Room from "./pages/room"
import Home from "./pages/home"
const App = () => {
  return (
     <div>
       <Routes>
         <Route path="/" element={<Home/>} />
         <Route path="/lobby" element={<Lobby />} />
         <Route path="/room/:id" element={<Room />} />
       </Routes>
     </div>
  )
}

export default App