```js
const fullMatch =   /^(?=.*[!@#$%^&*()_\-+={[}\]|:;"'<,>.])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
```

Breaking it down: ^ to indicate the beginning of the string.
Then 4 positive lookaheads for each of the required character
types listed above. Positive lookaheads allow us to ignore order.
A dot character (any char but line breaks) to start the body of the match,
then a quantifier to indicate that we need at least 6 of said characters.
Finally, $ to indicate the end of the string.

Initially I thought of using a single regex to check all the requirements, but quickly realized this would not allow me the kind of detailed feedback to the end user that I would prefer.

Regex for the following:
Password has a min length of 6 characters
Password has at least 1 uppercase character
Password has at least 1 lowercase character
Password has at least 1 number
Password has at least 1 special character (!@#$%^&*()_-+={[}]|:;"'<,>.)



