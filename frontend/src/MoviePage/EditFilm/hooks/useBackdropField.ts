import { useState } from "react";
import type { Constraint } from "../../../types";

export function useBackdropField(initial: string) {
  // Pattern: http, https, root-relative paths, or data URIs
  const urlPattern = /^(https?:\/\/|\/|data:image\/).+/;
  const isInitialNotEmpty = initial.trim().length > 0;
  const isInitialFormatValid = urlPattern.test(initial);

  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Backdrop URL is required",
      valid: isInitialNotEmpty,
    },
    {
      id: "format",
      message: "Must be a valid URL or path",
      valid: isInitialFormatValid,
    },
  ];

  const [backdrop, setBackdrop] = useState(initial);
  const [backdropConstraints, setBackdropConstraints] = useState(initialConstraints);
  const [allBackdropConstraintsGood, setAllBackdropConstraintsGood] = useState(
    isInitialNotEmpty && isInitialFormatValid
  );

  function handleBackdrop(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setBackdrop(value);

    const copy = backdropConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      if (constraint.id === "format") {
        return { ...constraint, valid: urlPattern.test(value) };
      }
      return constraint;
    });

    setBackdropConstraints(copy);
    setAllBackdropConstraintsGood(copy.every((c) => c.valid));
  }

  return {
    backdrop,
    backdropConstraints,
    allBackdropConstraintsGood,
    handleBackdrop,
  };
}