import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { EditShowDto } from "../types";
import axios from "axios";
import EditShowForm from "./EditShowForm";
import useWindowSize from "../hooks/useWindowSize";

export default function ShowEditPage() {
  const { film_id } = useParams();
  const [shows, setShows] = useState<EditShowDto[]>([]);
  const [selectedShowId, setSelectedShowId] = useState<number>();
  const [selectedTab, setSelectedTab] = useState<String>("edit");
  const [curShow, setCurShow] = useState<EditShowDto | null>(null);

  const windowWidth = useWindowSize();

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
             pb-20"
    >
      {windowWidth <= 640 && (
        <div className="w-full">
          <select
            className="w-full p-3 bg-gray-800 text-white rounded-lg border-2 border-[#ab76f5] outline-none font-bold"
            value={selectedTab === "add" ? "add" : selectedShowId}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "add") {
                setSelectedTab("add");
              } else {
                setSelectedTab("edit");
                setSelectedShowId(Number(val));
              }
            }}
          >
            <optgroup label="Edit Existing Show" className="text-black">
              {shows.map((s) => (
                <option key={s.show_id} value={s.show_id}>
                  {s.show_name} at {s.theatreDto.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Actions" className="text-black">
              <option value="add">Add New Show</option>
            </optgroup>
          </select>
        </div>
      )}
      {windowWidth > 640 && (
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
                <option
                  key={s.show_id}
                  value={s.show_id}
                  className="text-black"
                >
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
      )}

      <div className="w-full flex flex-col items-start">
        {selectedTab === "edit" && (
          <EditShowForm curShow={curShow} curTab="edit" film_id={film_id} />
        )}
        {selectedTab === "add" && <EditShowForm curShow={null} curTab="add" film_id={film_id}/>}
      </div>
    </div>
  );
}
