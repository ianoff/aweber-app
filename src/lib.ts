import deepmerge from "deepmerge";

// Initially I thought of using a single regex to check all the requirements, but quickly realized this would not allow me the kind of detailed feedback to the end user that I would prefer

// Regex for the following:
// Password has a min length of 6 characters
// Password has at least 1 uppercase character
// Password has at least 1 lowercase character
// Password has at least 1 number
// Password has at least 1 special character (!@#$%^&*()_-+={[}]|:;"'<,>.)

// const fullMatch =
//   /^(?=.*[!@#$%^&*()_\-+={[}\]|:;"'<,>.])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

const specialCharMatch = /(?=.*[!@#$%^&*()_\-+={[}\]|:;"'<,>.])+/;
const numberMatch = /(?=.*\d)+/;
const lowerMatch = /(?=.*[a-z])+/;
const upperMatch = /(?=.*[A-Z])+/;

// Breaking it down: ^ to indicate the beginning of the string.
// Then 4 positive lookaheads for each of the required character
// types listed above. Positive lookaheads allow us to ignore order.
// A dot character (any char but line breaks) to start the body of the match,
// then a quantifier to indicate that we need at least 6 of said characters.
// Finally, $ to indicate the end of the string.

interface ValidationObject {
  valid: boolean | undefined;
  messages: string[];
}

// interface Message {
//   message: string;
// }

interface Req {
  message: string;
  validator: (str: string) => boolean;
  isValid: boolean | undefined;
}

type Reqs = "length" | "specialChar" | "number" | "uppercase" | "lowercase";

type ValidationSettings = {
  [requirement: string]: Req;
};

type ValidationSettingsOptions = {
  [requirement: string]: Partial<Req>;
};

// type ValidationSettingsWithFunctions = {
//     [K in Reqs] : ;
//  }

export class PasswordValidator {
  settings: ValidationSettings;
  constructor(options?: ValidationSettingsOptions) {
    if (!options) {
      options = {};
    }
    const defaults: ValidationSettings = {
      length: {
        message: "Password must be at least 6 characters in length",
        validator: (str) => str.length >= 6,
        isValid: undefined,
      },
      specialChar: {
        message: `Password must have at least one special character (e.g. !@#$%^&*()_-+={[}]|:;"'<,>.])`,
        validator: (str) => specialCharMatch.test(str),
        isValid: undefined,
      },
      lowercase: {
        message: "Password must have at least one lowercase character",
        validator: (str) => lowerMatch.test(str),
        isValid: undefined,
      },
      uppercase: {
        message: "Password must have at least one uppercase character",
        validator: (str) => upperMatch.test(str),
        isValid: undefined,
      },
      number: {
        message: "Password must have at least one number",
        validator: (str) => numberMatch.test(str),
        isValid: undefined,
      },
    };
    this.settings = deepmerge(defaults, options as ValidationSettings);
  }
  validate = (str: string): ValidationObject => {
    const validationObj: ValidationObject = {
      valid: undefined,
      messages: [],
    };

    // If no value has been entered yet, don't prematurely mark as invalid
    if (!str || str.length === 0) {
      return validationObj;
    }

    validationObj.valid = true;



    for (const req in this.settings) {
      const currentReq = this.settings[req];
      currentReq.isValid = currentReq.validator(str);
      if (currentReq.isValid === false) {
        validationObj.messages.push(currentReq.message);
        validationObj.valid = false;
      }
    }

    return validationObj;
  };
}
