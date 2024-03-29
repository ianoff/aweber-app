import { useState, useId } from "react";

interface PasswordInputProps {
  ariaDescribedBy: string;
  displayHideToggle?: boolean;
  hideTogglebuttonClassName?: string;
  id: string;
  inputClassName?: string;
  labelClassName?: string;
  labelText?: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, ...args:unknown[]) => void;
  placeholder?: string;
  required?: boolean;
  value?: string;
}

/**
 * Password input component.
 *
 * @param {PasswordInputProps} props 
 * @return {*}
 */
const PasswordInput = (props: PasswordInputProps) => {
  const [show, setShow] = useState<boolean>(false);
  const showPWButtonId = useId();
  const {
    ariaDescribedBy,
    displayHideToggle = true,
    hideTogglebuttonClassName,
    id,
    inputClassName,
    labelClassName,
    labelText = "Password",
    name,
    onChange,
    placeholder,
    required,
    value,
  } = props;

  return (
    <>
      <label className={labelClassName} htmlFor="password">
        {labelText}
      </label>
      <div style={{ position: "relative" }}>
        <input
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          className={inputClassName}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={displayHideToggle ? (show ? "text" : "password") : "password"}
          value={value}
        />
        {displayHideToggle && (
          <button
            aria-checked={show}
            className={hideTogglebuttonClassName}
            id={showPWButtonId}
            onClick={() => setShow(!show)}
            role="switch"
            type="button"
            style={
              hideTogglebuttonClassName
                ? {}
                : {
                    position: "absolute",
                    right: "1em",
                    top: "0",
                    height: "100%",
                  }
            }
          >
            {show ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>
    </>
  );
};

export default PasswordInput;
