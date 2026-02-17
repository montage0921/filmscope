import { useState } from "react";
import type { Constraint } from "../types";

export function useEmailField() {
  //Constraints
  const initialEmailConstraints: Constraint[] = [
    {
      id: "emailFormat",
      message: "Please enter a valid email address",
      valid: false,
    },
  ];

  // Email State
  const [email, setEmail] = useState("");
  const [emailConstraints, setEmailConstraints] = useState(
    initialEmailConstraints,
  );
  const [allEmailConstraintsGood, setAllEmailConstraintsGood] = useState(false);

  // Handle Email Field Change
  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    const copy = emailConstraints.map((constraint) => {
      if (constraint.id === "emailFormat") {
        return {
          ...constraint,
          valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        };
      }

      return constraint;
    });

    setEmailConstraints(copy);
    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllEmailConstraintsGood(allGood);
  }

  return{
    email,
    emailConstraints,
    allEmailConstraintsGood,
    handleEmail
  }
}
