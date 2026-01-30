import { type Film } from "../../types";
import defaultPic from "../../assets/default_film_pic.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";

interface FilmCardProps {
  film: Film; // This uses your imported Film interface
}

export default function FilmCard({ film }: FilmCardProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      className="bg-[#292929] h-45 rounded-lg overflow-hidden group hover:cursor-pointer flex flex-col 
                    transition-all duration-300 ease-in-out hover:translate-y-0.5 hover:shadow-inner"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      to={`/movie/${film.film_id}`} state={{ title: film.title }}
    >
      <div className="h-[70%] relative">
        <img
          className="w-full h-full object-fit transition-transform 
      duration-500 ease-in-out group-hover:scale-105"
          src={
            film.backdrop
              ? `https://image.tmdb.org/t/p/w500${film.backdrop}`
              : defaultPic
          }
          alt={film.title}
        ></img>
         {isHover && <div className="bg-black/50 absolute bottom-0 h-[20%] flex text-[10px] gap-1 items-center p-1">{
          film.genres.map((g, i)=><div key={i}>{g}</div>)
         }</div>}
      </div>

     
      <div className="flex flex-col justify-center grow p-2">
        <div className="text-sm">{film.title}</div>
        <div className="text-[10px] text-gray-300">{film.directors}</div>
      </div>
    </Link>
  );
}
