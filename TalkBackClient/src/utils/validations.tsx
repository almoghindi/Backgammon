// import {
//   InvalidPasswordError,
//   InvalidUsernameError,
//   PasswordVerificationError,
// } from "../errors/RegisterErrors";

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

// export function isValidUsername(username: string) {
//   return username.length >= 3;
// }

export function getRegisterValidation(
  username: string,
  password: string,
  verifiedPassword: string
) {
  if (username.length < 3) {
    return "Username is too short, must be at least 3 chracters!";
  }

  if (isValidPassword(password)) {
    return "Password should contain at least 8 chracters, Upper and lower cases and number.";
  }

  if (verifiedPassword !== password) {
    return "Password should match !";
  }

  return "";
}

// export function getLoginValidation(username: string, password: string) {
//   if (!isValidUsername(username)) {
//     throw new InvalidUsernameError("username must have at least 3 characters");
//   }
//   if (!isValidPassword(password)) {
//     throw new InvalidPasswordError(
//       "password must be minimum 8 characters, contain capital letters and numbers"
//     );
//   }
// }
