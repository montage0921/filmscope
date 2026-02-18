import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import SignUpVerification from "./SignUpVerification";
import ForgetPasswordForm from "./ForgetPasswordForm";

export default function LoginOverlay() {
  const [curForm, setCurForm] = useState("login")
  return (
    <div className=" fixed inset-0 flex justify-center items-center z-50">
      {curForm === "login" && <LoginForm setForm={setCurForm}/>}
      {curForm === "signup" && <SignUpForm setForm={setCurForm}/>}
      {curForm === "verify" && <SignUpVerification setForm={setCurForm}/>}
      {curForm === "forget" && <ForgetPasswordForm setForm = {setCurForm}/>}
    </div>
  )
}
