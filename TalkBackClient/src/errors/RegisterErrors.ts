export class InvalidUsernameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidUsernameError";
  }
}

export class InvalidPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPasswordError";
  }
}

export class PasswordVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordVerificationError";
  }
}
