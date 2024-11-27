 import { Routes,Route } from "react-router-dom"
import Lobby from "./pages/lobby"
import Room from "./pages/room"
 
const App = () => {
  return (
     <div>
       <Routes>
         <Route path="/" element={<Lobby />} />
         <Route path="/room/:id" element={<Room />} />
       </Routes>
     </div>
  )
}

export default App