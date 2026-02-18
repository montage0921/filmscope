import { useState } from "react";
import type { Constraint } from "../../../types";

export function useRuntimeField(initial: string) {
  // Constraints
  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Runtime can't be empty",
      valid: initial.length > 0,
    },
    {
      id: "isnumber",
      message: "Must be a number",
      valid: /^\d+$/.test(initial),
    },
  ];

  // State
  const [runtime, setRuntime] = useState(initial);
  const [runtimeConstraints, setRuntimeConstraints] = useState(initialConstraints);
  const [allRuntimeConstraintsGood, setAllRuntimeConstraintsGood] = useState(initial.length > 0 && /^\d+$/.test(initial));

  // Handle Field Change
  function handleRuntime(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setRuntime(value);

    const copy = runtimeConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      if (constraint.id === "isnumber") {
        return { ...constraint, valid: /^\d+$/.test(value) };
      }
      return constraint;
    });

    setRuntimeConstraints(copy);

    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllRuntimeConstraintsGood(allGood);
  }

  return {
    runtime,
    runtimeConstraints,
    allRuntimeConstraintsGood,
    handleRuntime,
  };
}