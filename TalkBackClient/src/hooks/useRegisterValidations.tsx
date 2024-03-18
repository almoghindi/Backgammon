import { useState } from "react";
import { getClientValidation } from "../utils/validations";
import {
  InvalidPasswordError,
  InvalidUsernameError,
  PasswordVerificationError,
} from "../errors/RegisterErrors";

export default function useRegisterValidations() {
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifiedPasswordError, setVerifiedPasswordError] = useState("");

  function resetFields() {
    setUsernameError("");
    setPasswordError("");
    setVerifiedPasswordError("");
    setError("");
  }

  function isRegisterFormValid(
    username: string,
    password: string,
    verifiedPassword: string
  ) {
    try {
      resetFields();
      getClientValidation(username, password, verifiedPassword);
      return true;
    } catch (error) {
      if (error instanceof InvalidUsernameError) {
        setUsernameError(error.message);
      } else if (error instanceof InvalidPasswordError) {
        setPasswordError(error.message);
      } else if (error instanceof PasswordVerificationError) {
        setVerifiedPasswordError(error.message);
      } else {
        setError("Registration failed");
      }
      return false;
    }
  }
  return {
    error,
    usernameError,
    passwordError,
    verifiedPasswordError,
    isRegisterFormValid,
    setError,
  } as const;
}
