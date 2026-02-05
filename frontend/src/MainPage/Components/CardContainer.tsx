import axios from 'axios'
import { useState, useEffect } from 'react'
import FilmCard from './FilmCard'
import { type Film } from '../../types'

export default function CardContainer() {
  const [films, setFilms] = useState<Film[]>([])

  async function fetchFilms(){
    try{
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/films`)
        setFilms(res.data)
    }catch(error){
        console.error("CORS or Network Error:", error)
    }
    
  }

  useEffect(function(){
    fetchFilms()
  },[])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 justify-center gap-5 gap-x-5'>
      {films.map(film=><FilmCard key={film.film_id} film={film}/>)}
    </div>
  )
}
