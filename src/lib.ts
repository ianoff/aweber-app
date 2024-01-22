import { deepMerge } from "./utils";

export interface ValidationObject {
  valid: boolean;
  messages: string[];
}

interface ReqDefinition {
  message: string | (() => string);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator: (str: string, ...addlArgs: any[]) => boolean;
  isValid: boolean;
}

type Settings = {
  [requirement: string]: ReqDefinition;
};

type Options = {
  [requirement: string]: Partial<ReqDefinition>;
};

/**
 * Password validation class structure; has defaults as specified
 * and can have custom functions and messages on instantiation.
 */

/**
 *
 *
 * @export
 * @class PasswordValidator
 */
export class PasswordValidator {
  settings: ValidationSettings;
  status;

  /**
   * Creates an instance of PasswordValidator.
   * @param {{ validationOptions: Options; matchingOptions: Options }} [options]
   * @memberof PasswordValidator
   */
  constructor(options?: { validationOptions: Options; matchingOptions: Options }) {
    if (!options) {
      options = {};
    }

    //Positive lookaheads - must have at least one of each type
    const specialCharMatch = /(?=.*[!@#$%^&*()_\-+={[}\]|:;"'<,>.])+/;
    const numberMatch = /(?=.*\d)+/;
    const lowerMatch = /(?=.*[a-z])+/;
    const upperMatch = /(?=.*[A-Z])+/;

    // Default error messages
    const defaults: Settings = {
      validation: {
        minimumLength: {
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
      },
      matching: {
        validator: (strOne, strTwo) => strOne.trim() === strTwo.trim(),
        message: "Passwords must match exactly",
        isValid: undefined,
      },
    };
    this.settings = deepMerge(defaults, {
      validation: { ...options?.validationOptions },
      matching: { ...options?.matchingOptions },
    } as Settings);
  }
  /**
   * Validate a single password based on instantiated settings.
   *
   * @param {string} str
   * @memberof PasswordValidator
   * @returns {ValidationObject}
   */
  validate = (str: string): ValidationObject => {
    // get rid of extra whitespace
    str = str.trim();

    const validationObj: ValidationObject = {
      valid: false,
      messages: [],
    };

    // If no value has been entered yet, don't prematurely mark as invalid
    if (!str || !str.length) {
      return validationObj;
    }

    validationObj.valid = true;

    // iterate through requirements and add feedback as needed
    for (const req in this.settings.validation) {
      const currentReq = this.settings.validation[req];
      currentReq.isValid = currentReq.validator(str);
      if (currentReq.isValid === false) {
        let message: string;
        if (typeof currentReq.message == "function") {
          message = currentReq.message();
        } else {
          message = currentReq.message;
        }
        validationObj.messages.push(message);
        validationObj.valid = false;
      }
    }

    return validationObj;
  };
  /**
   * Check if two password strings match
   *
   * @param {string} strOne
   * @param {string} strTwo
   * @memberof PasswordValidator
   * @returns {ValidationObject}
   */
  match = (strOne: string, strTwo: string): ValidationObject => {
    const validationObj: ValidationObject = {
      valid: false,
      messages: [],
    };

    const valid = this.settings.matching.validator(strOne, strTwo);

    validationObj.valid = valid;
    validationObj.messages = valid ? [] : ["Passwords must match exactly"]
    return validationObj;
  };
}

// Also export as default for convenience
export default PasswordValidator;
