import { useState } from "react";
import type { Constraint } from "../../../types";

export function useDirectorField(initial:string) {
  // Constraints
  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Director name can't be empty",
      valid: initial.length > 0,
    },
  ];

  // State
  const [director, setDirector] = useState(initial);
  const [directorConstraints, setDirectorConstraints] = useState(initialConstraints);
  const [allDirectorConstraintsGood, setAllDirectorConstraintsGood] = useState(initialConstraints.every((constraint) => constraint.valid === true));

  // Handle Field Change
  function handleDirector(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDirector(value);

    const copy = directorConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      return constraint;
    });

    setDirectorConstraints(copy);

    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllDirectorConstraintsGood(allGood);
  }

  return {
    director,
    directorConstraints,
    allDirectorConstraintsGood,
    handleDirector,
  };
}