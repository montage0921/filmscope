import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { EditShowDto } from "../types";
import axios from "axios";
import EditShowForm from "./EditShowForm";

export default function ShowEditPage() {
  const { film_id } = useParams();
  const [shows, setShows] = useState<EditShowDto[]>([]);
  const [selectedShowId, setSelectedShowId] = useState<number>();
  const [selectedTab, setSelectedTab] = useState<String>("edit");
  const [curShow, setCurShow] = useState<EditShowDto | null>(null);

  useEffect(function () {
    async function getShows() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/films/${film_id}/shows`,
        );
        console.log(res);
        setShows(res.data);
        if (res.data.length > 0) {
          setSelectedShowId(res.data[0].show_id);
        }
      } catch (error) {
        alert(error);
      }
    }

    getShows();
  }, []);

  useEffect(() => {
    if (selectedTab === "edit") {
      const found = shows.find((s) => s.show_id === selectedShowId);
      setCurShow(found || null);
    } else {
      setCurShow(null);
    }
  }, [selectedShowId, shows, selectedTab]);

  return (
    <div
      className="absolute top-20 left-1/2 -translate-x-1/2 
             w-[95%] md:w-[80%] 
             flex flex-col items-center justify-start gap-8 
             pb-20 /* 给底部留点空间，防止滑到底部被挡住 */"
    >
      <div className="flex items-end justify-start gap-8 w-full border-b border-gray-700">
        <div
          className="pb-2 transition-all duration-300"
          style={{
            borderBottom:
              selectedTab === "edit"
                ? "4px solid #ab76f5"
                : "4px solid transparent",
          }}
        >
          <select
            className="bg-transparent outline-none cursor-pointer font-bold"
            style={{ color: selectedTab === "edit" ? "#ab76f5" : "#9ca3af" }}
            value={selectedShowId}
            onChange={(e) => {
              setSelectedShowId(Number(e.target.value));
              setSelectedTab("edit");
            }}
            onClick={() => setSelectedTab("edit")}
          >
            {shows.map((s) => (
              <option key={s.show_id} value={s.show_id} className="text-black">
                {s.show_name} at {s.theatreDto.name}
              </option>
            ))}
          </select>
        </div>

        <div
          onClick={() => setSelectedTab("add")}
          className="pb-2 cursor-pointer transition-all duration-300 font-bold text-[15px] lg:text-base"
          style={{
            borderBottom:
              selectedTab === "add"
                ? "4px solid #ab76f5"
                : "4px solid transparent",
            color: selectedTab === "add" ? "#ab76f5" : "#9ca3af",
          }}
        >
          Add New Show
        </div>
      </div>

      <div className="w-full flex flex-col items-start">
        {selectedTab === "edit" && <EditShowForm curShow={curShow} curTab="edit" />}
        {selectedTab === "add" && <EditShowForm curShow={null} curTab="add" />}
      </div>
    </div>
  );
}
