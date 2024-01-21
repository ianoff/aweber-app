import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Password Reset</h1>
        <form className="">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              required
            />
            <small>We'll never share your email with anyone else.</small>

            <button type="submit">Submit</button>
        </form>
    </>
  );
}

export default App;
