import { deepMerge } from "./utils";

interface ValidationObject {
  valid: boolean | undefined;
  messages: string[];
}

interface ReqDefinition {
  message: string | (() => string);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator: (str: string, ...addlArgs: any[]) => boolean;
  isValid: boolean | undefined;
}

type ValidationSettings = {
  [requirement: string]: ReqDefinition;
};

type ValidationOptions = {
  [requirement: string]: Partial<ReqDefinition>;
};

/**
 * Password validation class structure; has defaults as specified
 * and can have custom functions and messages on instantiation.
 */
export class PasswordValidator {
  settings: ValidationSettings;

  constructor(options?: ValidationOptions) {
    if (!options) {
      options = {};
    }

    //Positive lookaheads - must have at least one of each type
    const specialCharMatch = /(?=.*[!@#$%^&*()_\-+={[}\]|:;"'<,>.])+/;
    const numberMatch = /(?=.*\d)+/;
    const lowerMatch = /(?=.*[a-z])+/;
    const upperMatch = /(?=.*[A-Z])+/;

    // Default error messages
    const defaults: ValidationSettings = {
      length: {
        message: (minLength = 6) =>
          `Password must be at least ${minLength} characters in length`,
        validator: (str, minLength = 6) => str.length >= minLength,
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
    this.settings = deepMerge(defaults, options as ValidationSettings);
  }
  validate = (str: string): ValidationObject => {
    // get rid of extra whitespace
    str = str.trim();

    const validationObj: ValidationObject = {
      valid: undefined,
      messages: [],
    };

    // If no value has been entered yet, don't prematurely mark as invalid
    if (!str || str.length === 0) {
      return validationObj;
    }

    validationObj.valid = true;

    // iterate through requirements and add feedback as needed
    for (const req in this.settings) {
      const currentReq = this.settings[req];
      currentReq.isValid = currentReq.validator(str);
      if (currentReq.isValid === false) {
        let message:string;
        if (typeof currentReq.message == 'function') {
          message= currentReq.message()
        } else {
          message = currentReq.message;
        }
        validationObj.messages.push(message);
        validationObj.valid = false;
      }
    }

    return validationObj;
  };
}

export default PasswordValidator;
