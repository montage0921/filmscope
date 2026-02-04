import type { Screening } from "../../types";
import { Heart} from "lucide-react";

interface ScreeningCardProp {
  screen: Screening;
  theatre: string;
}

export default function ScreeningCard({ screen, theatre }: ScreeningCardProp) {
  const rawTime = screen.start_time;
  const date = new Date(`1970-01-01T${rawTime}`);

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

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
      <div>
        <Heart />
      </div>
    </a>
  );
}
