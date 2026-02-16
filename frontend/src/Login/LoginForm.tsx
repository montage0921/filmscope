import Input from "./Input";
import { useEmailField } from "../hooks/useEmailField";
import { usePasswordField } from "../hooks/usePasswordField";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserNameField } from "../hooks/useUsernameField";

type LoginFormProp = {
  setForm:React.Dispatch<React.SetStateAction<string>>;
}

export default function LoginForm({setForm}:LoginFormProp) {
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const { email, emailConstraints, allEmailConstraintsGood, handleEmail } =
    useEmailField();

  const {
    password,
    passwordConstraints,
    allPasswordConstraintsGood,
    handlePassword,
  } = usePasswordField();

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allEmailConstraintsGood || !allPasswordConstraintsGood) return;

    const res = await axios.post(
      "http://192.168.1.231:8080/filmscope/api/auth/login",
      { email, password },
      { validateStatus: () => true }, // <- IMPORTANT: never throw
    );

    if (res.status === 404 || res.status === 401 || res.status === 403) {
      setLoginError(res.data);
      return;
    }

    const token = res.data;
    localStorage.setItem("token", token);
    navigate("/")
  }

  return (
    <div className=" bg-[#292929] w-[70%] md:w-[30%] 2xl:w-[20%] py-3 px-3 rounded-sm flex flex-col gap-2">
      <p className="font-bold text-xl self-center">Sign In</p>
      {loginError && <p className="text-sm text-red-400">{loginError}</p>}
      <form className="flex flex-col gap-3" onSubmit={handleLogin}>

        <Input
          id={"email"}
          labelText="Email"
          onChange={handleEmail}
          inputValue={email}
          constraints={emailConstraints}
          allConstraintsGood={allEmailConstraintsGood}
          inputType="email"
        />
        <Input
          id={"password"}
          labelText="Password"
          onChange={handlePassword}
          inputValue={password}
          constraints={passwordConstraints}
          allConstraintsGood={allPasswordConstraintsGood}
          inputType="password"
        />
        <button
          className="bg-[#ab76f5] rounded-sm text-sm font-semibold h-7 cursor-pointer"
          type="submit"
        >
          Log in
        </button>
      </form>
      <div className="mt-2 flex justify-between text-[#ab76f5] text-sm font-semibold">
        <div onClick={()=>setForm("signup")} className="cursor-pointer">Sign Up</div>
        <div onClick={()=>setForm("forget")} className="cursor-pointer">Forget Password</div>
      </div>
    </div>
  );
}
