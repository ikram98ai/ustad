import React from "react";

interface Props {
  labelText: string;
  inputType: string;
  inputName: string;
}

const TextInput = ({ labelText, inputType, inputName }: Props) => {
  return (
    <>
      <label className="block mb-2 text-indigo-500" htmlFor={inputName}>
        {labelText}
      </label>
      <input
        className="w-full p-2 mb-6  border-b-2 border-indigo-500 outline-none focus:bg-gray-200"
        type={inputType}
        name={inputName}
      />
    </>
  );
};

export default TextInput;
