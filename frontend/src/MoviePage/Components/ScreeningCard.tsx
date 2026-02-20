import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import type { Screening } from "../../types";
import { Heart, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

interface ScreeningCardProp {
  screen: Screening;
  theatre: string;
  screening_date: string;
}

export default function ScreeningCard({
  screen,
  theatre,
  screening_date,
}: ScreeningCardProp) {
  const { is_admin } = useAuth();
  const rawTime = screen.start_time;
  const date = new Date(`1970-01-01T${rawTime}`);
  const [isEdit, setIsEdit] = useState(false);
  const [screeningDate, setScreeningDate] = useState<string>(screening_date);
  const [screeningTime, setScreeningTime] = useState<string>(screen.start_time);
  const [url, setUrl] = useState<string>(screen.ticket_url);
  const [screeningTheatre, setScreeningTheatre] = useState<string>(theatre);

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  async function handleDelete(e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const screening_id = screen.screening_id;

    if (!screening_id) {
      alert("Not a valid screening");
      return;
    }

    const JWT = localStorage.getItem("token");
    if (!JWT) {
      alert("no JWT token");
      return;
    }
    const config = {
      headers: { Authorization: `Bearer ${JWT}` },
      validateStatus: () => true,
    };

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/screenings/${screening_id}`,
        config,
      );
      if (res.status >= 200 && res.status < 300) {
        alert("Screening deleted successfully!");
        window.location.reload();
      } else {
        alert(`Delete failed: ${res.status}`);
      }
    } catch (error) {
      console.error("Delete request error:", error);
      alert("An error occurred while deleting.");
    }
  }

  if (isEdit)
    return (
      <div
        className="bg-[#292929] w-[90%] p-2 flex justify-between rounded-sm 
        items-center hover:text-white hover:cursor-pointer flex-col"
      >
        <div className="flex flex-col items-start">
          <input type="date" value={screeningDate} onChange={(e)=>setScreeningDate(e.target.value)}/>
          <input type="time" className="font-semibold text-lg" value={screeningTime} 
          onChange={(e)=>setScreeningTime(e.target.value)}/>
           <input  className="font-semibold text-lg" value={screeningTheatre} 
          onChange={(e)=>setScreeningTime(e.target.value)}/>
           <input  className="font-semibold text-lg" value={url} 
          onChange={(e)=>setScreeningTime(e.target.value)}/>
        </div>
                <div className="flex gap-3">
          <button
            className="bg-[#ab76f5]  text-sm  font-semibold p-1 rounded-md cursor-pointer"
          >
            Submit
          </button>
          <button
            className="bg-red-400  text-sm  font-semibold p-1 rounded-md cursor-pointer"
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );

  return (
    <a
      className="bg-[#292929] w-[90%] p-2 flex justify-between rounded-sm items-center hover:text-white hover:cursor-pointer"
      href={screen.ticket_url}
      target="_blank" // open in new tab
      rel="noopener noreferrer" // prevent new tab fetch current page's Window object
    >
      <div className="flex flex-col">
        <span className="self-start font-semibold text-lg">
          {formattedTime}
        </span>
        <span className="self-start text-[10px]">{theatre}</span>
      </div>
      {is_admin ? (
        <div className="flex gap-3">
          <Heart />
          <Trash2 onClick={(e) => handleDelete(e)} />
          <Pencil
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsEdit(true);
            }}
          />
        </div>
      ) : (
        <div>
          <Heart />
        </div>
      )}
    </a>
  );
}
