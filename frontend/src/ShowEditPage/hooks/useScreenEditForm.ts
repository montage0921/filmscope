import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Screening } from "../../types";

export function useScreenEditForm(
  initialScreeng: Screening,
  saveScreening: Dispatch<SetStateAction<Screening[] | undefined>>,
  isAdding: boolean,
) {
  const [screeningForChange, setScreeningForChange] = useState(initialScreeng);

  useEffect(() => {
    setScreeningForChange(initialScreeng);
  }, [initialScreeng.screening_id]);

  function handleChange(key: keyof Screening, value: string) {
    const updatedScreening = { ...screeningForChange, [key]: value };
    if (!isAdding) {
      // if editing existing screen, also add it to screen[]
      saveScreening((screens) => {
        const copy = screens?.map((sc) =>
          sc.screening_id === updatedScreening.screening_id
            ? updatedScreening
            : sc,
        );
        return copy;
      });
    }
    setScreeningForChange(updatedScreening);
  }

  function getConstraints(key: keyof Screening, val: number | string) {
    const stringVal = String(val || "").trim();
    switch (key) {
      case "start_date":
        return [];

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
