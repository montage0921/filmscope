import { useState } from "react";
import type { Constraint } from "../../../types";
import { number } from "motion";

export function useYearField(initial: string) {
  // Constraints
  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Year is required",
      valid: initial.length > 0,
    },
    {
      id: "isnumber",
      message: "Must be a 4-digit year",
      valid: /^\d{4}$/.test(initial),
    },
    {
      id: "minYear",
      message: "Must be greater than or equal to 1880",
      valid: initial !== "" && Number(initial) >= 1880
    },
  ];

  // State
  const [year, setYear] = useState(initial);
  const [yearConstraints, setYearConstraints] = useState(initialConstraints);
  const [allYearConstraintsGood, setAllYearConstraintsGood] = useState(
     initialConstraints.every((constraint) => constraint.valid === true)
  );

  // Handle Field Change
  function handleYear(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setYear(value);

    const copy = yearConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      if (constraint.id === "isnumber") {
        // Specifically checks for exactly 4 digits
        return { ...constraint, valid: /^\d{4}$/.test(value) };
      }
      if (constraint.id === "minYear") {
        // Specifically checks for exactly 4 digits
        return { ...constraint, valid: initial !== "" && Number(value) >= 1880 };
      }
      return constraint;
    });

    setYearConstraints(copy);

    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllYearConstraintsGood(allGood);
  }

  return {
    year,
    yearConstraints,
    allYearConstraintsGood,
    handleYear,
  };
}