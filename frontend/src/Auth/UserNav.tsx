import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export default function UserNav() {
  const { user, logout } = useAuth();

  const [isClick, setIsClick] = useState(false);
  return (
    <div
      className="relative bg-[#ab76f5] w-8 h-8 flex justify-center items-center rounded-full text-white font-bold cursor-pointer"
      onClick={() => setIsClick(!isClick)}
    >
      {user?.username.slice(0, 1)}
      {isClick && (
        <div className="absolute -bottom-14  bg-[#292929] w-30 flex flex-col items-center text-[10px] font-light p-1">
          <div>{`Welcome, ${user?.username}`}</div>
          <div>Status: {user?.authorities}</div>
          <div className="flex gap-1" onClick={logout}>
            {" "}
            <LogOut size={13} /> <span>Log Out</span>{" "}
          </div>
        </div>
      )}
    </div>
  );
}
