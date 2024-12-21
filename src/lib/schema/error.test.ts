import { z } from "zod";
import { createError, createValidationError, Error } from './error';

describe('Error Schema', () => {
  it('should validate a correct error object', () => {
    const errorObject = {
      message: "An error occurred",
      errors: [
        { field: "username", message: "Username is required" },
        { field: "password", message: "Password is required" }
      ]
    };

    expect(() => Error.parse(errorObject)).not.toThrow();
  });

  it('should throw an error for an invalid error object', () => {
    const invalidErrorObject = {
      message: "",
      errors: [
        { field: "username", message: "" }
      ]
    };

    expect(() => Error.parse(invalidErrorObject)).toThrow();
  });
});

describe('createError', () => {
  it('should create a valid error object', () => {
    const errorObject = createError("An error occurred", [
      { message: "Username is required" },
      { message: "Password is required" }
    ]);

    expect(() => Error.parse(errorObject)).not.toThrow();
  });
});

describe('createValidationError', () => {
  it('should create a valid validation error object', () => {
    const validationError = new z.ZodError([
      { path: ["username"], message: "Username is required", code: "custom" },
      { path: ["password"], message: "Password is required", code: "custom" }
    ]);

    const errorObject = createValidationError(validationError);

    expect(() => Error.parse(errorObject)).not.toThrow();
  });
});