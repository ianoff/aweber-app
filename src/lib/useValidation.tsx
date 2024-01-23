import {
  PasswordValidator,
  ValidationObject,
  Options as ValidationOptions,
} from "./lib";
import { useState } from "react";

export interface FieldsWithValues {
  [fieldName: string]: string;
}

export class TooManyFieldsError extends Error {
  constructor(message:string) {
    super(message);
    this.name = "TooManyFieldsError";
  }
}

interface UseValidationReturn {
  validation: ValidationObject;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: FieldsWithValues;
}

/**
 * Hook for use of the validation library in conjunction with a Password input component. See lib.ts for default values.
 * @example
 * ```
 * const { validation, onChange, formData } = useValidation({
 *              password1: "",
 *              password2: ""
 * });
 * ```
 * @param {FieldsWithValues} fields An object with the input element names (not IDs!) that are using the onChange function, and their initial values. Currently only works with two fields. See example.
 * @param {ValidationOptions} [validationOptions] Options to initiate the validator library with. See lib.ts for defaults and options available.
 * @return {UseValidationReturn} The validation status, an onChange handler for the inputs, and the form's current data.
 */
function useValidation(
  fields: FieldsWithValues,
  validationOptions?: ValidationOptions
) {
  if (Object.keys(fields).length > 2) {
    throw new TooManyFieldsError(
      "Hook only works with two registered password fields; please reinstantiate with only two fields"
    );
  }
  const [formData, setFormData] = useState<FieldsWithValues>(fields);

  const [validation, setValidation] = useState<ValidationObject>({
    valid: false,
    messages: [],
  });

  const pv = new PasswordValidator(validationOptions);

  const runValidation = (form:HTMLFormElement) => {
    const newFormData = { ...formData };

    Object.entries(fields).forEach(([name]) => {
      const input: HTMLInputElement | null = form.querySelector(`input[name=${name}]`);
        newFormData[name] = input ? input.value : newFormData[name];
    });

    setFormData(newFormData);

    // NOTE: If they register more than 2 password inputs, this is going to be
    const { valid, messages } = pv.validate(...Object.values(newFormData));

    setValidation({
      valid,
      messages,
    });
  };
  // On inputs
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const form = e.target.form;
    if (!form) {
      console.error(
        "The element using the onChange function should be within a form element; parent form not found."
      );
      return;
    }
    runValidation(form);
  };

  // On Form Element
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    const form  = e.target;
    runValidation(form as HTMLFormElement);
  };

  const validationReturn: UseValidationReturn = {
    validation,
    onChange,
    onSubmit,
    formData,
  };

  return validationReturn;
}

export default useValidation;
