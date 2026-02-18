import { useState } from "react";
import type { Constraint } from "../../../types";

export function useCountriesField(initial: string) {
  // Pre-calculate initial validity
  const isInitialNotEmpty = initial.trim().length > 0;
  const isInitialFormatValid = !initial.includes(",");

  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Country can't be empty",
      valid: isInitialNotEmpty,
    },
    {
      id: "format",
      message: "Please separate countries with slash /",
      valid: isInitialFormatValid,
    },
  ];

  const [countries, setCountries] = useState(initial);
  const [countriesConstraints, setCountriesConstraints] = useState(initialConstraints);
  const [allCountriesConstraintsGood, setAllCountriesConstraintsGood] = useState(
    isInitialNotEmpty && isInitialFormatValid
  );

  function handleCountries(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setCountries(value);

    const copy = countriesConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      if (constraint.id === "format") {
        // Valid if it doesn't contain commas (enforcing the slash/ habit)
        return { ...constraint, valid: !value.includes(",") };
      }
      return constraint;
    });

    setCountriesConstraints(copy);
    setAllCountriesConstraintsGood(copy.every((c) => c.valid));
  }

  return {
    countries,
    countriesConstraints,
    allCountriesConstraintsGood,
    handleCountries,
  };
}