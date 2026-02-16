import Input from "./Input";
import { useEmailField } from "../hooks/useEmailField";
import { useUserNameField } from "../hooks/useUsernameField";
import { usePasswordField } from "../hooks/usePasswordField";

export default function LoginForm() {
  
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

  return (
    <div className=" bg-[#292929] w-[70%] md:w-[20%] py-3 px-3 rounded-sm flex flex-col gap-2">
      <p className="font-bold text-xl self-center">Sign In</p>
      <form className="flex flex-col gap-3">
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
      </form>
    </div>
  );
}
