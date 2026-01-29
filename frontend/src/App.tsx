import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "./MainPage/MainPage"
import NavBar from "./NavBar/NavBar"

function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path = "/" element={<MainPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
