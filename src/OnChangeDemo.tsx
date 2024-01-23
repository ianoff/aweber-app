import PasswordInput from "./components/PasswordInput";
import useValidation from "./lib/useValidation";

const OnChangeDemo = () => {
  const { validation, onChange, formData } = useValidation({
    password1: "",
    password2: "",
  });

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //.. sending data to the server goes here!
  }

  const hasMessages = !!validation.messages.length;

  const inputClass = `text-md block px-3 py-2 rounded-lg w-full 
  bg-white border-2 ${
    hasMessages ? "border-red-500" : "border-gray-300"
  } placeholder-gray-600 shadow-md
  focus:placeholder-gray-500
  focus:bg-white
  focus:${hasMessages ? "border-red-500" : "border-gray-600"}`;

  return (
    <>
      <h2>OnChange (Controlled components) demo</h2>
      <form
        id="form"
        className="bg-white shadow-md rounded px-4 pt-6 pb-8 mb-4 md:flex md:flex-row"
        onSubmit={onSubmit}
      >
        <div className="flex-none md:flex-1 p-6">
          <article id="password-instructions" className="block text-gray-700 text-md">
            <p className="mb-6">Please choose a new password. Passwords must:</p>
            <ul className="list-disc list-inside  from TailwindCSSpl-6 mb-8">
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
        <div className="flex-none md:flex-1 p-6">
          <div className="mb-6">
            <PasswordInput
              inputClassName={inputClass}
              ariaDescribedBy="password-errors"
              id="password1"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              onChange={onChange}
              value={formData.password1}
              name="password1"
            />
          </div>
          <div className="mb-6">
            <PasswordInput
              inputClassName={inputClass}
              ariaDescribedBy="password-errors"
              id="password2"
              labelClassName="block text-gray-700 text-sm font-bold mb-2"
              labelText="Confirm password"
              onChange={onChange}
              value={formData.password2}
              name="password2"
            />
          </div>
          <div className="flex items-center justify-between mb-12">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Set Password
            </button>
          </div>
          <div>
            {hasMessages && (
              <div id="password-errors">
                <p className="text-md text-red-500 mb-6">
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
    </>
  );
};

export default OnChangeDemo;
