import React from "react";

const FormHeader = ({ text }: { text: string }) => {
  return (
    <header>
      <h1 className="text-indigo-700 mx-auto mb-5"> {text} </h1>
    </header>
  );
};

export default FormHeader;
