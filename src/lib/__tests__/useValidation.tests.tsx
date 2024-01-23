import React from "react";
import { render, renderHook, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import useValidation, { TooManyFieldsError, MissingFormError } from "../useValidation";

describe("useValidation", () => {
  test("returns correct object", () => {
    const { result } = renderHook(() => useValidation({ fieldOne: "", fieldTwo: "" }));
    expect(result.current).toEqual({
      validation: {
        valid: false,
        messages: [],
      },
      onSubmit: expect.any(Function),
      onChange: expect.any(Function),
      formData: { fieldOne: "", fieldTwo: "" },
    });
  });

  test("fires OnChange correctly", async () => {
    const FakeForm = () => {
      const { onChange, formData, validation } = useValidation({
        fieldOne: "",
        fieldTwo: "",
      });
      return (
        <form id="myForm">
          <label htmlFor="fieldOne">FieldOne</label>
          <input
            name="fieldOne"
            id="fieldOne"
            onChange={onChange}
            value={formData.fieldOne}
          ></input>
          <label htmlFor="fieldTwo">FieldTwo</label>
          <input
            name="fieldTwo"
            id="fieldTwo"
            onChange={onChange}
            value={formData.fieldTwo}
          ></input>
          <div data-testid="is-valid">{validation.valid ? "valid" : "not valid"}</div>
          <div data-testid="messages">{validation.messages.join(", ")}</div>
          <button type="submit">submit</button>
        </form>
      );
    };
    render(<FakeForm />);

    await fireEvent.change(screen.getByLabelText(/FieldOne/i), {
      target: { value: "a" },
    });

    expect(screen.getByTestId("is-valid")).toHaveTextContent("not valid");
    expect(screen.getByTestId("messages")).toHaveTextContent(
      `Password must be at least 6 characters in length, Password must have at least one special character (e.g. !@#$%^&*()_-+={[}]|:;"'<,>.]), Password must have at least one uppercase character, Password must have at least one number, Passwords must match exactly`
    );
  });

  test("fires onSubmit correctly", async () => {
    const FakeForm = () => {
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
          <input name="fieldOne" id="fieldOne"></input>
          <label htmlFor="fieldTwo">FieldTwo</label>
          <input name="fieldTwo" id="fieldTwo"></input>
          <div data-testid="is-valid">{validation.valid ? "valid" : "not valid"}</div>
          <div data-testid="messages">{validation.messages.join(", ")}</div>
          <button type="submit">submit</button>
        </form>
      );
    };
    render(<FakeForm />);

    await fireEvent.change(screen.getByLabelText(/FieldOne/i), {
      target: { value: "a" },
    });

    await fireEvent.click(screen.getByText(/submit/));

    // await screen.debug();

    expect(screen.getByTestId("is-valid")).toHaveTextContent("not valid");
    expect(screen.getByTestId("messages")).toHaveTextContent(
      `Password must be at least 6 characters in length, Password must have at least one special character (e.g. !@#$%^&*()_-+={[}]|:;"'<,>.]), Password must have at least one uppercase character, Password must have at least one number, Passwords must match exactly`
    );
  });

  test("throws correct error when two many fields are provided on instantiation", async () => {
    const FakeFormBad = () => {
      const { onChange, formData, validation } = useValidation({
        fieldOne: "",
        fieldTwo: "",
        fieldThree: "",
      });
      return (
        <form id="myForm">
          <label htmlFor="fieldOne">FieldOne</label>
          <input
            name="fieldOne"
            id="fieldOne"
            onChange={onChange}
            value={formData.fieldOne}
          ></input>
          <label htmlFor="fieldTwo">FieldTwo</label>
          <input
            name="fieldTwo"
            id="fieldTwo"
            onChange={onChange}
            value={formData.fieldTwo}
          ></input>
          <input
            name="fieldTwo"
            id="fieldTwo"
            onChange={onChange}
            value={formData.fieldTwo}
          ></input>
          <div data-testid="is-valid">{validation.valid ? "valid" : "not valid"}</div>
          <div data-testid="messages">{validation.messages.join(", ")}</div>
          <button type="submit">submit</button>
        </form>
      );
    };
    const oldError = console.error;
    console.error = jest.fn();
    expect(() => render(<FakeFormBad />)).toThrow(TooManyFieldsError);
    console.error = oldError;
  });

  test("throws correct error when no form is provided", async () => {
    const FakeNoForm = () => {
      const { onChange, formData, validation } = useValidation({
        fieldOne: "",
        fieldTwo: "",
      });
      return (
        <div>
          <label htmlFor="fieldOne">FieldOne</label>
          <input
            name="fieldOne"
            id="fieldOne"
            onChange={onChange}
            value={formData.fieldOne}
          />
          <label htmlFor="fieldTwo">FieldTwo</label>
          <input
            name="fieldTwo"
            id="fieldTwo"
            onChange={onChange}
            value={formData.fieldTwo}
          />
          <div data-testid="is-valid">{validation.valid ? "valid" : "not valid"}</div>
          <div data-testid="messages">{validation.messages.join(", ")}</div>
          <button type="submit">submit</button>
        </div>
      );
    };
    render(<FakeNoForm />);

    const oldError = console.error;
    console.error = jest.fn();

    await fireEvent.change(screen.getByLabelText(/FieldOne/i), {
      target: { value: "a" },
    });

    expect(console.error).toHaveBeenCalledWith(
      "The element using the onChange function should be within a form element; parent form not found."
    );

    console.error = oldError;
  });
});
