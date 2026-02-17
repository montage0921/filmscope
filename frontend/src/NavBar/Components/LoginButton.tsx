import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserNav from "../../Auth/UserNav";

export default function LoginButton() {
  const { user } = useAuth();
  return (
    <>
      {" "}
      {user ? (
        <UserNav />
      ) : (
        <Link
          className="bg-[#ab76f5] text-sm  p-1 rounded-md cursor-pointer"
          to={"/login"}
        >
          Log in
        </Link>
      )}
    </>
  );
}
