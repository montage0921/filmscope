import { useState } from "react";
import type { Constraint } from "../types";

export function useUserNameField() {
  //Constraints
  const initialUsernameConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Can't be empty",
      valid: false,
    },
    {
      id: "length",
      message: "Must be at least 8 characters long",
      valid: false,
    },
  ];

  // State
  // UserName
  const [username, setUsername] = useState("");
  const [usernameConstraints, setUserNameConstraints] = useState(
    initialUsernameConstraints,
  );
  const [allUsernameConstraintsGood, setAllUsernameConstraintsGood] =
    useState(false);

  // Handle Field Change
  function handleUserName(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsername(value);

    const copy = usernameConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: e.target.value.length > 0 };
      }
      if (constraint.id === "length") {
        return { ...constraint, valid: e.target.value.length >= 8 };
      }
      return constraint;
    });

    setUserNameConstraints(copy);

    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllUsernameConstraintsGood(allGood);
  }

  return {
    username,
    usernameConstraints,
    allUsernameConstraintsGood,
    handleUserName,
  };
}
