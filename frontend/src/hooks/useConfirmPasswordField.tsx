import { useState } from "react";
import type { Constraint } from "../types";

export function useConfirmPasswordField(password:string) {
  const initialConfirmedPwdConstraints: Constraint[] = [
    {
      id: "notmatch",
      message: "Please match your password",
      valid: false,
    },

  ];

  const [confirmedPwd, setConfirmedPwd] = useState("");
  const [confirmedPwdConstraints, setConfirmedPwdConstraints] = useState(
    initialConfirmedPwdConstraints,
  );
  const [allConfirmedPwdConstraintsGood, setAllConfirmedPwdConstraintsGood] =
    useState(false);

  function handleConfirmedPwd(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setConfirmedPwd(value);
    const copy = confirmedPwdConstraints.map((constraint) => {
      if (constraint.id === "notmatch") {
        return { ...constraint, valid: e.target.value === password };
      }
      return constraint;
    });

    setConfirmedPwdConstraints(copy);
    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllConfirmedPwdConstraintsGood(allGood);
  }

  return {
    confirmedPwd,
    confirmedPwdConstraints,
    allConfirmedPwdConstraintsGood,
    handleConfirmedPwd,
  };
}
