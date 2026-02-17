import { CircleCheck } from "lucide-react";

type SignUpVerificationProps = {
  setForm: React.Dispatch<React.SetStateAction<string>>;
};

export default function SignUpVerification({
  setForm,
}: SignUpVerificationProps) {
  return (
    <div className=" bg-[#292929] w-[70%] md:w-[30%] 2xl:w-[20%] py-3 px-3 rounded-sm flex flex-col gap-2 justify-center items-center">
      <CircleCheck color="green" size={40}/>
      <p className="text-[12px] text-center">A verification email has been sent to your email. Please click the link to activate your account.</p>
      <div className="text-sm font-semibold">
        Already Verified? <span className="text-[#ab76f5] cursor-pointer" onClick={() => setForm("login")}>Sign in!</span>
      </div>
    </div>
  );
}
