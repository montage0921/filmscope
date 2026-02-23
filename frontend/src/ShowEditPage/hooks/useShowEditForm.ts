import { useEffect, useState } from "react";
import type { EditShowBasicInfo } from "../EditShowForm";

export function useShowEditForm(initialEditShowDto: EditShowBasicInfo) {
  const [curShowBasicInfo, setCurShowBasicInfo] =
    useState(initialEditShowDto);

  useEffect(() => {
    setCurShowBasicInfo(initialEditShowDto);
  }, [initialEditShowDto.show_id]);

  function handleChange(key: keyof EditShowBasicInfo, value: String) {
    setCurShowBasicInfo((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }

  function getConstraints(
    key: keyof EditShowBasicInfo,
    val: number | String,
  ) {
    const stringVal = String(val || "").trim();
    switch (key) {
      case "show_name":
        return [
          {
            id: "notnull",
            message: "Show name is required",
            valid: stringVal.length > 0,
          },
        ];

      case "qa_with":
        return [];

      case "special":
        return [];
      default:
        return [];
    }
  }

  function checkAllConstraintsGood(key: keyof EditShowBasicInfo) {
    const constraints = getConstraints(key, curShowBasicInfo[key]);
    return constraints.every((c) => c.valid === true);
  }

  return {
    curShowBasicInfo,
    handleChange,
    checkAllConstraintsGood,
    getConstraints,
  };
}
