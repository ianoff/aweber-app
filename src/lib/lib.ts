import { deepMerge } from "./utils";

export interface ValidationObject {
  valid: boolean;
  messages: string[];
}

export interface ReqDefinition {
  message: string | (() => string);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator: (str: string, ...addlArgs: any[]) => boolean;
  valid: boolean;
}

export type Settings = {
  [requirement: string]: ReqDefinition;
};

export type Options = {
  [requirement: string]: Partial<ReqDefinition>;
};

/**
 * Password validation class; has defaults as specified
 * and can have custom functions and messages on instantiation.
 * @export
 * @class PasswordValidator
 */
export class PasswordValidator {
  settings: Settings;

  /**
   * Creates an instance of PasswordValidator.
   * @param {Options} [options]
   * @memberof PasswordValidator
   */
  constructor(options?: Options) {
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
      minimumLength: {
        message: () => `Password must be at least 6 characters in length`,
        validator: (str) => {
          return str.length >= 6;
        },
        valid: false,
      },
      specialChar: {
        message: `Password must have at least one special character (e.g. !@#$%^&*()_-+={[}]|:;"'<,>.])`,
        validator: (str) => specialCharMatch.test(str),
        valid: false,
      },
      lowercase: {
        message: "Password must have at least one lowercase character",
        validator: (str) => lowerMatch.test(str),
        valid: false,
      },
      uppercase: {
        message: "Password must have at least one uppercase character",
        validator: (str) => upperMatch.test(str),
        valid: false,
      },
      number: {
        message: "Password must have at least one number",
        validator: (str) => numberMatch.test(str),
        valid: false,
      },
      matching: {
        validator: (strOne, strTwo) => {
          return strOne.trim() === strTwo.trim();
        },
        message: "Passwords must match exactly",
        valid: false,
      },
    };
    this.settings = deepMerge(defaults, options as Settings);
  }
  /**
   * Validates two password strings, based on instantiated settings.
   *
   * @param {string} str
   * @memberof PasswordValidator
   * @returns {ValidationObject}
   */
  validate = (strOne: string = "", strTwo: string = ""): ValidationObject => {
    // get rid of extra whitespace
    strOne = strOne.trim();
    strTwo = strTwo.trim();

    const validationObj: ValidationObject = {
      valid: false,
      messages: [],
    };

    // If nothing has been entered yet, don't bombard the user with error messages
    if (strOne === "" && strTwo === "") return validationObj;

    let validities = {};
    // iterate through requirements and add feedback as needed
    for (const req in this.settings) {
      const currentReq = this.settings[req];
      // Is the pw valid accoring to the current requirement?
      currentReq.valid = currentReq.validator(strOne, strTwo);
      // This could be a simple array but this structure is nice for debugging custom function additions
      validities = { ...validities, [req]: currentReq.valid };
      //If not, add the error message
      if (currentReq.valid === false) {
        let message: string;
        if (typeof currentReq.message == "function") {
          message = currentReq.message();
        } else {
          message = currentReq.message;
        }
        validationObj.messages.push(message);
      }
    }

    validationObj.valid = !Object.values(validities).includes(false);

    return validationObj;
  };
}

// Also export as default for convenience
export default PasswordValidator;
