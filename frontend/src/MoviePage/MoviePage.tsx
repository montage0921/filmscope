import { useParams } from "react-router-dom";
import { type DetailedFilmInfo, type Genre } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingDots from "../Utility/LoadingDots";
import { type TabItem } from "../types";
import Section from "./Components/Section";
import Tab from "./Components/Tab";

export default function MoviePage() {
  const [detailedInfo, setDetailedInfo] = useState<DetailedFilmInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Details");
  const { id } = useParams();

  const Tabs = [
    {
      tabName: "Description",
      tabContent: {
        plot: detailedInfo?.plot,
      },
    },
    {
      tabName: "Details",
      tabContent: {
        year: detailedInfo?.year,
        director: detailedInfo?.director,
        casts: detailedInfo?.casts,
        countries: detailedInfo?.countries,
        genres: detailedInfo?.genres,
        languages: detailedInfo?.languages,
        original_title: detailedInfo?.original_title,
        runtime: detailedInfo?.runtime,
      },
    },
  ];

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
      <div className="container md:w-1/2 relative">
        <img
          src={`https://image.tmdb.org/t/p/original${detailedInfo?.backdrop}`}
        ></img>
        <div className="bg-linear-to-t from-black to-transparent absolute w-full h-20 2xl:h-40 -bottom-2 lg:bottom-0"></div>

        <div className="absolute top-[80%] px-3 flex flex-col gap-1">
          <div className="font-extrabold text-4xl ">{detailedInfo?.title}</div>
          <div className="font-bold text-lg">{detailedInfo?.director}</div>
          <div className="font-light text-sm flex gap-5 text-gray-300">
            <span>{detailedInfo?.runtime}min</span>
            <span>{detailedInfo?.languages}</span>
          </div>
        </div>
      </div>
      <div className="grid w-1/2 grid-cols-3 2xl:mt-5 md:mt-12">
        
        <Tab tabs={Tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        <div className="Showtime bg-amber-400 col-span-1">Showtime</div>
      </div>
    </div>
  );
}
