import { useState } from "react";
import type { Constraint } from "../../../types";

export function usePlotField(initial: string) {
  // Constraints logic
  const isInitialNotEmpty = initial.trim().length > 0;
  const isInitialLongEnough = initial.trim().length >= 10;

  const initialConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Plot cannot be empty",
      valid: isInitialNotEmpty,
    },
    {
      id: "minLength",
      message: "Plot must be at least 10 characters",
      valid: isInitialLongEnough,
    },
  ];

  const [plot, setPlot] = useState(initial);
  const [plotConstraints, setPlotConstraints] = useState(initialConstraints);
  const [allPlotConstraintsGood, setAllPlotConstraintsGood] = useState(
    isInitialNotEmpty && isInitialLongEnough
  );

  function handlePlot(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const { value } = e.target;
    setPlot(value);

    const copy = plotConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: value.trim().length > 0 };
      }
      if (constraint.id === "minLength") {
        return { ...constraint, valid: value.trim().length >= 10 };
      }
      return constraint;
    });

    setPlotConstraints(copy);
    setAllPlotConstraintsGood(copy.every((c) => c.valid));
  }

  return {
    plot,
    plotConstraints,
    allPlotConstraintsGood,
    handlePlot,
  };
}