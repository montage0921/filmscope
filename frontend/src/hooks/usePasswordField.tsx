import { useState } from "react";
import type { Constraint } from "../types";

export function usePasswordField() {
  const initialPasswordConstraints: Constraint[] = [
    {
      id: "notnull",
      message: "Can't be empty",
      valid: false,
    },
    {
      id: "minLength",
      message: "Must be at least 8 characters",
      valid: false,
    },
    {
      id: "maxLength",
      message: "Must be at most 20 characters",
      valid: true,
    },
    {
      id: "containSpecial",
      message: "Must contain at least one special symbol",
      valid: false,
    },
    {
      id: "containNumber",
      message: "Must contain at least one number",
      valid: false,
    },
    {
      id: "containLower",
      message: "Must contain at least one LowerCase letter",
      valid: false,
    },
    {
      id: "containUpper",
      message: "Must contain at least one UpperCase letter",
      valid: false,
    },
  ];

  // Password
  const [password, setPassword] = useState("");
  const [passwordConstraints, setPasswordConstraints] = useState(
    initialPasswordConstraints,
  );
  const [allPasswordConstraintsGood, setAllPasswordConstraintsGood] =
    useState(false);

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPassword(value);
    const copy = passwordConstraints.map((constraint) => {
      if (constraint.id === "notnull") {
        return { ...constraint, valid: e.target.value.length > 0 };
      }
      if (constraint.id === "minLength") {
        return { ...constraint, valid: e.target.value.length >= 8 };
      }
      if (constraint.id === "maxLength") {
        return { ...constraint, valid: e.target.value.length <= 20 };
      }
      if (constraint.id === "containSpecial") {
        return { ...constraint, valid: /[!@#$%^&*(),.?":{}|<>]/.test(value) };
      }
      if (constraint.id === "containNumber") {
        return { ...constraint, valid: /[0-9]/.test(value) };
      }
      if (constraint.id === "containLower") {
        return { ...constraint, valid: /[a-z]/.test(value) };
      }
      if (constraint.id === "containUpper") {
        return { ...constraint, valid: /[A-Z]/.test(value) };
      }

      return constraint;
    });

    setPasswordConstraints(copy);
    const allGood = copy.every((constraint) => constraint.valid === true);
    setAllPasswordConstraintsGood(allGood);
  }

  return {
    password,
    passwordConstraints,
    allPasswordConstraintsGood,
    handlePassword,
  };
}
