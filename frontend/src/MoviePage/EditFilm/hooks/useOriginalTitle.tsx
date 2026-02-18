import { useState } from "react";
import type { Constraint } from "../../../types";

export function useOriginalTitleField(initial: string) {
  // Constraints
  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Original title can't be empty",
      valid: initial.length > 0,
    },
  ];

  // State
  const [originalTitle, setOriginalTitle] = useState(initial);
  const [originalTitleConstraints, setOriginalTitleConstraints] =
    useState(initialConstraints);
  const [allOriginalTitleConstraintsGood, setAllOriginalTitleConstraintsGood] =
    useState(
      initialConstraints.every((constraint) => constraint.valid === true),
    );

  // Handle Field Change
  function handleOriginalTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setOriginalTitle(value);

    const copy = originalTitleConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        // We use trim() here to ensure they don't just enter spaces
        return { ...constraint, valid: value.trim().length > 0 };
      }
      return constraint;
    });

    setOriginalTitleConstraints(copy);

    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllOriginalTitleConstraintsGood(allGood);
  }

  return {
    originalTitle,
    originalTitleConstraints,
    allOriginalTitleConstraintsGood,
    handleOriginalTitle,
  };
}
