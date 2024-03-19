import {
  InvalidPasswordError,
  InvalidUsernameError,
  PasswordVerificationError,
} from "../errors/RegisterErrors";

export function isValidPassword(password: string) {
  // Check if password has minimum 8 characters
  if (password.length < 8) {
    return false;
  }

  // Check if password contains at least one lowercase letter, one uppercase letter, and one number
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;

  return (
    lowercaseRegex.test(password) &&
    uppercaseRegex.test(password) &&
    numberRegex.test(password)
  );
}

export function isValidUsername(username: string) {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

export function getRegisterValidation(
  username: string,
  password: string,
  verifiedPassword: string
) {
  getLoginValidation(username, password);
  if (verifiedPassword !== password) {
    throw new PasswordVerificationError("passwords do not match");
  }
}

export function getLoginValidation(username: string, password: string) {
  if (!isValidUsername(username)) {
    throw new InvalidUsernameError("username is invalid");
  }
  if (!isValidPassword(password)) {
    throw new InvalidPasswordError(
      "password must be minimum 8 characters, contain capital letters and numbers"
    );
  }
}
