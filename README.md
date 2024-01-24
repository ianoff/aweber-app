# Ian E's Password Challenge

## Example site installation

Clone the repo locally. Then run:

```bash
npm i
npm run dev
```

Open [http://localhost:3636/](http://localhost:3636/)

## Tests

```bash
npm run test
```

## Usage in React app

Import the `useValidation` hook into your component. The hook can be used one of two ways: validating passwords `onSubmit`, where the user only receives feedback when the submit button is pressed, or `onChange`, where the user receives live feedback as they type.

You may use the provided PasswordInput component in the `components` folder, or use your own.


### onSubmit Example

For onSubmit, use the `onSubmit` handler from the hook on the `form` element.

```jsx
const MyComponent = () => {
  const { onSubmit, validation } = useValidation({
    fieldOne: "",
    fieldTwo: "",
  });

  return (
    <form
      data-testid="my-form"
      id="myForm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      <label htmlFor="fieldOne">FieldOne</label>
      <input name="fieldOne" id="fieldOne" />
      <label htmlFor="fieldTwo">FieldTwo</label>
      <input name="fieldTwo" id="fieldTwo" />
      <button type="submit">submit</button>
    </form>
  );
};
```

### onChange Example

For onChange, use the `onChange` handler from the hook on your `input` elements, as well as setting their value to the current `formData` value for each input. These are now controlled components.

```jsx
const MyComponent = () => {
  // Instantiate the hook with the field names and initial values
  const { onSubmit, validation, formData } = useValidation({
    fieldOne: "",
    fieldTwo: "",
  });

  return (
    <form id="myForm">
      <label htmlFor="fieldOne">FieldOne</label>
      <input
        name="fieldOne"
        id="fieldOneID"
        onChange={onChange}
        value={formData.fieldOne}
      />
      <label htmlFor="fieldTwo">FieldTwo</label>
      <input
        name="fieldTwo"
        id="fieldTwoID"
        onChange={onChange}
        value={formData.fieldTwo}
      />
      <button type="submit">submit</button>
    </form>
  );
};
```

For more extensive examples, [follow the above instructions](#example-site-installation) to load the example site in the browser.

## The Challenge

> Using React, write a password entry library that meets the following requirements:
>
> - Has two input fields to validate the entry from the user (both inputs must match)
> - Password has a min length of 6 characters
> - Password has at least 1 uppercase character
> - Password has at least 1 lowercase character
> - Password has at least 1 number
> - Password has at least 1 special character (!@#$%^&> \*()\_-+={[}]|:;"'<,>.)
> - Has a submit button that will trigger validation
>   and present success or why the password entry failed

### Structure

The library I created has multiple pieces that can be used on their own, or in tandem.

- `/src/lib/lib.ts` - A well-tested library with sensible defaults and customizable options that can validate passwords (strings) directly. Written in TS, but can be compiled for use in any JS application.

- `/src/lib/useValidation` - A custom hook that uses `lib.ts` under the hood and takes the same options. Provides an `onChange` and an `onSubmit` method so you can get up and running quickly, regardless of your use case and React framework.

- `/src/components/PasswordInput.tsx` - a minimally styled (only uses positioning for the show/hide text toggle) input component that can be used alongside the hook for quick setup. CSS Library and React framework agnostic.

### Approach

Having worked on many form validation libraries in the past, I am well aware of the value of making them highly extensible (new functionality is always just around the corner) and well-tested. So I began on `lib.ts` in a test driven fashion, creating the test harness based on the requirements first, and then building the library to make it pass.

From there, I made a prototype in React with `useState` and event handlers directly so I could get a sense for how I wanted the implementation to look in the DOM, then refactored it into a custom hook and added tests.

Finally, I added some styles that reflected Aweber's brand for fun.

### Notes on password creation and security

I fully realize that the above PW validation criteria were chosen to test engineering acumen in a job interview situation, but I would be remiss if I didn't note that a 6 letter password with these requirements is not necessarily at all secure. [Creating secure passphrases](https://palant.info/2023/01/30/password-strength-explained/) is an important part of keeping your online information safe; various [password entropy calculators](https://www.omnicalculator.com/other/password-entropy) are available for use.

## Final thoughts

Thanks for letting me work on this challenge! Let me know if you have any questions.