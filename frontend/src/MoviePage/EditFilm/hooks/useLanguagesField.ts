import { useState } from "react";
import type { Constraint } from "../../../types";

export function useLanguagesField(initial: string) {
  // Pre-calculate initial validity
  const isInitialNotEmpty = initial.trim().length > 0;
  const isInitialFormatValid = !initial.includes(",");

  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Language can't be empty",
      valid: isInitialNotEmpty,
    },
    {
      id: "format",
      message: "Please separate languages with slash /",
      valid: isInitialFormatValid,
    },
  ];

  const [languages, setLanguages] = useState(initial);
  const [languagesConstraints, setLanguagesConstraints] = useState(initialConstraints);
  const [allLanguagesConstraintsGood, setAllLanguagesConstraintsGood] = useState(
    isInitialNotEmpty && isInitialFormatValid
  );

  function handleLanguages(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setLanguages(value);

    const copy = languagesConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      if (constraint.id === "format") {
        // Enforce slash usage by marking commas as invalid
        return { ...constraint, valid: !value.includes(",") };
      }
      return constraint;
    });

    setLanguagesConstraints(copy);
    setAllLanguagesConstraintsGood(copy.every((c) => c.valid));
  }

  return {
    languages,
    languagesConstraints,
    allLanguagesConstraintsGood,
    handleLanguages,
  };
}