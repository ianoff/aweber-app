import { PasswordValidator } from "../lib";

// Password has a min length of 6 characters
// Password has at least 1 uppercase character
// Password has at least 1 lowercase character
// Password has at least 1 number
// Password has at least 1 special character (!@#$%^&*()_-+={[}]|:;"'<,>.)

const pv = new PasswordValidator();
const isPasswordValid = pv.validate;
const doStringsMatch = pv.match;

describe("validation", function () {
  test("Return false if nothing has been entered yet", () => {
    expect(isPasswordValid("")).toEqual({
      valid: false,
      messages: [],
    });

    expect(isPasswordValid("      ")).toEqual({
      valid: false,
      messages: [],
    });
  });

  test("Validates valid password", () => {
    expect(isPasswordValid("aD56#_sb")).toEqual({
      valid: true,
      messages: [],
    });
  });

  test("Password has a min length of 6 characters", () => {
    expect(isPasswordValid("aB$6")).toEqual({
      valid: false,
      messages: ["Password must be at least 6 characters in length"],
    });
  });

  test("Password has at least 1 uppercase character", () => {
    expect(isPasswordValid("a6%daad")).toEqual({
      valid: false,
      messages: ["Password must have at least one uppercase character"],
    });
  });

  test("Password has at least 1 lowercase character", () => {
    expect(isPasswordValid("A6%DACD")).toEqual({
      valid: false,
      messages: ["Password must have at least one lowercase character"],
    });
  });

  test("Password has at least 1 number", () => {
    expect(isPasswordValid("A%DaCD")).toEqual({
      valid: false,
      messages: ["Password must have at least one number"],
    });
  });

  test("Password has at least 1 special character", () => {
    expect(isPasswordValid("A7DaCD")).toEqual({
      valid: false,
      messages: [
        `Password must have at least one special character (e.g. !@#$%^&*()_-+={[}]|:;"'<,>.])`,
      ],
    });
  });

  test("Can show multiple errors at once", () => {
    expect(isPasswordValid("aaa").valid).toEqual(false);
    expect(isPasswordValid("aaa").messages.length).toEqual(4);
    expect(
      isPasswordValid("aaa").messages.includes(
        "Password must be at least 6 characters in length"
      )
    ).toBe(true);
    expect(
      isPasswordValid("aaa").messages.includes(
        "Password must have at least one uppercase character"
      )
    ).toBe(true);
    expect(
      isPasswordValid("aaa").messages.includes("Password must have at least one number")
    ).toBe(true);
    expect(
      isPasswordValid("aaa").messages.includes(
        `Password must have at least one special character (e.g. !@#$%^&*()_-+={[}]|:;"'<,>.])`
      )
    ).toBe(true);
  });

  test("Can be instantiated with custom messages", () => {
    const custom = new PasswordValidator({
      validationOptions: {
        minimumLength: {
          message: "Not long enough",
        },
        number: {
          message: "Needs a number",
        },
      },
    });

    expect(custom.validate("XDaR@").valid).toEqual(false);
    expect(custom.validate("XDaR@").messages.length).toEqual(2);
    expect(custom.validate("XDaR@").messages.includes("Not long enough"));
    expect(custom.validate("XDaR@").messages.includes("Needs a number"));
  });

  test("Can be instantiated with custom functions", () => {
    const customFunc = new PasswordValidator({
      validationOptions: {
        noThreeRepeat: {
          message: "No character can be repeated 3 times in a row",
          validator: (str) => {
            return !/(?=(.)\1\1).{3,}/.test(str);
          },
        },
        minimumLength: {
          validator: (str, minLength = 8) => {
            return str.length >= minLength;
          },
        },
      },
    });

    expect(customFunc.validate("aaaaaaaaaD56#_sb")).toEqual({
      valid: false,
      messages: ["No character can be repeated 3 times in a row"],
    });

    expect(customFunc.validate("aA%6")).toEqual({
      valid: false,
      messages: ["Password must be at least 6 characters in length"],
    });

    expect(customFunc.validate("aD56#_sb")).toEqual({
      valid: true,
      messages: [],
    });
  });
});

describe("matching", function () {
  test("indicate if password strings match", () => {
    expect(doStringsMatch("abc", "def")).toEqual({
      valid: false,
      messages: ["Passwords must match exactly"],
    });
    expect(doStringsMatch("aaa", "aaa")).toEqual({
      valid: true,
      messages: [],
    });
    expect(doStringsMatch("aaa  ", "  aaa")).toEqual({
      valid: true,
      messages: [],
    });
    expect(doStringsMatch("aaa  ", "  aaa")).toEqual({
      valid: true,
      messages: [],
    });
  });
});
