import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import type { Screening } from "../../types";
import {  Heart, Pencil,  Trash2 } from "lucide-react";

interface ScreeningCardProp {
  screen: Screening;
  theatre: string;
}

export default function ScreeningCard({ screen, theatre }: ScreeningCardProp) {
  const { is_admin } = useAuth();
  const rawTime = screen.start_time;
  const date = new Date(`1970-01-01T${rawTime}`);

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  async function handleDelete(e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const screening_id = screen.screening_id;
    console.log(screening_id)
    return
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
          <Pencil />
        </div>
      ) : (
        <div>
          <Heart />
        </div>
      )}
    </a>
  );
}
