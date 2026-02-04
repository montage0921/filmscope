import { type LucideIcon } from "lucide-react";
import { useState } from "react";

interface HoverLabelProps {
  icon: LucideIcon;
  iconSize: number;
  content: string;
}

export default function HoverLabel({
  icon: Icon,
  iconSize,
  content,
}: HoverLabelProps) {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className="relative hover:text-amber-400 hover:cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Icon size={iconSize} />

      <div
        className={`absolute -right-6 p-1 text-[10px] bg-amber-400 text-black flex whitespace-nowrap transition-opacity duration-300 ease-in-out
          ${isHover ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        {content}
      </div>
    </div>
  );
}
