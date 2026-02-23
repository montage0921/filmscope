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
    <div>
      <div>
        <div className="flex gap-3">
          <select
            value={selectedShowId}
            onChange={(e) => setSelectedShowId(Number(e.target.value))}
            onClick={() => setSelectedTab("edit")}
          >
            {shows.map((s) => (
              <option key={s.show_id} value={s.show_id}>
                {s.show_name} at {s.theatreDto.name}
              </option>
            ))}
          </select>
          <div onClick={() => setSelectedTab("add")}>Add New Show</div>
        </div>
        {selectedTab === "edit" && (
          <EditShowForm
            curShow={curShow}
          />
        )}
        {selectedTab === "add" && (
          <EditShowForm
            curShow={null}

          />
        )}
      </div>
    </div>
  );
}
