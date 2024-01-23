import OnChange from "./OnChange";
import OnSubmit from './OnSubmit';
import Logo from "./assets/aweber-logo.svg?react";

function App() {
  return (
    <>
      <div className="py-8 bg-white px-6">
      <div className="container mx-auto">
        <Logo className="h-8 w-auto" alt="Aweber Logo" />
        </div>
      </div>
      <div className="container md:mx-auto mx-4 py-12">
        <h1>Password Reset Demos</h1>
        <OnSubmit />
        <OnChange />
      </div>
    </>
  );
}

export default App;
