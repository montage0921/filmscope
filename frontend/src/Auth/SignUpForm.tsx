import Input from "./Input";
import { useEmailField } from "../hooks/useEmailField";
import { usePasswordField } from "../hooks/usePasswordField";
import axios from "axios";
import { useState } from "react";
import { useUserNameField } from "../hooks/useUsernameField";
import { useConfirmPasswordField } from "../hooks/useConfirmPasswordField";
import LoadingDots from "../Utility/LoadingDots";

type SignUpFormProps = {
  setForm: React.Dispatch<React.SetStateAction<string>>;
};

export default function SignUpForm({ setForm }: SignUpFormProps) {
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsloading] = useState(false)

  const {
    username,
    usernameConstraints,
    allUsernameConstraintsGood,
    handleUserName,
  } = useUserNameField();

  const { email, emailConstraints, allEmailConstraintsGood, handleEmail } =
    useEmailField();

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

  async function handleSignUp(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError('')
    if (!allUsernameConstraintsGood || !allEmailConstraintsGood || !allPasswordConstraintsGood || !allConfirmedPwdConstraintsGood) return;

    setIsloading(true)
    const res = await axios.post(
       `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/register`,
      { username, email, password },
      { validateStatus: () => true }, // <- IMPORTANT: never throw
    );

    if (res.status === 409) {
      setLoginError(res.data);
      setIsloading(false)
      return;
    }

    setIsloading(false)
    setForm("verify")
  }

  return (
    <div className=" bg-[#292929] w-[70%] md:w-[30%] 2xl:w-[20%] py-3 px-3 rounded-sm flex flex-col gap-2">
      <p className="font-bold text-xl self-center">Sign Up</p>
      {loginError && <p className="text-sm text-red-400">{loginError}</p>}
      {isLoading && <LoadingDots/>}
      <form className="flex flex-col gap-3" onSubmit={handleSignUp}>
        <Input
          id={"username"}
          labelText="Username"
          onChange={handleUserName}
          inputValue={username}
          constraints={usernameConstraints}
          allConstraintsGood={allUsernameConstraintsGood}
        />
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
          Sign Up
        </button>
      </form>
      <div className="mt-2 flex justify-between text-[#ab76f5] text-sm font-semibold">
        <div onClick={() => setForm("login")} className="cursor-pointer">
          Sign In
        </div>
        <div onClick={() => setForm("forget")} className="cursor-pointer">
          Forget Password
        </div>
      </div>
    </div>
  );
}
