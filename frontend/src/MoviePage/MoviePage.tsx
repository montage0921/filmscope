import { useParams } from "react-router-dom";
import { type DetailedFilmInfo } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingDots from "../Utility/LoadingDots";
import Tab from "./Components/Tab";
import defaultPic from "../assets/default_film_pic.jpg";
import Showtime from "./Components/Showtime";
import useWindowSize from "../hooks/useWindowSize";

export default function MoviePage() {
  const [detailedInfo, setDetailedInfo] = useState<DetailedFilmInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Details");
  const { id } = useParams();

  const windowSize = useWindowSize();
  const mdThreshold = 768;

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
    {
      tabName: "Showtimes",
      tabContent: {},
    },
  ];

  async function fetchDetailedMovieINfo() {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/films/${id}`,
      );
      setDetailedInfo(res.data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  useEffect(function () {
    fetchDetailedMovieINfo();
  }, []);

  if (isLoading)
    return (
      <div className="min-h-dvh flex justify-center items-center bg-black">
        <LoadingDots />
      </div>
    );

  return (
    /* Use min-h-dvh to prevent iPhone browser UI from cutting off the bottom */
    <div className="bg-black min-h-dvh flex flex-col items-center text-white pb-10">
      {/* Poster Section */}
      <div className="container w-full md:w-1/2 relative">
        <img
          className="w-full object-cover"
          src={
            detailedInfo?.backdrop
              ? `https://image.tmdb.org/t/p/original${detailedInfo?.backdrop}`
              : defaultPic
          }
          alt={detailedInfo?.title}
        />
        {/* Gradient Overlay */}
        <div className="bg-linear-to-t from-black to-transparent absolute w-full h-20 2xl:h-40 -bottom-1"></div>

        {/* Title and Director Overlay */}
        <div className="absolute top-[75%] px-3 flex flex-col gap-1">
          <div className="font-extrabold text-3xl md:text-4xl">
            {detailedInfo?.title}
          </div>
          <div className="font-bold text-lg">{detailedInfo?.director}</div>
          <div className="font-light text-sm flex gap-5 text-gray-300">
            <span>{detailedInfo?.runtime}min</span>
            <span>{detailedInfo?.languages}</span>
          </div>
        </div>
      </div>

      <div className="md:hidden w-11/12 mt-12 px-3">
        <select
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
          className="w-full bg-zinc-900 text-white p-3 rounded-lg border border-[#ab76f5] outline-none"
        >
          {Tabs.map((tab) => (
            <option key={tab.tabName} value={tab.tabName}>
              {tab.tabName}
            </option>
          ))}
        </select>
      </div>

      {/* Tab Section */}
      <div className="w-full px-4 md:w-1/2 mt-5 md:mt-1">
        {/* Layout Container: Stacked on mobile, Grid on desktop */}
        <div className="md:grid md:grid-cols-3 gap-6">
          {(selectedTab !== "Showtimes" || windowSize >= mdThreshold) && <div className="md:col-span-2">
            <Tab
              tabs={Tabs}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>}

          {(selectedTab === "Showtimes" || windowSize >= mdThreshold) && (
            <div className="md:col-span-1">
              <Showtime
                showInfo={detailedInfo?.showInfoByDate?.show_info || {}}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
