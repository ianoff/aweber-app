import { useState } from "react";
import PasswordValidator, { ValidationObject } from "./lib";
import { debounce } from "./utils";
import "./App.css";

const pv = new PasswordValidator();

function App() {
  const [validation, setValidation] = useState<ValidationObject>({
    valid: undefined,
    messages: [],
  });

  //validate on change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const currentPW = e.target.value;
    setValidation(pv.validate(currentPW));
  };

  // Don't flash the UI so often it makes the user annoyed
  const debouncedOnChange = debounce(onChange, 350);

  return (
    <>
      <h1>Password Reset</h1>
      <div className="w-full max-w-lg">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              onChange={debouncedOnChange}
            />
            <p className="text-xs italic">Please choose a password.</p>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Set Password
            </button>
          </div>
          <div>
            {!!validation.messages.length && (
              <ul>
                {validation.messages.map((message) => {
                  return <li key={message} className="text-red-500 text-xs">{message}</li>;
                })}
              </ul>
            )}
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </>
  );
}

export default App;
