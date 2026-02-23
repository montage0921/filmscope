import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "./MainPage/MainPage"
import NavBar from "./NavBar/NavBar"
import MoviePage from "./MoviePage/MoviePage"
import LoginOverlay from "./Auth/LoginOverlay"
import ResetPassword from "./Auth/ResetPassword"
import ShowEditPage from "./ShowEditPage/ShowEditPage"

function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path = "/" element={<MainPage/>}/>
        <Route path = "/movie/:id" element={<MoviePage/>}/>
        <Route path = "/login" element={<LoginOverlay/>}/>
        <Route path = "/reset-password" element={<ResetPassword/>}/>
        <Route path = "/edit-show/:film_id" element={<ShowEditPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
