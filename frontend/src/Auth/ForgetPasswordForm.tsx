import { useState } from "react";
import { useEmailField } from "../hooks/useEmailField";
import Input from "./Input";
import axios from "axios";

type ForgetPasswordFormProps = {
  setForm: React.Dispatch<React.SetStateAction<string>>;
};
export default function ForgetPasswordForm({
  setForm,
}: ForgetPasswordFormProps) {
  const [loginError, setLoginError] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");
  const { email, emailConstraints, allEmailConstraintsGood, handleEmail } =
    useEmailField();

  async function handleReset(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");

    if (!allEmailConstraintsGood) return;
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/forgetpassword`,
      null,
      {
        params: { email: email },
        validateStatus: () => true,
      }, // <- IMPORTANT: never throw
    );

    if (res.status === 404 || res.status === 401) {
      setLoginError(res.data.errorMessage);
      return;
    }

    setSucessMessage(res.data);
  }

  return (
    <div className=" bg-[#292929] w-[70%] md:w-[30%] 2xl:w-[20%] py-3 px-3 rounded-sm flex flex-col gap-2">
      <p className="font-bold text-xl self-center">Reset Password</p>
      {loginError && <p className="text-sm text-red-400">{loginError}</p>}
      {sucessMessage && (
        <p className="text-sm text-green-400">{sucessMessage}</p>
      )}
      <form className="flex flex-col gap-3" onSubmit={handleReset}>
        <Input
          id={"email"}
          labelText="Email"
          onChange={handleEmail}
          inputValue={email}
          constraints={emailConstraints}
          allConstraintsGood={allEmailConstraintsGood}
          inputType="email"
        />
        <button
          className="bg-[#ab76f5] rounded-sm text-sm font-semibold h-7 cursor-pointer"
          type="submit"
        >
          Send Reset Link
        </button>
      </form>
      <div className="mt-2 flex justify-between text-[#ab76f5] text-sm font-semibold">
        <div onClick={() => setForm("signup")} className="cursor-pointer">
          Sign Up
        </div>
        <div onClick={() => setForm("login")} className="cursor-pointer">
          Sign In
        </div>
      </div>
    </div>
  );
}
