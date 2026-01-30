import { useParams } from "react-router-dom";
import { type DetailedFilmInfo } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingDots from "../assets/LoadingDots";

export default function MoviePage() {
  const [detailedInfo, setDetailedInfo] = useState<DetailedFilmInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  async function fetchDetailedMovieINfo() {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:8080/filmscope/films/${id}`,
      );
      const data = res.data;
      console.log(data);
      setDetailedInfo(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(function () {
    fetchDetailedMovieINfo();
  }, []);

  if (isLoading === true)
    return (
      <div className=" h-screen flex justify-center">
        <LoadingDots />
      </div>
    );

  return (
    <div className=" bg-black h-screen flex flex-col items-center">
      <div className=" w-1/2 relative">
        <img
          src={`https://image.tmdb.org/t/p/original${detailedInfo?.backdrop}`}
        ></img>
       <div className="bg-linear-to-t from-black to-transparent absolute w-full h-20 2xl:h-40 -bottom-2 lg:bottom-0"></div>
      </div>
    </div>
  );
}
