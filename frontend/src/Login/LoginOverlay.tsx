import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import SignUpVerification from "./SignUpVerification";

export default function LoginOverlay() {
  const [curForm, setCurForm] = useState("login")
  return (
    <div className=" fixed inset-0 flex justify-center items-center">
      {curForm === "login" && <LoginForm setForm={setCurForm}/>}
      {curForm === "signup" && <SignUpForm setForm={setCurForm}/>}
      {curForm === "verify" && <SignUpVerification setForm={setCurForm}/>}
    </div>
  )
}
