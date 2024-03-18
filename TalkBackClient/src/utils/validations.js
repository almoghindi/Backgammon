export function isValidPassword(password) {
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

export function isValidUsername(username){
    if (username.length < 3) return false;

    
}