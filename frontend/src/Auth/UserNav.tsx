import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export default function UserNav() {
  const { user, logout } = useAuth();
  const [isClick, setIsClick] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  // close the profile menu when click out side
  useEffect(function () {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsClick(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative bg-[#ab76f5] w-8 h-8 flex justify-center items-center rounded-full text-white font-bold cursor-pointer"
      onClick={() => setIsClick(!isClick)}
    >
      {user?.username.slice(0, 1)}
      {isClick && (
        <div className="absolute top-full   bg-[#292929] w-32 flex flex-col items-center text-[10px] font-light p-1">
          <div>{`Welcome, ${user?.username}`}</div>
          <div>
            Status:{" "}
            {user?.authorities.includes("ROLE_ADMIN")
              ? "ROLE_ADMIN"
              : "ROLE_USER"}
          </div>
          <div className="flex gap-1" onClick={logout}>
            {" "}
            <LogOut size={13} /> <span>Log Out</span>{" "}
          </div>
        </div>
      )}
    </div>
  );
}
