import { useState } from "react";
import type { Constraint } from "../../../types";

export function useCastsField(initial:string) {
  // Constraints
  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Casts list can't be empty",
      valid: initial.length > 0,
    },
    {
      id: "format",
      message: "Please separate names with slash /",
      valid: true, // Optional soft validation
    }
  ];

  // State
  const [casts, setCasts] = useState(initial);
  const [castsConstraints, setCastsConstraints] = useState(initialConstraints);
  const [allCastsConstraintsGood, setAllCastsConstraintsGood] = useState(initialConstraints.every((constraint) => constraint.valid === true));

  // Handle Field Change
  function handleCasts(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setCasts(value);

    const copy = castsConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      return constraint;
    });

    setCastsConstraints(copy);

    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllCastsConstraintsGood(allGood);
  }

  return {
    casts,
    castsConstraints,
    allCastsConstraintsGood,
    handleCasts,
  };
}