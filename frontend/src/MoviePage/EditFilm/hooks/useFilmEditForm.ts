import { useState } from "react";
import type { BasicFilmInfo } from "../../../types";


export function useEditForm(filmBasicInfo: BasicFilmInfo) {
  const [filmForm, setFilmForm] = useState(filmBasicInfo);

  function handleChange(key: keyof BasicFilmInfo, val: any) {
    setFilmForm((prev) => {
      return { ...prev, [key]: val };
    });
  }

  function checkIfAllGood(key:keyof BasicFilmInfo){
    const constraints = getConstraints(key, filmForm[key]);
    return constraints.every(c=>c.valid === true);
  }

  function getConstraints(key: keyof BasicFilmInfo, val: string | number) {
    const stringVal = String(val || "").trim();
    switch (key) {
      case "title":
        return [
          {
            id: "notnull",
            message: "Film title is required",
            valid: stringVal.length > 0,
          },
        ];

      case "original_title":
        return [
          {
            id: "notnull",
            message: "Original title is required",
            valid: stringVal.length > 0,
          },
        ];

      case "director":
        return [
          {
            id: "notnull",
            message: "Director name is required",
            valid: stringVal.length > 0,
          },
        ];

      case "casts":
        return [
          {
            id: "notnull",
            message: "Please list at least one cast member",
            valid: stringVal.length > 0,
          },
        ];

      case "runtime":
        return [
          {
            id: "isNumber",
            message: "Runtime must be a number",
            valid: !isNaN(Number(stringVal)) && stringVal.length > 0,
          },
        ];

      case "year":
        return [
          {
            id: "validYear",
            message: "Must be a 4-digit year",
            valid: /^\d{4}$/.test(stringVal),
          },
        ];

      case "countries":
        return [
          {
            id: "notnull",
            message: "Country of origin is required",
            valid: stringVal.length > 0,
          },
        ];

      case "languages":
        return [
          {
            id: "notnull",
            message: "Language info is required",
            valid: stringVal.length > 0,
          },
        ];

      case "poster":
        return [
          {
            id: "notnull",
            message: "Poster URL is required",
            valid: stringVal.length > 0,
          },
          {
            id: "format",
            message: "Must be a valid URL",
            valid: /^(https?:\/\/|\/|data:image\/).+/.test(stringVal),
          },
        ];

      case "backdrop":
        return [
          {
            id: "notnull",
            message: "Backdrop URL is required",
            valid: stringVal.length > 0,
          },
          {
            id: "format",
            message: "Must be a valid URL",
            valid: /^(https?:\/\/|\/|data:image\/).+/.test(stringVal),
          },
        ];

      case "plot":
        return [
          {
            id: "notnull",
            message: "Plot summary is required",
            valid: stringVal.length > 0,
          },
          {
            id: "minLen",
            message: "Plot is too short",
            valid: stringVal.length >= 10,
          },
        ];

      default:
        return [];
    }
  }

  return {filmForm, handleChange, getConstraints, checkIfAllGood}
}
