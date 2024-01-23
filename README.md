#TODO: compile TS

# Ian E's Password Challenge

## Installation

Pull down the repo, run `npm i`, run `npm run dev`, open in browser.

## Tests

`npm run test`

## The Challenge

Using React, write a password entry library that meets the following requirements:

 - Has two input fields to validate the entry from the user (both inputs must match)
 - Password has a min length of 6 characters
 - Password has at least 1 uppercase character
 - Password has at least 1 lowercase character
 - Password has at least 1 number
 - Password has at least 1 special character (!@#$%^&*()_-+={[}]|:;"'<,>.)
 - Has a submit button that will trigger validation and present success or why the password entry failed



## Approach

The library I created can be used in multiple ways:

 - /src/lib.ts - A well-tested library that can valid passwords without the DOM
 - /src/useValidation - a custom hook that uses
 - /src/components/PasswordInput.tsx - a minimally styled Password Input component that can be used alongside the library