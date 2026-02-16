import LoginForm from "./LoginForm";

export default function LoginOverlay() {
  return (
    <div className=" fixed inset-0 flex justify-center items-center">
      <LoginForm/>
    </div>
  )
}
