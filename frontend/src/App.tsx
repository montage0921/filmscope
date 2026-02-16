import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "./MainPage/MainPage"
import NavBar from "./NavBar/NavBar"
import MoviePage from "./MoviePage/MoviePage"
import LoginOverlay from "./Login/LoginOverlay"

function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path = "/" element={<MainPage/>}/>
        <Route path = "/movie/:id" element={<MoviePage/>}/>
        <Route path = "/login" element={<LoginOverlay/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
