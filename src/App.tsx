/// <reference types="vite-plugin-svgr/client" />
import OnChangeDemo from "./OnChangeDemo";
import OnSubmitDemo from './OnSubmitDemo';
import Logo from "./assets/aweber-logo.svg?react";

function App() {
  return (
    <>
      <div className="py-8 bg-white px-6">
      <div className="container mx-auto">
        <Logo className="h-8 w-auto" />
        </div>
      </div>
      <div className="container md:mx-auto mx-4 py-12">
        <h1>Password Reset Demos</h1>
        <OnSubmitDemo />
        <OnChangeDemo />
      </div>
    </>
  );
}

export default App;
