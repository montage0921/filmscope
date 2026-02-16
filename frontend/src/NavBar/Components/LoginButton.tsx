import { Link } from "react-router-dom";


export default function LoginButton() {
  return (
    <Link className='bg-[#ab76f5] text-sm  p-1 rounded-md cursor-pointer'
    to={"/login"}>
      Log in
    </Link>
  )
}
