import { useEffect, useState } from "react";
import type { Screening } from "../../types";

export function useScreenEditForm(initialScreeng: Screening) {
  const [screeningForChange, setScreeningForChange] =
    useState(initialScreeng);

  useEffect(() => {
    setScreeningForChange(initialScreeng);
  }, [initialScreeng.screening_id]);

  function handleChange(key: keyof Screening, value: string) {
    setScreeningForChange((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }

  function getConstraints(
    key: keyof Screening,
    val: number | string,
  ) {
    const stringVal = String(val || "").trim();
    switch (key) {
      case "start_date":
        return [
        ];

      case "start_time":
        return [];

      case "ticket_url":
        return [];
      default:
        return [];
    }
  }

  function checkAllConstraintsGood(key: keyof Screening) {
    const constraints = getConstraints(key, screeningForChange[key]);
    return true; // temporary
  }

  return {
    screeningForChange,
    handleChange,
    checkAllConstraintsGood,
    getConstraints,
  };
}
