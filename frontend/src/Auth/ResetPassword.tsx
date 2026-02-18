import React, { useEffect, useState } from "react";
import { usePasswordField } from "../hooks/usePasswordField";
import { useConfirmPasswordField } from "../hooks/useConfirmPasswordField";
import LoadingDots from "../Utility/LoadingDots";
import Input from "./Input";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [email, setEmail] = useState("");
  const [successMessage, setSucessMessage] = useState("")

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(function () {
    const getMaskedEmail = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/reset-info`,
        { params: { token: token }, validateStatus: () => true }, // <- IMPORTANT: never throw
      );

      if (res.status === 200) setEmail(res.data.maskedEmail);
      else setLoginError(res.data.errorMessage)
    };

    getMaskedEmail();
  }, []);

  const {
    password,
    passwordConstraints,
    allPasswordConstraintsGood,
    handlePassword,
  } = usePasswordField();

  const {
    confirmedPwd,
    confirmedPwdConstraints,
    allConfirmedPwdConstraintsGood,
    handleConfirmedPwd,
  } = useConfirmPasswordField(password);

  async function handleReset(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");
    setSucessMessage("")
    if (!allPasswordConstraintsGood || !allConfirmedPwdConstraintsGood) return;

    setIsloading(true)
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/reset`,
      { token, password },
      { validateStatus: () => true }, // <- IMPORTANT: never throw
    );

    if (res.status === 202) {
      setSucessMessage(res.data)
    }else{
      setLoginError(res.data.errorMessage)
    }

    setIsloading(false)
  }

  return (
    <div className=" fixed inset-0 flex justify-center items-center">
      <div className=" bg-[#292929] w-[70%] md:w-[30%] 2xl:w-[20%] py-3 px-3 rounded-sm flex flex-col gap-2">
        <p className="font-bold text-xl self-center">Reset Your Password</p>
        {email && <p className="text-sm text-gray-300">Reset password for: {email}</p>}
        {loginError && <p className="text-sm text-red-400">{loginError}</p>}
        {successMessage &&  <p className="text-sm text-green-400">{successMessage}</p>}
        {isLoading && <LoadingDots />}
        <form className="flex flex-col gap-3" onSubmit={handleReset}>
          <Input
            id={"password"}
            labelText="Password"
            onChange={handlePassword}
            inputValue={password}
            constraints={passwordConstraints}
            allConstraintsGood={allPasswordConstraintsGood}
            inputType="password"
          />
          <Input
            id={"confirmedPassword"}
            labelText="Confirm Your Password"
            onChange={handleConfirmedPwd}
            inputValue={confirmedPwd}
            constraints={confirmedPwdConstraints}
            allConstraintsGood={allConfirmedPwdConstraintsGood}
            inputType="password"
          />
          <button
            className="bg-[#ab76f5] rounded-sm text-sm font-semibold h-7 cursor-pointer"
            type="submit"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
