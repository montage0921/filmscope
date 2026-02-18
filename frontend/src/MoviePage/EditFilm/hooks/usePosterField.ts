import { useState } from "react";
import type { Constraint } from "../../../types";

export function usePosterField(initial: string) {
  // Simple check if it looks like a URL or a valid path
  const urlPattern = /^(https?:\/\/|\/|data:image\/).+/;
  const isInitialValid = initial.trim().length > 0 && urlPattern.test(initial);

  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Poster URL is required",
      valid: initial.trim().length > 0,
    },
    {
      id: "format",
      message: "Must be a valid URL (http/https) or local path",
      valid: urlPattern.test(initial),
    },
  ];

  const [poster, setPoster] = useState(initial);
  const [posterConstraints, setPosterConstraints] = useState(initialConstraints);
  const [allPosterConstraintsGood, setAllPosterConstraintsGood] = useState(isInitialValid);

  function handlePoster(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setPoster(value);

    const copy = posterConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      if (constraint.id === "format") {
        // Checks for http://, https://, or relative paths like /images/
        return { ...constraint, valid: urlPattern.test(value) };
      }
      return constraint;
    });

    setPosterConstraints(copy);
    setAllPosterConstraintsGood(copy.every((c) => c.valid));
  }

  return {
    poster,
    posterConstraints,
    allPosterConstraintsGood,
    handlePoster,
  };
}