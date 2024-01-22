import { useState } from "react";
import PasswordValidator, { ValidationObject } from "./lib";
import PasswordInput from "./components/PasswordInput";

const pv = new PasswordValidator();

function App() {
  const [formData, setFormData] = useState({
    password1: "",
    password2: "",
  });

  const [validation, setValidation] = useState<ValidationObject>({
    valid: undefined,
    messages: [],
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("e.target.id", e.target.id);
    const newFormData = { ...formData, [e.target.id]: e.target.value };
    setFormData(newFormData);
    const matching = pv.match(newFormData.password1, newFormData.password2);
    const val = pv.validate(e.target.value);
    console.log("=========================================");
    console.log("val.valid::", val.valid);
    console.log("matching.valid::", matching.valid);
    console.log("&&", val.valid && matching.valid);

    setValidation({
      valid: !!val.valid && matching.valid,
      messages: [...new Set(val.messages.concat(matching.messages))],
    });
  };

  return (
    <>
      <div className="container mx-auto ">
        <h1>Password Reset Demo</h1>
        <form
          id="form"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 md:flex md:flex-row"
        >
          <div className="flex-none md:flex-1 p-12">
            <article id="password-instructions" className="block text-gray-700 text-md">
              <p className="mb-6">Please choose a new password. Passwords must:</p>
              <ul className="list-disc list-inside pl-6 mb-8">
                <li>Be at least 6 characters in length</li>
                <li>Contain at least one number</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one lowercase letter</li>
                <li>
                  Contain at least one special character (e.g.{" "}
                  <span className="font-mono">{`!@#$%^&*()_-+={[}]|:;"'<,>.]`}</span>
                </li>
              </ul>
              <p>Additionally, the passwords in both inputs must match exactly.</p>
            </article>
          </div>
          <div className="flex-none md:flex-1 p-12">
            <div className="mb-6">
              <PasswordInput
                inputClassName="text-md block px-3 py-2 rounded-lg w-full 
              bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md
              focus:placeholder-gray-500
              focus:bg-white 
              focus:border-gray-600 focus:outline-none"
                ariaDescribedBy="password-errors"
                id="password1"
                labelClassName="block text-gray-700 text-sm font-bold mb-2"
                onChange={onChange}
                value={formData.password1}
              />
            </div>
            <div className="mb-6">
              <PasswordInput
                inputClassName="text-md block px-3 py-2 rounded-lg w-full 
              bg-white border-2 border-gray-300 placeholder-gray-600 shadow-md
              focus:placeholder-gray-500
              focus:bg-white 
              focus:border-gray-600 focus:outline-none"
                ariaDescribedBy="password-errors"
                id="password2"
                labelClassName="block text-gray-700 text-sm font-bold mb-2"
                labelText="Confirm password"
                onChange={onChange}
                value={formData.password2}
              />
            </div>
            <div className="flex items-center justify-between mb-12">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Set Password
              </button>
            </div>
            <div>
              {!!validation.messages.length && (
                <div id="password-errors">
                  <p className="text-md text-gray-700 mb-6">
                    The form contains errors. Please review:
                  </p>
                  <ul className="text-red-500 text-sm list-disc list-inside pl-6 mb-8">
                    {validation.messages.map((message) => {
                      return <li key={message}>{message}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
