import { PasswordValidator } from "../lib";

// Password has a min length of 6 characters
// Password has at least 1 uppercase character
// Password has at least 1 lowercase character
// Password has at least 1 number
// Password has at least 1 special character (!@#$%^&*()_-+={[}]|:;"'<,>.)

const pv = new PasswordValidator();
const isPasswordValid = pv.validate;

describe("validation", function () {
  test("Validates valid passwords", () => {
    expect(isPasswordValid("aD56#_sb", "aD56#_sb")).toEqual({
      valid: true,
      messages: [],
    });
  });

  test("Return false if nothing has been entered yet, but don't bombard the user with errors", () => {
    expect(isPasswordValid()).toEqual({
      valid: false,
      messages: [],
    });
    expect(isPasswordValid("", "")).toEqual({
      valid: false,
      messages: [],
    });

    expect(isPasswordValid("      ", "")).toEqual({
      valid: false,
      messages: [],
    });
  });

  test("Passwords must match", () => {
    expect(isPasswordValid("aB$6878")).toEqual({
      valid: false,
      messages: ["Passwords must match exactly"],
    });
  });

  test("Password has a min length of 6 characters", () => {
    expect(isPasswordValid("aB$6", "aB$6")).toEqual({
      valid: false,
      messages: ["Password must be at least 6 characters in length"],
    });
  });

  test("Password has at least 1 uppercase character", () => {
    expect(isPasswordValid("a6%daad", "a6%daad")).toEqual({
      valid: false,
      messages: ["Password must have at least one uppercase character"],
    });
  });

  test("Password has at least 1 lowercase character", () => {
    expect(isPasswordValid("A6%DACD", "A6%DACD")).toEqual({
      valid: false,
      messages: ["Password must have at least one lowercase character"],
    });
  });

  test("Password has at least 1 number", () => {
    expect(isPasswordValid("A%DaCD", "A%DaCD")).toEqual({
      valid: false,
      messages: ["Password must have at least one number"],
    });
  });

  test("Password has at least 1 special character", () => {
    expect(isPasswordValid("A7DaCD", "A7DaCD")).toEqual({
      valid: false,
      messages: [
        `Password must have at least one special character (e.g. !@#$%^&*()_-+={[}]|:;"'<,>.])`,
      ],
    });
  });

  test("Can show multiple errors at once", () => {
    expect(isPasswordValid("aaa").valid).toEqual(false);
    expect(isPasswordValid("aaa").messages.length).toEqual(5);
    expect(
      isPasswordValid("aaa").messages.includes(
        "Password must be at least 6 characters in length"
      )
    ).toBe(true);
    expect(
      isPasswordValid("aaa").messages.includes(
        "Passwords must match exactly"
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
      minimumLength: {
        message: "Not long enough",
      },
      number: {
        message: "Needs a number",
      },
    });

    expect(custom.validate("XDaR@", "XDaR@").valid).toEqual(false);
    expect(custom.validate("XDaR@", "XDaR@").messages.length).toEqual(2);
    expect(custom.validate("XDaR@", "XDaR@").messages.includes("Not long enough"));
    expect(custom.validate("XDaR@", "XDaR@").messages.includes("Needs a number"));
  });

  test("Can be instantiated with custom functions", () => {
    const customFunc = new PasswordValidator({
      noThreeRepeat: {
        message: "No character can be repeated 3 times in a row",
        validator: (str) => {
          return !/(?=(.)\1\1).{3,}/.test(str);
        },
      },
      minimumLength: {
        validator: (str) => {
          return str.length >= 8;
        },
      },
    });

    expect(customFunc.validate("aaaaaaaaaD56#_sb", "aaaaaaaaaD56#_sb")).toEqual({
      valid: false,
      messages: ["No character can be repeated 3 times in a row"],
    });

    expect(customFunc.validate("aA%6", "aA%6")).toEqual({
      valid: false,
      messages: ["Password must be at least 6 characters in length"],
    });

    expect(customFunc.validate("aD56#_sb", "aD56#_sb")).toEqual({
      valid: true,
      messages: [],
    });
  });
});
