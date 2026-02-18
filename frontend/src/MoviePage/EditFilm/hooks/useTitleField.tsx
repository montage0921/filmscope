import { useState } from "react";
import type { Constraint } from "../../../types";

export function useTitleField(initial:string) {
  //Constraints
  const initialTitleConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Can't be empty",
      valid: initial.length > 0,
    },
  ];

  // State
  // UserName
  const [title, setTitle] = useState(initial);
  const [titleConstraints, setTitleConstraints] = useState(
    initialTitleConstraints,
  );
  const [allTitleConstraintsGood, setAllTitleConstraintsGood] = useState(initialTitleConstraints.every((constraint)=>constraint.valid === true));

  // Handle Field Change
  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTitle(value);

    const copy = titleConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: e.target.value.length > 0 };
      }
      return constraint;
    });

    setTitleConstraints(copy);

    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllTitleConstraintsGood(allGood);
  }

  return {
    title,
    titleConstraints,
    allTitleConstraintsGood,
    handleTitle,
  };
}
